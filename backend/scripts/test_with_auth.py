"""
API testing script with Firebase authentication
"""

import requests
import json
import time
from typing import Dict, Any, Optional


class AuthenticatedAPITester:
    """API testing class with authentication"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        self.user_id = None
    
    def set_auth_token(self, token: str, user_id: str):
        """Set authentication token"""
        self.auth_token = token
        self.user_id = user_id
        self.session.headers.update({
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        })
    
    def test_user_profile(self) -> bool:
        """Test user profile endpoint"""
        print("🔍 Testing user profile...")
        try:
            response = self.session.get(f"{self.base_url}/api/v1/users/profile")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ User profile retrieved: {data.get('name', 'Unknown')}")
                return True
            else:
                print(f"❌ User profile failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ User profile error: {e}")
            return False
    
    def test_create_quote(self) -> bool:
        """Test quote creation"""
        print("🔍 Testing quote creation...")
        try:
            quote_data = {
                "phone_model": "iPhone 13 Pro",
                "services": ["screen-replacement"],
                "symptoms": ["Écran cassé"],
                "additional_info": "Test quote creation"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/v1/quotes/",
                json=quote_data
            )
            
            if response.status_code == 201:
                data = response.json()
                print(f"✅ Quote created: {data.get('id', 'Unknown')} - {data.get('total_price', 0)} DH")
                return True
            else:
                print(f"❌ Quote creation failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Quote creation error: {e}")
            return False
    
    def test_calculate_quote(self) -> bool:
        """Test quote calculation"""
        print("🔍 Testing quote calculation...")
        try:
            quote_data = {
                "phone_model": "iPhone 15 Pro Max",
                "services": ["screen-replacement", "battery-replacement"]
            }
            
            response = self.session.post(
                f"{self.base_url}/api/v1/quotes/calculate",
                json=quote_data
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Quote calculated: {data.get('total_price', 0)} DH")
                print(f"   Estimated time: {data.get('estimated_time', 0)} hours")
                print(f"   Warranty: {data.get('warranty', 0)} months")
                return True
            else:
                print(f"❌ Quote calculation failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Quote calculation error: {e}")
            return False
    
    def test_create_order(self) -> bool:
        """Test order creation"""
        print("🔍 Testing order creation...")
        try:
            order_data = {
                "phone_model": "iPhone 13 Pro",
                "services": [
                    {
                        "id": "screen-replacement",
                        "name": "Remplacement d'écran",
                        "description": "Écran complet avec vitre",
                        "price": 1490.0,
                        "estimated_time": 2,
                        "category": "screen",
                        "is_available": True
                    }
                ],
                "customer_id": self.user_id,
                "notes": "Test order creation"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/v1/orders/",
                json=order_data
            )
            
            if response.status_code == 201:
                data = response.json()
                print(f"✅ Order created: {data.get('id', 'Unknown')}")
                print(f"   Tracking ID: {data.get('tracking_id', 'Unknown')}")
                print(f"   Total: {data.get('total_price', 0)} DH")
                return True
            else:
                print(f"❌ Order creation failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Order creation error: {e}")
            return False
    
    def test_get_orders(self) -> bool:
        """Test getting user orders"""
        print("🔍 Testing get orders...")
        try:
            response = self.session.get(f"{self.base_url}/api/v1/orders/")
            
            if response.status_code == 200:
                data = response.json()
                orders = data.get('orders', [])
                print(f"✅ Orders retrieved: {len(orders)} orders found")
                return True
            else:
                print(f"❌ Get orders failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Get orders error: {e}")
            return False
    
    def test_chatbot_query(self) -> bool:
        """Test chatbot query"""
        print("🔍 Testing chatbot query...")
        try:
            chat_data = {
                "message": "Combien coûte une réparation d'écran pour iPhone 13?",
                "session_id": f"test-session-{int(time.time())}"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/v1/chatbot/query",
                json=chat_data
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Chatbot response: {data.get('message', 'No message')[:100]}...")
                if 'sources' in data:
                    print(f"   Sources: {len(data['sources'])} found")
                return True
            else:
                print(f"❌ Chatbot query failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Chatbot query error: {e}")
            return False
    
    def test_rag_query(self) -> bool:
        """Test direct RAG query"""
        print("🔍 Testing RAG query...")
        try:
            rag_data = {
                "question": "Quelle est la garantie sur les réparations?",
                "limit": 3,
                "threshold": 0.7
            }
            
            response = self.session.post(
                f"{self.base_url}/api/v1/chatbot/rag/query",
                json=rag_data
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ RAG response: {data.get('answer', 'No answer')[:100]}...")
                print(f"   Confidence: {data.get('confidence', 0):.2f}")
                print(f"   Sources: {len(data.get('sources', []))}")
                return True
            else:
                print(f"❌ RAG query failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ RAG query error: {e}")
            return False
    
    def test_knowledge_search(self) -> bool:
        """Test knowledge base search"""
        print("🔍 Testing knowledge search...")
        try:
            response = self.session.get(
                f"{self.base_url}/api/v1/chatbot/knowledge/search?query=garantie&limit=5"
            )
            
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                print(f"✅ Knowledge search: {len(results)} results found")
                return True
            else:
                print(f"❌ Knowledge search failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Knowledge search error: {e}")
            return False
    
    def run_authenticated_tests(self) -> Dict[str, bool]:
        """Run all authenticated tests"""
        if not self.auth_token:
            print("❌ No authentication token provided")
            return {}
        
        print("🚀 Starting authenticated API tests...\n")
        
        tests = [
            ("User Profile", self.test_user_profile),
            ("Create Quote", self.test_create_quote),
            ("Calculate Quote", self.test_calculate_quote),
            ("Create Order", self.test_create_order),
            ("Get Orders", self.test_get_orders),
            ("Chatbot Query", self.test_chatbot_query),
            ("RAG Query", self.test_rag_query),
            ("Knowledge Search", self.test_knowledge_search)
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
        print("📊 Authenticated Test Summary:")
        print("=" * 50)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name:<25} {status}")
        
        print("=" * 50)
        print(f"Total: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All authenticated tests passed!")
        else:
            print(f"⚠️  {total - passed} tests failed")


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Test iRepair Pro API with authentication")
    parser.add_argument("--url", default="http://localhost:8000", help="API base URL")
    parser.add_argument("--token", help="Firebase authentication token")
    parser.add_argument("--user-id", help="User ID")
    parser.add_argument("--test", help="Run specific test")
    
    args = parser.parse_args()
    
    tester = AuthenticatedAPITester(args.url)
    
    if args.token and args.user_id:
        tester.set_auth_token(args.token, args.user_id)
        
        if args.test:
            # Run specific test
            test_method = getattr(tester, f"test_{args.test.replace(' ', '_').lower()}", None)
            if test_method:
                result = test_method()
                print(f"Test result: {'PASS' if result else 'FAIL'}")
            else:
                print(f"Test '{args.test}' not found")
        else:
            # Run all tests
            results = tester.run_authenticated_tests()
            tester.print_summary(results)
    else:
        print("❌ Please provide both --token and --user-id for authenticated tests")
        print("Example: python test_with_auth.py --token 'your-firebase-token' --user-id 'user123'")


if __name__ == "__main__":
    main()


