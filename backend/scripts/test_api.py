"""
Manual API testing script
"""

import requests
import json
import time
from typing import Dict, Any


class APITester:
    """Manual API testing class"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
    
    def test_health_check(self) -> bool:
        """Test health check endpoint"""
        print("🔍 Testing health check...")
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health check passed: {data['status']}")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False
    
    def test_docs_endpoint(self) -> bool:
        """Test API documentation endpoint"""
        print("🔍 Testing API docs...")
        try:
            response = self.session.get(f"{self.base_url}/docs")
            if response.status_code == 200:
                print("✅ API docs accessible")
                return True
            else:
                print(f"❌ API docs failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ API docs error: {e}")
            return False
    
    def test_quotes_services(self) -> bool:
        """Test quotes services endpoint (public)"""
        print("🔍 Testing quotes services...")
        try:
            response = self.session.get(f"{self.base_url}/api/v1/quotes/services/available")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Available services: {len(data)} services found")
                return True
            else:
                print(f"❌ Services endpoint failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Services endpoint error: {e}")
            return False
    
    def test_protected_endpoint_without_auth(self) -> bool:
        """Test protected endpoint without authentication"""
        print("🔍 Testing protected endpoint without auth...")
        try:
            response = self.session.get(f"{self.base_url}/api/v1/users/profile")
            if response.status_code == 401:
                print("✅ Protected endpoint correctly requires authentication")
                return True
            else:
                print(f"❌ Protected endpoint should require auth: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Protected endpoint error: {e}")
            return False
    
    def test_invalid_endpoint(self) -> bool:
        """Test invalid endpoint"""
        print("🔍 Testing invalid endpoint...")
        try:
            response = self.session.get(f"{self.base_url}/api/v1/invalid/endpoint")
            if response.status_code == 404:
                print("✅ Invalid endpoint correctly returns 404")
                return True
            else:
                print(f"❌ Invalid endpoint should return 404: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Invalid endpoint error: {e}")
            return False
    
    def test_cors_headers(self) -> bool:
        """Test CORS headers"""
        print("🔍 Testing CORS headers...")
        try:
            response = self.session.options(f"{self.base_url}/api/v1/health")
            cors_headers = [
                'access-control-allow-origin',
                'access-control-allow-methods',
                'access-control-allow-headers'
            ]
            
            if all(header in response.headers for header in cors_headers):
                print("✅ CORS headers present")
                return True
            else:
                print("❌ CORS headers missing")
                return False
        except Exception as e:
            print(f"❌ CORS test error: {e}")
            return False
    
    def test_rate_limiting(self) -> bool:
        """Test rate limiting (if implemented)"""
        print("🔍 Testing rate limiting...")
        try:
            # Make multiple requests quickly
            responses = []
            for i in range(10):
                response = self.session.get(f"{self.base_url}/health")
                responses.append(response.status_code)
                time.sleep(0.1)
            
            # Check if all requests succeeded (rate limiting might not be implemented yet)
            if all(status == 200 for status in responses):
                print("✅ Rate limiting test passed (no limits detected)")
                return True
            else:
                print(f"❌ Rate limiting test failed: {responses}")
                return False
        except Exception as e:
            print(f"❌ Rate limiting test error: {e}")
            return False
    
    def run_all_tests(self) -> Dict[str, bool]:
        """Run all tests and return results"""
        print("🚀 Starting API tests...\n")
        
        tests = [
            ("Health Check", self.test_health_check),
            ("API Documentation", self.test_docs_endpoint),
            ("Quotes Services", self.test_quotes_services),
            ("Protected Endpoint", self.test_protected_endpoint_without_auth),
            ("Invalid Endpoint", self.test_invalid_endpoint),
            ("CORS Headers", self.test_cors_headers),
            ("Rate Limiting", self.test_rate_limiting)
        ]
        
        results = {}
        for test_name, test_func in tests:
            try:
                results[test_name] = test_func()
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {e}")
                results[test_name] = False
            print()
        
        return results
    
    def print_summary(self, results: Dict[str, bool]):
        """Print test summary"""
        print("📊 Test Summary:")
        print("=" * 50)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name:<25} {status}")
        
        print("=" * 50)
        print(f"Total: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed!")
        else:
            print(f"⚠️  {total - passed} tests failed")


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Test iRepair Pro API")
    parser.add_argument("--url", default="http://localhost:8000", help="API base URL")
    parser.add_argument("--test", help="Run specific test")
    
    args = parser.parse_args()
    
    tester = APITester(args.url)
    
    if args.test:
        # Run specific test
        test_method = getattr(tester, f"test_{args.test}", None)
        if test_method:
            result = test_method()
            print(f"Test result: {'PASS' if result else 'FAIL'}")
        else:
            print(f"Test '{args.test}' not found")
    else:
        # Run all tests
        results = tester.run_all_tests()
        tester.print_summary(results)


if __name__ == "__main__":
    main()


