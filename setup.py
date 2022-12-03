from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in cc_management/__init__.py
from cc_management import __version__ as version

setup(
	name="cc_management",
	version=version,
	description="Tips and Suggestions for a Better Credit Card Management in Frappe",
	author="Agile Shift",
	author_email="contacto@gruporeal.org",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
