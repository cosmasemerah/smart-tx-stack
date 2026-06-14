> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/core-features/privacy-and-security.md).

# Security practices

At Triton One, we are committed to a defense-in-depth security model to protect our global infrastructure and our customers' services. This document provides an overview of the technical and operational measures we take to ensure the security and integrity of our platform.

#### Access Control

Secure access to our infrastructure is controlled through a centralized Identity and Access Management (IAM) system governed by the principle of least privilege.

* **Authentication:** We enforce strict password policies and mandate the use of Multi-Factor Authentication (MFA) for all services, requiring hardware security tokens (like Yubikeys) for an added layer of protection.
* **Single Sign-On (SSO):** All access to external and internal services is gated through our SSO provider to ensure centralized control and auditing.
* **SSH Access:** All SSH access to our servers is strictly controlled. We use bastion hosts (jump servers), short-lived SSH certificates issued by a central authority, and require hardware key-based authentication instead of passwords.

#### Network Security

Our network is designed to be secure by default, minimizing exposure and encrypting all traffic.

* **Private Network Backbone:** All internal traffic between our servers travels over a private, encrypted network backbone, completely isolated from the public internet.
* **Host Firewalls:** Every host is protected by a firewall configured with a minimal exposure policy. Only the specific ports required for a host's services are opened, and access is restricted to trusted internal subnets.
* **Data in Transit:** All data is encrypted in transit by default, whether it is moving across our internal network or over the public internet via HTTPS.

#### System and Endpoint Security

The security of our individual systems and the devices our team uses is paramount.

* **Secure Employee Workstations:** All employee devices used for work are required to have full disk encryption, up-to-date antivirus software, and must use a VPN when connected to any untrusted network.
* **Automated Patching:** Our servers receive automated security patches on a daily basis to protect against the latest threats.
* **Vulnerability Monitoring:** We continuously monitor critical software packages for new Common Vulnerabilities and Exposures (CVEs) to ensure they are patched proactively.

#### Personnel and Procedural Security

Our security posture is strengthened by our rigorous internal processes and the training of our team.

* **Onboarding and Offboarding:** We follow a formal, secure process for onboarding new employees, granting access gradually based on need. When an employee departs, a strict offboarding procedure is initiated to immediately and completely revoke all access to all systems.
* **Security Training:** Our team undergoes regular security awareness training to stay informed about the latest security best practices, tools, and procedures.

#### Auditing, Alerting, and Incident Response

We believe in proactive monitoring and having a clear plan for any potential issues.

* **Continuous Auditing:** We use automated tools to perform daily security audits on all hosts, checking for compliance with our security policies and identifying potential risks.
* **Real-Time Alerting:** Our systems are monitored 24/7 with a sophisticated alerting stack that notifies our on-call team of any suspicious activity or critical security events.
* **Incident Response & Disaster Recovery:** We have formal, well-documented Security Incident Response and Disaster Recovery plans based on NIST standards. These procedures ensure we can respond to and resolve any potential incidents swiftly and effectively.

#### Contact information

* For general concerns regarding privacy or security, please email <support@triton.one>.
* For urgent security reports, please contact <noc@triton.one>.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/core-features/privacy-and-security.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
