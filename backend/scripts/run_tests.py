"""
Test runner script with different test configurations
"""

import subprocess
import sys
import os
import argparse
from typing import List


class TestRunner:
    """Test runner with different configurations"""
    
    def __init__(self):
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    def run_command(self, command: List[str], description: str) -> bool:
        """Run a command and return success status"""
        print(f"🚀 {description}...")
        print(f"   Command: {' '.join(command)}")
        
        try:
            result = subprocess.run(
                command,
                cwd=self.project_root,
                capture_output=True,
                text=True,
                check=True
            )
            
            print(f"✅ {description} completed successfully")
            if result.stdout:
                print("   Output:", result.stdout.strip())
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ {description} failed")
            print(f"   Exit code: {e.returncode}")
            if e.stdout:
                print("   Output:", e.stdout.strip())
            if e.stderr:
                print("   Error:", e.stderr.strip())
            return False
    
    def run_unit_tests(self, verbose: bool = False) -> bool:
        """Run unit tests"""
        command = ["python", "-m", "pytest", "tests/test_services.py", "-m", "unit"]
        if verbose:
            command.append("-v")
        
        return self.run_command(command, "Running unit tests")
    
    def run_integration_tests(self, verbose: bool = False) -> bool:
        """Run integration tests"""
        command = ["python", "-m", "pytest", "tests/test_api.py", "-m", "integration"]
        if verbose:
            command.append("-v")
        
        return self.run_command(command, "Running integration tests")
    
    def run_all_tests(self, verbose: bool = False) -> bool:
        """Run all tests"""
        command = ["python", "-m", "pytest", "tests/"]
        if verbose:
            command.append("-v")
        
        return self.run_command(command, "Running all tests")
    
    def run_tests_with_coverage(self, verbose: bool = False) -> bool:
        """Run tests with coverage report"""
        command = [
            "python", "-m", "pytest", 
            "tests/", 
            "--cov=app", 
            "--cov-report=html", 
            "--cov-report=term-missing"
        ]
        if verbose:
            command.append("-v")
        
        return self.run_command(command, "Running tests with coverage")
    
    def run_specific_test(self, test_path: str, verbose: bool = False) -> bool:
        """Run a specific test file or function"""
        command = ["python", "-m", "pytest", test_path]
        if verbose:
            command.append("-v")
        
        return self.run_command(command, f"Running specific test: {test_path}")
    
    def run_linting(self) -> bool:
        """Run code linting"""
        commands = [
            (["python", "-m", "flake8", "app/", "tests/"], "Running flake8 linting"),
            (["python", "-m", "black", "--check", "app/", "tests/"], "Checking code formatting with black"),
            (["python", "-m", "isort", "--check-only", "app/", "tests/"], "Checking import sorting with isort"),
            (["python", "-m", "mypy", "app/"], "Running type checking with mypy")
        ]
        
        all_passed = True
        for command, description in commands:
            if not self.run_command(command, description):
                all_passed = False
        
        return all_passed
    
    def run_manual_tests(self) -> bool:
        """Run manual API tests"""
        commands = [
            (["python", "scripts/test_api.py"], "Running basic API tests"),
            (["python", "scripts/performance_test.py"], "Running performance tests")
        ]
        
        all_passed = True
        for command, description in commands:
            if not self.run_command(command, description):
                all_passed = False
        
        return all_passed
    
    def run_full_test_suite(self, verbose: bool = False) -> bool:
        """Run the complete test suite"""
        print("🚀 Running full test suite...\n")
        
        test_phases = [
            ("Linting", lambda: self.run_linting()),
            ("Unit Tests", lambda: self.run_unit_tests(verbose)),
            ("Integration Tests", lambda: self.run_integration_tests(verbose)),
            ("Coverage Report", lambda: self.run_tests_with_coverage(verbose)),
            ("Manual Tests", lambda: self.run_manual_tests())
        ]
        
        results = {}
        for phase_name, phase_func in test_phases:
            print(f"\n📊 Phase: {phase_name}")
            print("=" * 50)
            results[phase_name] = phase_func()
        
        # Print summary
        print("\n📊 Test Suite Summary:")
        print("=" * 50)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for phase_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{phase_name:<20} {status}")
        
        print("=" * 50)
        print(f"Total: {passed}/{total} phases passed")
        
        if passed == total:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {total - passed} phases failed")
            return False


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Test runner for iRepair Pro Backend")
    parser.add_argument("--type", choices=[
        "unit", "integration", "all", "coverage", "lint", "manual", "full"
    ], default="all", help="Type of tests to run")
    parser.add_argument("--test", help="Specific test file or function to run")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    parser.add_argument("--no-lint", action="store_true", help="Skip linting in full suite")
    
    args = parser.parse_args()
    
    runner = TestRunner()
    
    if args.test:
        success = runner.run_specific_test(args.test, args.verbose)
    elif args.type == "unit":
        success = runner.run_unit_tests(args.verbose)
    elif args.type == "integration":
        success = runner.run_integration_tests(args.verbose)
    elif args.type == "all":
        success = runner.run_all_tests(args.verbose)
    elif args.type == "coverage":
        success = runner.run_tests_with_coverage(args.verbose)
    elif args.type == "lint":
        success = runner.run_linting()
    elif args.type == "manual":
        success = runner.run_manual_tests()
    elif args.type == "full":
        success = runner.run_full_test_suite(args.verbose)
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()


