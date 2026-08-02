from setuptools import setup, find_packages

setup(
    name="physiotrust",
    version="0.1.0",
    description="AI Trust Layer for Physiological Intelligence",
    author="PhysioTrust AI",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=[
        "numpy>=1.24.0",
        "scipy>=1.10.0",
        "pandas>=2.0.0",
        "scikit-learn>=1.2.0",
        "wfdb>=4.1.0",
        "fastapi>=0.100.0",
        "uvicorn[standard]>=0.22.0",
        "pydantic>=2.0.0",
    ],
)
