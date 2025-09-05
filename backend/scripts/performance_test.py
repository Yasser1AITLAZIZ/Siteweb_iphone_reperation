"""
Performance testing script for iRepair Pro API
"""

import requests
import time
import statistics
import concurrent.futures
from typing import List, Dict, Any
import json


class PerformanceTester:
    """Performance testing class"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.results = {}
    
    def measure_endpoint(self, endpoint: str, method: str = "GET", 
                        data: Dict = None, headers: Dict = None, 
                        iterations: int = 10) -> Dict[str, Any]:
        """Measure endpoint performance"""
        print(f"🔍 Testing {method} {endpoint} ({iterations} iterations)...")
        
        times = []
        status_codes = []
        errors = 0
        
        for i in range(iterations):
            try:
                start_time = time.time()
                
                if method == "GET":
                    response = requests.get(f"{self.base_url}{endpoint}", headers=headers)
                elif method == "POST":
                    response = requests.post(f"{self.base_url}{endpoint}", 
                                           json=data, headers=headers)
                elif method == "PUT":
                    response = requests.put(f"{self.base_url}{endpoint}", 
                                          json=data, headers=headers)
                elif method == "DELETE":
                    response = requests.delete(f"{self.base_url}{endpoint}", headers=headers)
                
                end_time = time.time()
                response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                
                times.append(response_time)
                status_codes.append(response.status_code)
                
                if response.status_code >= 400:
                    errors += 1
                    
            except Exception as e:
                errors += 1
                print(f"   Error in iteration {i+1}: {e}")
        
        if times:
            stats = {
                "endpoint": endpoint,
                "method": method,
                "iterations": iterations,
                "avg_response_time": statistics.mean(times),
                "min_response_time": min(times),
                "max_response_time": max(times),
                "median_response_time": statistics.median(times),
                "p95_response_time": sorted(times)[int(len(times) * 0.95)],
                "p99_response_time": sorted(times)[int(len(times) * 0.99)],
                "success_rate": ((iterations - errors) / iterations) * 100,
                "errors": errors,
                "status_codes": list(set(status_codes))
            }
        else:
            stats = {
                "endpoint": endpoint,
                "method": method,
                "iterations": iterations,
                "errors": errors,
                "success_rate": 0
            }
        
        return stats
    
    def test_concurrent_requests(self, endpoint: str, method: str = "GET",
                               data: Dict = None, headers: Dict = None,
                               concurrent_users: int = 10, requests_per_user: int = 5) -> Dict[str, Any]:
        """Test concurrent requests"""
        print(f"🔍 Testing concurrent requests: {concurrent_users} users, {requests_per_user} requests each...")
        
        def make_request():
            times = []
            for _ in range(requests_per_user):
                try:
                    start_time = time.time()
                    
                    if method == "GET":
                        response = requests.get(f"{self.base_url}{endpoint}", headers=headers)
                    elif method == "POST":
                        response = requests.post(f"{self.base_url}{endpoint}", 
                                               json=data, headers=headers)
                    
                    end_time = time.time()
                    response_time = (end_time - start_time) * 1000
                    times.append(response_time)
                    
                except Exception as e:
                    times.append(None)
            
            return times
        
        # Execute concurrent requests
        with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_users) as executor:
            futures = [executor.submit(make_request) for _ in range(concurrent_users)]
            all_times = []
            
            for future in concurrent.futures.as_completed(futures):
                times = future.result()
                all_times.extend([t for t in times if t is not None])
        
        total_requests = concurrent_users * requests_per_user
        successful_requests = len(all_times)
        
        if all_times:
            stats = {
                "endpoint": endpoint,
                "method": method,
                "concurrent_users": concurrent_users,
                "requests_per_user": requests_per_user,
                "total_requests": total_requests,
                "successful_requests": successful_requests,
                "success_rate": (successful_requests / total_requests) * 100,
                "avg_response_time": statistics.mean(all_times),
                "min_response_time": min(all_times),
                "max_response_time": max(all_times),
                "median_response_time": statistics.median(all_times),
                "p95_response_time": sorted(all_times)[int(len(all_times) * 0.95)],
                "p99_response_time": sorted(all_times)[int(len(all_times) * 0.99)],
                "requests_per_second": successful_requests / (max(all_times) / 1000) if all_times else 0
            }
        else:
            stats = {
                "endpoint": endpoint,
                "method": method,
                "concurrent_users": concurrent_users,
                "total_requests": total_requests,
                "successful_requests": 0,
                "success_rate": 0
            }
        
        return stats
    
    def test_load_scenarios(self) -> Dict[str, Any]:
        """Test various load scenarios"""
        print("🚀 Starting load testing scenarios...\n")
        
        scenarios = {
            "health_check": {
                "endpoint": "/health",
                "method": "GET",
                "iterations": 50
            },
            "api_docs": {
                "endpoint": "/docs",
                "method": "GET",
                "iterations": 20
            },
            "quotes_services": {
                "endpoint": "/api/v1/quotes/services/available",
                "method": "GET",
                "iterations": 30
            }
        }
        
        results = {}
        
        for scenario_name, config in scenarios.items():
            result = self.measure_endpoint(**config)
            results[scenario_name] = result
            
            # Print immediate results
            print(f"   {scenario_name}:")
            print(f"     Avg Response Time: {result['avg_response_time']:.2f}ms")
            print(f"     Success Rate: {result['success_rate']:.1f}%")
            print(f"     P95 Response Time: {result['p95_response_time']:.2f}ms")
            print()
        
        return results
    
    def test_concurrent_scenarios(self) -> Dict[str, Any]:
        """Test concurrent load scenarios"""
        print("🚀 Starting concurrent load testing...\n")
        
        scenarios = {
            "health_check_concurrent": {
                "endpoint": "/health",
                "method": "GET",
                "concurrent_users": 20,
                "requests_per_user": 10
            },
            "quotes_services_concurrent": {
                "endpoint": "/api/v1/quotes/services/available",
                "method": "GET",
                "concurrent_users": 15,
                "requests_per_user": 5
            }
        }
        
        results = {}
        
        for scenario_name, config in scenarios.items():
            result = self.test_concurrent_requests(**config)
            results[scenario_name] = result
            
            # Print immediate results
            print(f"   {scenario_name}:")
            print(f"     Total Requests: {result['total_requests']}")
            print(f"     Success Rate: {result['success_rate']:.1f}%")
            print(f"     Avg Response Time: {result['avg_response_time']:.2f}ms")
            print(f"     Requests/Second: {result['requests_per_second']:.2f}")
            print()
        
        return results
    
    def run_performance_tests(self) -> Dict[str, Any]:
        """Run all performance tests"""
        print("🚀 Starting comprehensive performance tests...\n")
        
        all_results = {}
        
        # Basic load tests
        print("📊 Basic Load Tests:")
        print("=" * 50)
        load_results = self.test_load_scenarios()
        all_results["load_tests"] = load_results
        
        print("\n📊 Concurrent Load Tests:")
        print("=" * 50)
        concurrent_results = self.test_concurrent_scenarios()
        all_results["concurrent_tests"] = concurrent_results
        
        return all_results
    
    def print_summary(self, results: Dict[str, Any]):
        """Print performance test summary"""
        print("\n📊 Performance Test Summary:")
        print("=" * 60)
        
        # Load test summary
        if "load_tests" in results:
            print("\n🔍 Load Test Results:")
            for test_name, stats in results["load_tests"].items():
                print(f"  {test_name}:")
                print(f"    Avg Response Time: {stats['avg_response_time']:.2f}ms")
                print(f"    P95 Response Time: {stats['p95_response_time']:.2f}ms")
                print(f"    Success Rate: {stats['success_rate']:.1f}%")
                print()
        
        # Concurrent test summary
        if "concurrent_tests" in results:
            print("\n🔍 Concurrent Test Results:")
            for test_name, stats in results["concurrent_tests"].items():
                print(f"  {test_name}:")
                print(f"    Total Requests: {stats['total_requests']}")
                print(f"    Success Rate: {stats['success_rate']:.1f}%")
                print(f"    Avg Response Time: {stats['avg_response_time']:.2f}ms")
                print(f"    Requests/Second: {stats['requests_per_second']:.2f}")
                print()
        
        # Performance recommendations
        print("\n💡 Performance Recommendations:")
        print("=" * 60)
        
        # Check response times
        all_avg_times = []
        for test_type in results.values():
            for test_stats in test_type.values():
                if 'avg_response_time' in test_stats:
                    all_avg_times.append(test_stats['avg_response_time'])
        
        if all_avg_times:
            max_avg_time = max(all_avg_times)
            if max_avg_time > 1000:
                print("⚠️  Some endpoints have high response times (>1000ms)")
                print("   Consider optimizing database queries and adding caching")
            elif max_avg_time > 500:
                print("⚠️  Some endpoints have moderate response times (>500ms)")
                print("   Consider adding response caching")
            else:
                print("✅ Response times are within acceptable limits (<500ms)")
        
        # Check success rates
        all_success_rates = []
        for test_type in results.values():
            for test_stats in test_type.values():
                if 'success_rate' in test_stats:
                    all_success_rates.append(test_stats['success_rate'])
        
        if all_success_rates:
            min_success_rate = min(all_success_rates)
            if min_success_rate < 95:
                print("⚠️  Some endpoints have low success rates (<95%)")
                print("   Check error handling and server stability")
            else:
                print("✅ Success rates are excellent (>95%)")


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Performance test iRepair Pro API")
    parser.add_argument("--url", default="http://localhost:8000", help="API base URL")
    parser.add_argument("--endpoint", help="Test specific endpoint")
    parser.add_argument("--iterations", type=int, default=10, help="Number of iterations")
    parser.add_argument("--concurrent", type=int, default=10, help="Number of concurrent users")
    
    args = parser.parse_args()
    
    tester = PerformanceTester(args.url)
    
    if args.endpoint:
        # Test specific endpoint
        result = tester.measure_endpoint(args.endpoint, iterations=args.iterations)
        print(f"\n📊 Results for {args.endpoint}:")
        print(f"  Avg Response Time: {result['avg_response_time']:.2f}ms")
        print(f"  Min Response Time: {result['min_response_time']:.2f}ms")
        print(f"  Max Response Time: {result['max_response_time']:.2f}ms")
        print(f"  P95 Response Time: {result['p95_response_time']:.2f}ms")
        print(f"  Success Rate: {result['success_rate']:.1f}%")
    else:
        # Run comprehensive tests
        results = tester.run_performance_tests()
        tester.print_summary(results)


if __name__ == "__main__":
    main()


