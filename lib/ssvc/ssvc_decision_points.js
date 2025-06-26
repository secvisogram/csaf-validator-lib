export default {
  decisionPoints: [
    {
      name: 'Access Complexity',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'AC',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Specialized access conditions or extenuating circumstances do not exist; the system is always exploitable.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Specialized access conditions exist; for example: the system is exploitable during specific windows of time (a race condition), the system is exploitable under specific circumstances (nondefault configurations), or the system is exploitable with victim interaction (vulnerability exploitable only if user opens e-mail)',
        },
      ],
    },
    {
      name: 'Access Complexity',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'AC',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Specialized access conditions or extenuating circumstances do not exist.',
        },
        {
          key: 'M',
          name: 'Medium',
          description: 'The access conditions are somewhat specialized.',
        },
        {
          key: 'H',
          name: 'High',
          description: 'Specialized access conditions exist.',
        },
      ],
    },
    {
      name: 'Access Vector',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'AV',
      values: [
        {
          key: 'L',
          name: 'Local',
          description:
            'The vulnerability is only exploitable locally (i.e., it requires physical access or authenticated login to the target system)',
        },
        {
          key: 'R',
          name: 'Remote',
          description: 'The vulnerability is exploitable remotely.',
        },
      ],
    },
    {
      name: 'Access Vector',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'AV',
      values: [
        {
          key: 'L',
          name: 'Local',
          description:
            'A vulnerability exploitable with only local access requires the attacker to have either physical access to the vulnerable system or a local (shell) account.',
        },
        {
          key: 'A',
          name: 'Adjacent Network',
          description:
            'A vulnerability exploitable with adjacent network access requires the attacker to have access to either the broadcast or collision domain of the vulnerable software.',
        },
        {
          key: 'N',
          name: 'Network',
          description:
            "A vulnerability exploitable with network access means the vulnerable software is bound to the network stack and the attacker does not require local network access or local access. Such a vulnerability is often termed 'remotely exploitable'.",
        },
      ],
    },
    {
      name: 'Attack Complexity',
      namespace: 'cvss',
      version: '3.0.0',
      key: 'AC',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Specialized access conditions or extenuating circumstances do not exist. An attacker can expect repeatable success against the vulnerable component.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            "A successful attack depends on conditions beyond the attacker's control.",
        },
      ],
    },
    {
      name: 'Attack Complexity',
      namespace: 'cvss',
      version: '3.0.1',
      key: 'AC',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'The attacker must take no measurable action to exploit the vulnerability. The attack requires no target-specific circumvention to exploit the vulnerability. An attacker can expect repeatable success against the vulnerable system. ',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'The successful attack depends on the evasion or circumvention of security-enhancing techniques in place that would otherwise hinder the attack. These include: Evasion of exploit mitigation techniques. The attacker must have additional methods available to bypass security measures in place.',
        },
      ],
    },
    {
      name: 'Attack Requirements',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'AT',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'The successful attack does not depend on the deployment and execution conditions of the vulnerable system. The attacker can expect to be able to reach the vulnerability and execute the exploit under all or most instances of the vulnerability.',
        },
        {
          key: 'P',
          name: 'Present',
          description:
            'The successful attack depends on the presence of specific deployment and execution conditions of the vulnerable system that enable the attack.',
        },
      ],
    },
    {
      name: 'Attack Vector',
      namespace: 'cvss',
      version: '3.0.0',
      key: 'AV',
      values: [
        {
          key: 'P',
          name: 'Physical',
          description:
            'A vulnerability exploitable with Physical access requires the attacker to physically touch or manipulate the vulnerable component. Physical interaction may be brief (e.g. evil maid attack [1]) or persistent.',
        },
        {
          key: 'L',
          name: 'Local',
          description:
            "A vulnerability exploitable with Local access means that the vulnerable component is not bound to the network stack, and the attacker's path is via read/write/execute capabilities. In some cases, the attacker may be logged in locally in order to exploit the vulnerability, otherwise, she may rely on User Interaction to execute a malicious file.",
        },
        {
          key: 'A',
          name: 'Adjacent',
          description:
            'A vulnerability exploitable with adjacent network access means the vulnerable component is bound to the network stack, however the attack is limited to the same shared physical (e.g. Bluetooth, IEEE 802.11), or logical (e.g. local IP subnet) network, and cannot be performed across an OSI layer 3 boundary (e.g. a router).',
        },
        {
          key: 'N',
          name: 'Network',
          description:
            "A vulnerability exploitable with network access means the vulnerable component is bound to the network stack and the attacker's path is through OSI layer 3 (the network layer). Such a vulnerability is often termed 'remotely exploitable' and can be thought of as an attack being exploitable one or more network hops away (e.g. across layer 3 boundaries from routers).",
        },
      ],
    },
    {
      name: 'Attack Vector',
      namespace: 'cvss',
      version: '3.0.1',
      key: 'AV',
      values: [
        {
          key: 'P',
          name: 'Physical',
          description:
            'The attack requires the attacker to physically touch or manipulate the vulnerable system. Physical interaction may be brief (e.g., evil maid attack1) or persistent.',
        },
        {
          key: 'L',
          name: 'Local',
          description:
            'The vulnerable system is not bound to the network stack and the attacker’s path is via read/write/execute capabilities. Either: the attacker exploits the vulnerability by accessing the target system locally (e.g., keyboard, console), or through terminal emulation (e.g., SSH); or the attacker relies on User Interaction by another person to perform actions required to exploit the vulnerability (e.g., using social engineering techniques to trick a legitimate user into opening a malicious document).',
        },
        {
          key: 'A',
          name: 'Adjacent',
          description:
            'The vulnerable system is bound to a protocol stack, but the attack is limited at the protocol level to a logically adjacent topology. This can mean an attack must be launched from the same shared proximity (e.g., Bluetooth, NFC, or IEEE 802.11) or logical network (e.g., local IP subnet), or from within a secure or otherwise limited administrative domain (e.g., MPLS, secure VPN within an administrative network zone).',
        },
        {
          key: 'N',
          name: 'Network',
          description:
            'The vulnerable system is bound to the network stack and the set of possible attackers extends beyond the other options listed below, up to and including the entire Internet. Such a vulnerability is often termed “remotely exploitable” and can be thought of as an attack being exploitable at the protocol level one or more network hops away (e.g., across one or more routers).',
        },
      ],
    },
    {
      name: 'Authentication',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'Au',
      values: [
        {
          key: 'N',
          name: 'Not Required',
          description:
            'Authentication is not required to access or exploit the vulnerability.',
        },
        {
          key: 'R',
          name: 'Required',
          description:
            'Authentication is required to access and exploit the vulnerability.',
        },
      ],
    },
    {
      name: 'Authentication',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'Au',
      values: [
        {
          key: 'M',
          name: 'Multiple',
          description:
            'Exploiting the vulnerability requires that the attacker authenticate two or more times, even if the same credentials are used each time.',
        },
        {
          key: 'S',
          name: 'Single',
          description:
            'The vulnerability requires an attacker to be logged into the system (such as at a command line or via a desktop session or web interface).',
        },
        {
          key: 'N',
          name: 'None',
          description:
            'Authentication is not required to exploit the vulnerability.',
        },
      ],
    },
    {
      name: 'Automatable',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'AU',
      values: [
        {
          key: 'N',
          name: 'No',
          description:
            'Attackers cannot reliably automate all 4 steps of the kill chain for this vulnerability for some reason. These steps are reconnaissance, weaponization, delivery, and exploitation.',
        },
        {
          key: 'Y',
          name: 'Yes',
          description:
            'Attackers can reliably automate all 4 steps of the kill chain. These steps are reconnaissance, weaponization, delivery, and exploitation (e.g., the vulnerability is "wormable").',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Availability Impact',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'A',
      values: [
        { key: 'N', name: 'None', description: 'No impact on availability.' },
        {
          key: 'P',
          name: 'Partial',
          description:
            'Considerable lag in or interruptions in resource availability. For example, a network-based flood attack that reduces available bandwidth to a web server farm to such an extent that only a small number of connections successfully complete.',
        },
        {
          key: 'C',
          name: 'Complete',
          description:
            'Total shutdown of the affected resource. The attacker can render the resource completely unavailable.',
        },
      ],
    },
    {
      name: 'Availability Impact',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'A',
      values: [
        {
          key: 'N',
          name: 'None',
          description: 'There is no impact to the availability of the system.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'There is reduced performance or interruptions in resource availability.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is total loss of availability, resulting in the attacker being able to fully deny access to resources in the impacted component; this loss is either sustained (while the attacker continues to deliver the attack) or persistent (the condition persists even after the attack has completed).',
        },
      ],
    },
    {
      name: 'Availability Impact to the Subsequent System',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'SA',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no impact to availability within the Subsequent System or all availability impact is constrained to the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Performance is reduced or there are interruptions in resource availability. Even if repeated exploitation of the vulnerability is possible, the attacker does not have the ability to completely deny service to legitimate users.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of availability, resulting in the attacker being able to fully deny access to resources in the Subsequent System; this loss is either sustained (while the attacker continues to deliver the attack) or persistent (the condition persists even after the attack has completed).',
        },
      ],
    },
    {
      name: 'Availability Impact to the Vulnerable System',
      namespace: 'cvss',
      version: '3.0.0',
      key: 'VA',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no impact to availability within the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'There is reduced performance or interruptions in resource availability. Even if repeated exploitation of the vulnerability is possible, the attacker does not have the ability to completely deny service to legitimate users. The resources in the Vulnerable System are either partially available all of the time, or fully available only some of the time, but overall there is no direct, serious consequence to the Vulnerable System.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is total loss of availability, resulting in the attacker being able to fully deny access to resources in the impacted component; this loss is either sustained (while the attacker continues to deliver the attack) or persistent (the condition persists even after the attack has completed).',
        },
      ],
    },
    {
      name: 'Availability Requirement',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'AR',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Loss of availability is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Loss of availability is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Loss of availability is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'ND',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Availability Requirement',
      namespace: 'cvss',
      version: '1.1.0',
      key: 'AR',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Loss of availability is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Loss of availability is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Loss of availability is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Availability Requirement',
      namespace: 'cvss',
      version: '1.1.1',
      key: 'AR',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Loss of availability is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Loss of availability is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Loss of availability is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Collateral Damage Potential',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'CDP',
      values: [
        {
          key: 'N',
          name: 'None',
          description: 'There is no potential for physical or property damage.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'A successful exploit of this vulnerability may result in light physical or property damage or loss. The system itself may be damaged or destroyed.',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'A successful exploit of this vulnerability may result in significant physical or property damage or loss.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'A successful exploit of this vulnerability may result in catastrophic physical or property damage and loss. The range of effect may be over a wide area.',
        },
      ],
    },
    {
      name: 'Collateral Damage Potential',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'CDP',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no potential for loss of life, physical assets, productivity or revenue.',
        },
        {
          key: 'LM',
          name: 'Low-Medium',
          description:
            'A successful exploit of this vulnerability may result in moderate physical or property damage or loss.',
        },
        {
          key: 'MH',
          name: 'Medium-High',
          description:
            'A successful exploit of this vulnerability may result in significant physical or property damage or loss.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'A successful exploit of this vulnerability may result in catastrophic physical or property damage and loss. The range of effect may be over a wide area.',
        },
        {
          key: 'ND',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Confidentiality Impact',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'C',
      values: [
        {
          key: 'N',
          name: 'None',
          description: 'No impact on confidentiality.',
        },
        {
          key: 'P',
          name: 'Partial',
          description:
            "There is considerable informational disclosure. Access to critical system files is possible. There is a loss of important information, but the attacker doesn't have control over what is obtainable or the scope of the loss is constrained.",
        },
        {
          key: 'C',
          name: 'Complete',
          description:
            "A total compromise of critical system information. A complete loss of system protection resulting in all critical system files being revealed. The attacker has sovereign control to read all of the system's data (memory, files, etc).",
        },
      ],
    },
    {
      name: 'Confidentiality Impact',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'C',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no loss of confidentiality within the impacted component.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'There is some loss of confidentiality. Access to some restricted information is obtained, but the attacker does not have control over what information is obtained, or the amount or kind of loss is constrained. The information disclosure does not cause a direct, serious loss to the impacted component.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            "There is total loss of confidentiality, resulting in all resources within the impacted component being divulged to the attacker. Alternatively, access to only some restricted information is obtained, but the disclosed information presents a direct, serious impact. For example, an attacker steals the administrator's password, or private encryption keys of a web server.",
        },
      ],
    },
    {
      name: 'Confidentiality Impact to the Subsequent System',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'SC',
      values: [
        {
          key: 'N',
          name: 'Negligible',
          description:
            'There is no loss of confidentiality within the Subsequent System or all confidentiality impact is constrained to the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'There is some loss of confidentiality. Access to some restricted information is obtained, but the attacker does not have control over what information is obtained, or the amount or kind of loss is limited. The information disclosure does not cause a direct, serious loss to the Subsequent System.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of confidentiality, resulting in all resources within the Subsequent System being divulged to the attacker. Alternatively, access to only some restricted information is obtained, but the disclosed information presents a direct, serious impact.',
        },
      ],
    },
    {
      name: 'Confidentiality Impact to the Vulnerable System',
      namespace: 'cvss',
      version: '3.0.0',
      key: 'VC',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no loss of confidentiality within the impacted component.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'There is some loss of confidentiality. Access to some restricted information is obtained, but the attacker does not have control over what information is obtained, or the amount or kind of loss is constrained. The information disclosure does not cause a direct, serious loss to the impacted component.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            "There is total loss of confidentiality, resulting in all resources within the impacted component being divulged to the attacker. Alternatively, access to only some restricted information is obtained, but the disclosed information presents a direct, serious impact. For example, an attacker steals the administrator's password, or private encryption keys of a web server.",
        },
      ],
    },
    {
      name: 'Confidentiality Requirement',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'CR',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Loss of confidentiality is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Loss of confidentiality is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Loss of confidentiality is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'ND',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Confidentiality Requirement',
      namespace: 'cvss',
      version: '1.1.0',
      key: 'CR',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Loss of confidentiality is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Loss of confidentiality is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Loss of confidentiality is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Confidentiality Requirement',
      namespace: 'cvss',
      version: '1.1.1',
      key: 'CR',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Loss of confidentiality is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Loss of confidentiality is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Loss of confidentiality is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'CVSS Qualitative Severity Rating Scale',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'CVSS',
      values: [
        { key: 'N', name: 'None', description: 'None (0.0)' },
        { key: 'L', name: 'Low', description: 'Low (0.1-3.9)' },
        { key: 'M', name: 'Medium', description: 'Medium (4.0-6.9)' },
        { key: 'H', name: 'High', description: 'High (7.0-8.9)' },
        { key: 'C', name: 'Critical', description: 'Critical (9.0-10.0)' },
      ],
    },
    {
      name: 'Equivalence Set 1',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'EQ1',
      values: [
        {
          key: 'L',
          name: 'Low',
          description: '2: AV:P or not(AV:N or PR:N or UI:N)',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            '1: (AV:N or PR:N or UI:N) and not (AV:N and PR:N and UI:N) and not AV:P',
        },
        { key: 'H', name: 'High', description: '0: AV:N and PR:N and UI:N' },
      ],
    },
    {
      name: 'Equivalence Set 2',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'EQ2',
      values: [
        { key: 'L', name: 'Low', description: '1: not (AC:L and AT:N)' },
        { key: 'H', name: 'High', description: '0: AC:L and AT:N' },
      ],
    },
    {
      name: 'Equivalence Set 3',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'EQ3',
      values: [
        { key: 'L', name: 'Low', description: '2: not (VC:H or VI:H or VA:H)' },
        {
          key: 'M',
          name: 'Medium',
          description: '1: not (VC:H and VI:H) and (VC:H or VI:H or VA:H)',
        },
        { key: 'H', name: 'High', description: '0: VC:H and VI:H' },
      ],
    },
    {
      name: 'Equivalence Set 4',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'EQ4',
      values: [
        {
          key: 'L',
          name: 'Low',
          description: '2: not (MSI:S or MSA:S) and not (SC:H or SI:H or SA:H)',
        },
        {
          key: 'M',
          name: 'Medium',
          description: '1: not (MSI:S or MSA:S) and (SC:H or SI:H or SA:H)',
        },
        { key: 'H', name: 'High', description: '0: MSI:S or MSA:S' },
      ],
    },
    {
      name: 'Equivalence Set 5',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'EQ5',
      values: [
        { key: 'L', name: 'Low', description: '2: E:U' },
        { key: 'M', name: 'Medium', description: '1: E:P' },
        { key: 'H', name: 'High', description: '0: E:A' },
      ],
    },
    {
      name: 'Equivalence Set 6',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'EQ6',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            '1: not (CR:H and VC:H) and not (IR:H and VI:H) and not (AR:H and VA:H)',
        },
        {
          key: 'H',
          name: 'High',
          description:
            '0: (CR:H and VC:H) or (IR:H and VI:H) or (AR:H and VA:H)',
        },
      ],
    },
    {
      name: 'Exploit Code Maturity',
      namespace: 'cvss',
      version: '1.2.0',
      key: 'E',
      values: [
        {
          key: 'U',
          name: 'Unproven',
          description:
            'No exploit code is available, or an exploit is theoretical.',
        },
        {
          key: 'POC',
          name: 'Proof-of-Concept',
          description:
            'Proof-of-concept exploit code is available, or an attack demonstration is not practical for most systems. The code or technique is not functional in all situations and may require substantial modification by a skilled attacker.',
        },
        {
          key: 'F',
          name: 'Functional',
          description:
            'Functional exploit code is available. The code works in most situations where the vulnerability exists.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Functional autonomous code exists, or no exploit is required (manual trigger) and details are widely available. Exploit code works in every situation, or is actively being delivered via an autonomous agent (such as a worm or virus). Network-connected systems are likely to encounter scanning or exploitation attempts. Exploit development has reached the level of reliable, widely-available, easy-to-use automated tools.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Exploit Maturity',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'E',
      values: [
        {
          key: 'U',
          name: 'Unreported',
          description:
            'Based on available threat intelligence each of the following must apply: No knowledge of publicly available proof-of-concept exploit code No knowledge of reported attempts to exploit this vulnerability No knowledge of publicly available solutions used to simplify attempts to exploit the vulnerability (i.e., neither the “POC” nor “Attacked” values apply)',
        },
        {
          key: 'P',
          name: 'Proof-of-Concept',
          description:
            'Based on available threat intelligence each of the following must apply: Proof-of-concept exploit code is publicly available No knowledge of reported attempts to exploit this vulnerability No knowledge of publicly available solutions used to simplify attempts to exploit the vulnerability (i.e., the “Attacked” value does not apply)',
        },
        {
          key: 'A',
          name: 'Attacked',
          description:
            'Based on available threat intelligence either of the following must apply: Attacks targeting this vulnerability (attempted or successful) have been reported Solutions to simplify attempts to exploit the vulnerability are publicly or privately available (such as exploit toolkits)',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Exploitability',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'E',
      values: [
        {
          key: 'U',
          name: 'Unproven',
          description:
            'No exploit code is yet available or an exploit method is entirely theoretical.',
        },
        {
          key: 'P',
          name: 'Proof of Concept',
          description:
            'Proof of concept exploit code or an attack demonstration that is not practically applicable to deployed systems is available. The code or technique is not functional in all situations and may require substantial hand tuning by a skilled attacker for use against deployed systems.',
        },
        {
          key: 'F',
          name: 'Functional',
          description:
            'Functional exploit code is available. The code works in most situations where the vulnerability is exploitable.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Either the vulnerability is exploitable by functional mobile autonomous code or no exploit is required (manual trigger) and the details for the manual technique are widely available. The code works in every situation where the vulnerability is exploitable and/or is actively being delivered via a mobile autonomous agent (a worm or virus).',
        },
      ],
    },
    {
      name: 'Exploitability',
      namespace: 'cvss',
      version: '1.1.0',
      key: 'E',
      values: [
        {
          key: 'U',
          name: 'Unproven',
          description:
            'No exploit code is yet available or an exploit method is entirely theoretical.',
        },
        {
          key: 'P',
          name: 'Proof of Concept',
          description:
            'Proof of concept exploit code or an attack demonstration that is not practically applicable to deployed systems is available. The code or technique is not functional in all situations and may require substantial hand tuning by a skilled attacker for use against deployed systems.',
        },
        {
          key: 'F',
          name: 'Functional',
          description:
            'Functional exploit code is available. The code works in most situations where the vulnerability is exploitable.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Either the vulnerability is exploitable by functional mobile autonomous code or no exploit is required (manual trigger) and the details for the manual technique are widely available. The code works in every situation where the vulnerability is exploitable and/or is actively being delivered via a mobile autonomous agent (a worm or virus).',
        },
        {
          key: 'ND',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Impact Bias',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'IB',
      values: [
        {
          key: 'N',
          name: 'Normal',
          description:
            'Confidentiality Impact, Integrity Impact, and Availability Impact are all assigned the same weight.',
        },
        {
          key: 'C',
          name: 'Confidentiality',
          description:
            'Confidentiality impact is assigned greater weight than Integrity Impact or Availability Impact.',
        },
        {
          key: 'I',
          name: 'Integrity',
          description:
            'Integrity Impact is assigned greater weight than Confidentiality Impact or Availability Impact.',
        },
        {
          key: 'A',
          name: 'Availability',
          description:
            'Availability Impact is assigned greater weight than Confidentiality Impact or Integrity Impact.',
        },
      ],
    },
    {
      name: 'Integrity Impact',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'I',
      values: [
        { key: 'N', name: 'None', description: 'No impact on integrity.' },
        {
          key: 'P',
          name: 'Partial',
          description:
            'Considerable breach in integrity. Modification of critical system files or information is possible, but the attacker does not have control over what can be modified, or the scope of what the attacker can affect is constrained. For example, key system or program files may be overwritten or modified, but at random or in a limited context or scope.',
        },
        {
          key: 'C',
          name: 'Complete',
          description:
            'A total compromise of system integrity. There is a complete loss of system protection resulting in the entire system being compromised. The attacker has sovereign control to modify any system files.',
        },
      ],
    },
    {
      name: 'Integrity Impact',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'I',
      values: [
        {
          key: 'N',
          name: 'None',
          description: 'There is no impact to the integrity of the system.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Modification of data is possible, but the attacker does not have control over the consequence of a modification, or the amount of modification is constrained. The data modification does not have a direct, serious impact on the impacted component.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of integrity, or a complete loss of protection.',
        },
      ],
    },
    {
      name: 'Integrity Impact to the Subsequent System',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'SI',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no loss of integrity within the Subsequent System or all integrity impact is constrained to the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Modification of data is possible, but the attacker does not have control over the consequence of a modification, or the amount of modification is limited. The data modification does not have a direct, serious impact to the Subsequent System.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of integrity, or a complete loss of protection. For example, the attacker is able to modify any/all files protected by the Subsequent System. Alternatively, only some files can be modified, but malicious modification would present a direct, serious consequence to the Subsequent System.',
        },
      ],
    },
    {
      name: 'Integrity Impact to the Vulnerable System',
      namespace: 'cvss',
      version: '3.0.0',
      key: 'VI',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no loss of integrity within the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Modification of data is possible, but the attacker does not have control over the consequence of a modification, or the amount of modification is limited. The data modification does not have a direct, serious impact to the Vulnerable System.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of integrity, or a complete loss of protection.',
        },
      ],
    },
    {
      name: 'Integrity Requirement',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'IR',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Loss of integrity is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Loss of integrity is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Loss of integrity is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'ND',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Integrity Requirement',
      namespace: 'cvss',
      version: '1.1.0',
      key: 'IR',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Loss of integrity is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Loss of integrity is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Loss of integrity is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Integrity Requirement',
      namespace: 'cvss',
      version: '1.1.1',
      key: 'IR',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Loss of integrity is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Loss of integrity is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Loss of integrity is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers).',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Attack Complexity',
      namespace: 'cvss',
      version: '3.0.0',
      key: 'MAC',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Specialized access conditions or extenuating circumstances do not exist. An attacker can expect repeatable success against the vulnerable component.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            "A successful attack depends on conditions beyond the attacker's control.",
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Attack Complexity',
      namespace: 'cvss',
      version: '3.0.1',
      key: 'MAC',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'The attacker must take no measurable action to exploit the vulnerability. The attack requires no target-specific circumvention to exploit the vulnerability. An attacker can expect repeatable success against the vulnerable system. ',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'The successful attack depends on the evasion or circumvention of security-enhancing techniques in place that would otherwise hinder the attack. These include: Evasion of exploit mitigation techniques. The attacker must have additional methods available to bypass security measures in place.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Attack Requirements',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'MAT',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'The successful attack does not depend on the deployment and execution conditions of the vulnerable system. The attacker can expect to be able to reach the vulnerability and execute the exploit under all or most instances of the vulnerability.',
        },
        {
          key: 'P',
          name: 'Present',
          description:
            'The successful attack depends on the presence of specific deployment and execution conditions of the vulnerable system that enable the attack.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Attack Vector',
      namespace: 'cvss',
      version: '3.0.0',
      key: 'MAV',
      values: [
        {
          key: 'P',
          name: 'Physical',
          description:
            'A vulnerability exploitable with Physical access requires the attacker to physically touch or manipulate the vulnerable component. Physical interaction may be brief (e.g. evil maid attack [1]) or persistent.',
        },
        {
          key: 'L',
          name: 'Local',
          description:
            "A vulnerability exploitable with Local access means that the vulnerable component is not bound to the network stack, and the attacker's path is via read/write/execute capabilities. In some cases, the attacker may be logged in locally in order to exploit the vulnerability, otherwise, she may rely on User Interaction to execute a malicious file.",
        },
        {
          key: 'A',
          name: 'Adjacent',
          description:
            'A vulnerability exploitable with adjacent network access means the vulnerable component is bound to the network stack, however the attack is limited to the same shared physical (e.g. Bluetooth, IEEE 802.11), or logical (e.g. local IP subnet) network, and cannot be performed across an OSI layer 3 boundary (e.g. a router).',
        },
        {
          key: 'N',
          name: 'Network',
          description:
            "A vulnerability exploitable with network access means the vulnerable component is bound to the network stack and the attacker's path is through OSI layer 3 (the network layer). Such a vulnerability is often termed 'remotely exploitable' and can be thought of as an attack being exploitable one or more network hops away (e.g. across layer 3 boundaries from routers).",
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Attack Vector',
      namespace: 'cvss',
      version: '3.0.1',
      key: 'MAV',
      values: [
        {
          key: 'P',
          name: 'Physical',
          description:
            'The attack requires the attacker to physically touch or manipulate the vulnerable system. Physical interaction may be brief (e.g., evil maid attack1) or persistent.',
        },
        {
          key: 'L',
          name: 'Local',
          description:
            'The vulnerable system is not bound to the network stack and the attacker’s path is via read/write/execute capabilities. Either: the attacker exploits the vulnerability by accessing the target system locally (e.g., keyboard, console), or through terminal emulation (e.g., SSH); or the attacker relies on User Interaction by another person to perform actions required to exploit the vulnerability (e.g., using social engineering techniques to trick a legitimate user into opening a malicious document).',
        },
        {
          key: 'A',
          name: 'Adjacent',
          description:
            'The vulnerable system is bound to a protocol stack, but the attack is limited at the protocol level to a logically adjacent topology. This can mean an attack must be launched from the same shared proximity (e.g., Bluetooth, NFC, or IEEE 802.11) or logical network (e.g., local IP subnet), or from within a secure or otherwise limited administrative domain (e.g., MPLS, secure VPN within an administrative network zone).',
        },
        {
          key: 'N',
          name: 'Network',
          description:
            'The vulnerable system is bound to the network stack and the set of possible attackers extends beyond the other options listed below, up to and including the entire Internet. Such a vulnerability is often termed “remotely exploitable” and can be thought of as an attack being exploitable at the protocol level one or more network hops away (e.g., across one or more routers).',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Availability Impact',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'MA',
      values: [
        {
          key: 'N',
          name: 'None',
          description: 'There is no impact to the availability of the system.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'There is reduced performance or interruptions in resource availability.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is total loss of availability, resulting in the attacker being able to fully deny access to resources in the impacted component; this loss is either sustained (while the attacker continues to deliver the attack) or persistent (the condition persists even after the attack has completed).',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Availability Impact to the Subsequent System',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'MSA',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no impact to availability within the Subsequent System or all availability impact is constrained to the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Performance is reduced or there are interruptions in resource availability. Even if repeated exploitation of the vulnerability is possible, the attacker does not have the ability to completely deny service to legitimate users.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of availability, resulting in the attacker being able to fully deny access to resources in the Subsequent System; this loss is either sustained (while the attacker continues to deliver the attack) or persistent (the condition persists even after the attack has completed).',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Availability Impact to the Subsequent System',
      namespace: 'cvss',
      version: '1.0.1',
      key: 'MSA',
      values: [
        {
          key: 'N',
          name: 'Negligible',
          description:
            'There is negligible impact to availability within the Subsequent System or all availability impact is constrained to the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Performance is reduced or there are interruptions in resource availability. Even if repeated exploitation of the vulnerability is possible, the attacker does not have the ability to completely deny service to legitimate users.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of availability, resulting in the attacker being able to fully deny access to resources in the Subsequent System; this loss is either sustained (while the attacker continues to deliver the attack) or persistent (the condition persists even after the attack has completed).',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Availability Impact to the Vulnerable System',
      namespace: 'cvss',
      version: '3.0.0',
      key: 'MVA',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no impact to availability within the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'There is reduced performance or interruptions in resource availability. Even if repeated exploitation of the vulnerability is possible, the attacker does not have the ability to completely deny service to legitimate users. The resources in the Vulnerable System are either partially available all of the time, or fully available only some of the time, but overall there is no direct, serious consequence to the Vulnerable System.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is total loss of availability, resulting in the attacker being able to fully deny access to resources in the impacted component; this loss is either sustained (while the attacker continues to deliver the attack) or persistent (the condition persists even after the attack has completed).',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Confidentiality Impact',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'MC',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no loss of confidentiality within the impacted component.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'There is some loss of confidentiality. Access to some restricted information is obtained, but the attacker does not have control over what information is obtained, or the amount or kind of loss is constrained. The information disclosure does not cause a direct, serious loss to the impacted component.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            "There is total loss of confidentiality, resulting in all resources within the impacted component being divulged to the attacker. Alternatively, access to only some restricted information is obtained, but the disclosed information presents a direct, serious impact. For example, an attacker steals the administrator's password, or private encryption keys of a web server.",
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Confidentiality Impact to the Subsequent System',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'MSC',
      values: [
        {
          key: 'N',
          name: 'Negligible',
          description:
            'There is no loss of confidentiality within the Subsequent System or all confidentiality impact is constrained to the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'There is some loss of confidentiality. Access to some restricted information is obtained, but the attacker does not have control over what information is obtained, or the amount or kind of loss is limited. The information disclosure does not cause a direct, serious loss to the Subsequent System.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of confidentiality, resulting in all resources within the Subsequent System being divulged to the attacker. Alternatively, access to only some restricted information is obtained, but the disclosed information presents a direct, serious impact.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Confidentiality Impact to the Subsequent System',
      namespace: 'cvss',
      version: '1.0.1',
      key: 'MSC',
      values: [
        {
          key: 'N',
          name: 'Negligible',
          description:
            'There is negligible loss of confidentiality within the Subsequent System or all confidentiality impact is constrained to the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'There is some loss of confidentiality. Access to some restricted information is obtained, but the attacker does not have control over what information is obtained, or the amount or kind of loss is limited. The information disclosure does not cause a direct, serious loss to the Subsequent System.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of confidentiality, resulting in all resources within the Subsequent System being divulged to the attacker. Alternatively, access to only some restricted information is obtained, but the disclosed information presents a direct, serious impact.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Confidentiality Impact to the Vulnerable System',
      namespace: 'cvss',
      version: '3.0.0',
      key: 'MVC',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no loss of confidentiality within the impacted component.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'There is some loss of confidentiality. Access to some restricted information is obtained, but the attacker does not have control over what information is obtained, or the amount or kind of loss is constrained. The information disclosure does not cause a direct, serious loss to the impacted component.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            "There is total loss of confidentiality, resulting in all resources within the impacted component being divulged to the attacker. Alternatively, access to only some restricted information is obtained, but the disclosed information presents a direct, serious impact. For example, an attacker steals the administrator's password, or private encryption keys of a web server.",
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Integrity Impact',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'MI',
      values: [
        {
          key: 'N',
          name: 'None',
          description: 'There is no impact to the integrity of the system.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Modification of data is possible, but the attacker does not have control over the consequence of a modification, or the amount of modification is constrained. The data modification does not have a direct, serious impact on the impacted component.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of integrity, or a complete loss of protection.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Integrity Impact to the Subsequent System',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'MSI',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no loss of integrity within the Subsequent System or all integrity impact is constrained to the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Modification of data is possible, but the attacker does not have control over the consequence of a modification, or the amount of modification is limited. The data modification does not have a direct, serious impact to the Subsequent System.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of integrity, or a complete loss of protection. For example, the attacker is able to modify any/all files protected by the Subsequent System. Alternatively, only some files can be modified, but malicious modification would present a direct, serious consequence to the Subsequent System.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Integrity Impact to the Subsequent System',
      namespace: 'cvss',
      version: '1.0.1',
      key: 'MSI',
      values: [
        {
          key: 'N',
          name: 'Negligible',
          description:
            'There is negligible loss of integrity within the Subsequent System or all integrity impact is constrained to the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Modification of data is possible, but the attacker does not have control over the consequence of a modification, or the amount of modification is limited. The data modification does not have a direct, serious impact to the Subsequent System.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of integrity, or a complete loss of protection. For example, the attacker is able to modify any/all files protected by the Subsequent System. Alternatively, only some files can be modified, but malicious modification would present a direct, serious consequence to the Subsequent System.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
        {
          key: 'S',
          name: 'Safety',
          description:
            'The Safety metric value measures the impact regarding the Safety of a human actor or participant that can be predictably injured as a result of the vulnerability being exploited.',
        },
      ],
    },
    {
      name: 'Modified Integrity Impact to the Vulnerable System',
      namespace: 'cvss',
      version: '3.0.0',
      key: 'MVI',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no loss of integrity within the Vulnerable System.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Modification of data is possible, but the attacker does not have control over the consequence of a modification, or the amount of modification is limited. The data modification does not have a direct, serious impact to the Vulnerable System.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'There is a total loss of integrity, or a complete loss of protection.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Privileges Required',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'MPR',
      values: [
        {
          key: 'H',
          name: 'High',
          description:
            'The attacker is authorized with (i.e. requires) privileges that provide significant (e.g. administrative) control over the vulnerable component that could affect component-wide settings and files.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'The attacker is authorized with (i.e. requires) privileges that provide basic user capabilities that could normally affect only settings and files owned by a user. Alternatively, an attacker with Low privileges may have the ability to cause an impact only to non-sensitive resources.',
        },
        {
          key: 'N',
          name: 'None',
          description:
            'The attacker is unauthorized prior to attack, and therefore does not require any access to settings or files to carry out an attack.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Privileges Required',
      namespace: 'cvss',
      version: '1.0.1',
      key: 'MPR',
      values: [
        {
          key: 'H',
          name: 'High',
          description:
            'The attacker is authorized with (i.e., requires) privileges that provide significant (e.g., administrative) control over the vulnerable system allowing full access to the vulnerable system’s settings and files.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'The attacker is authorized with (i.e., requires) privileges that provide basic capabilities that are typically limited to settings and resources owned by a single low-privileged user. Alternatively, an attacker with Low privileges has the ability to access only non-sensitive resources.',
        },
        {
          key: 'N',
          name: 'None',
          description:
            'The attacker is unauthorized prior to attack, and therefore does not require any access to settings or files to carry out an attack.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified Scope',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'MS',
      values: [
        {
          key: 'U',
          name: 'Unchanged',
          description:
            'An exploited vulnerability can only affect resources managed by the same authority. In this case the vulnerable component and the impacted component are the same.',
        },
        {
          key: 'C',
          name: 'Changed',
          description:
            'An exploited vulnerability can affect resources beyond the authorization privileges intended by the vulnerable component. In this case the vulnerable component and the impacted component are different.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified User Interaction',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'MUI',
      values: [
        {
          key: 'R',
          name: 'Required',
          description:
            'Successful exploitation of this vulnerability requires a user to take some action before the vulnerability can be exploited.',
        },
        {
          key: 'N',
          name: 'None',
          description:
            'The vulnerable system can be exploited without interaction from any user.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Modified User Interaction',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'MUI',
      values: [
        {
          key: 'A',
          name: 'Active',
          description:
            'Successful exploitation of this vulnerability requires a targeted user to perform specific, conscious interactions with the vulnerable system and the attacker’s payload, or the user’s interactions would actively subvert protection mechanisms which would lead to exploitation of the vulnerability.',
        },
        {
          key: 'P',
          name: 'Passive',
          description:
            'Successful exploitation of this vulnerability requires limited interaction by the targeted user with the vulnerable system and the attacker’s payload. These interactions would be considered involuntary and do not require that the user actively subvert protections built into the vulnerable system.',
        },
        {
          key: 'N',
          name: 'None',
          description:
            'The vulnerable system can be exploited without interaction from any human user, other than the attacker.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Privileges Required',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'PR',
      values: [
        {
          key: 'H',
          name: 'High',
          description:
            'The attacker is authorized with (i.e. requires) privileges that provide significant (e.g. administrative) control over the vulnerable component that could affect component-wide settings and files.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'The attacker is authorized with (i.e. requires) privileges that provide basic user capabilities that could normally affect only settings and files owned by a user. Alternatively, an attacker with Low privileges may have the ability to cause an impact only to non-sensitive resources.',
        },
        {
          key: 'N',
          name: 'None',
          description:
            'The attacker is unauthorized prior to attack, and therefore does not require any access to settings or files to carry out an attack.',
        },
      ],
    },
    {
      name: 'Privileges Required',
      namespace: 'cvss',
      version: '1.0.1',
      key: 'PR',
      values: [
        {
          key: 'H',
          name: 'High',
          description:
            'The attacker is authorized with (i.e., requires) privileges that provide significant (e.g., administrative) control over the vulnerable system allowing full access to the vulnerable system’s settings and files.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'The attacker is authorized with (i.e., requires) privileges that provide basic capabilities that are typically limited to settings and resources owned by a single low-privileged user. Alternatively, an attacker with Low privileges has the ability to access only non-sensitive resources.',
        },
        {
          key: 'N',
          name: 'None',
          description:
            'The attacker is unauthorized prior to attack, and therefore does not require any access to settings or files to carry out an attack.',
        },
      ],
    },
    {
      name: 'Provider Urgency',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'U',
      values: [
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
        {
          key: 'C',
          name: 'Clear',
          description:
            'Provider has assessed the impact of this vulnerability as having no urgency (Informational).',
        },
        {
          key: 'G',
          name: 'Green',
          description:
            'Provider has assessed the impact of this vulnerability as having a reduced urgency.',
        },
        {
          key: 'A',
          name: 'Amber',
          description:
            'Provider has assessed the impact of this vulnerability as having a moderate urgency.',
        },
        {
          key: 'R',
          name: 'Red',
          description:
            'Provider has assessed the impact of this vulnerability as having the highest urgency.',
        },
      ],
    },
    {
      name: 'Recovery',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'R',
      values: [
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
        {
          key: 'A',
          name: 'Automatic',
          description:
            'The system recovers services automatically after an attack has been performed.',
        },
        {
          key: 'U',
          name: 'User',
          description:
            'The system requires manual intervention by the user to recover services, after an attack has been performed.',
        },
        {
          key: 'I',
          name: 'Irrecoverable',
          description:
            'The system services are irrecoverable by the user, after an attack has been performed.',
        },
      ],
    },
    {
      name: 'Remediation Level',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'RL',
      values: [
        {
          key: 'OF',
          name: 'Official Fix',
          description:
            'A complete vendor solution is available. Either the vendor has issued the final, official patch which eliminates the vulnerability or an upgrade that is not vulnerable is available.',
        },
        {
          key: 'TF',
          name: 'Temporary Fix',
          description:
            'There is an official but temporary fix available. This includes instances where the vendor issues a temporary hotfix, tool or official workaround.',
        },
        {
          key: 'W',
          name: 'Workaround',
          description:
            'There is an unofficial, non-vendor solution available. In some cases, users of the affected technology will create a patch of their own or provide steps to work around or otherwise mitigate against the vulnerability. When it is generally accepted that these unofficial fixes are adequate in plugging the hole for the mean time and no official remediation is available, this value can be set.',
        },
        {
          key: 'U',
          name: 'Unavailable',
          description:
            'There is either no solution available or it is impossible to apply.',
        },
      ],
    },
    {
      name: 'Remediation Level',
      namespace: 'cvss',
      version: '1.1.0',
      key: 'RL',
      values: [
        {
          key: 'OF',
          name: 'Official Fix',
          description:
            'A complete vendor solution is available. Either the vendor has issued the final, official patch which eliminates the vulnerability or an upgrade that is not vulnerable is available.',
        },
        {
          key: 'TF',
          name: 'Temporary Fix',
          description:
            'There is an official but temporary fix available. This includes instances where the vendor issues a temporary hotfix, tool or official workaround.',
        },
        {
          key: 'W',
          name: 'Workaround',
          description:
            'There is an unofficial, non-vendor solution available. In some cases, users of the affected technology will create a patch of their own or provide steps to work around or otherwise mitigate against the vulnerability. When it is generally accepted that these unofficial fixes are adequate in plugging the hole for the mean time and no official remediation is available, this value can be set.',
        },
        {
          key: 'U',
          name: 'Unavailable',
          description:
            'There is either no solution available or it is impossible to apply.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Report Confidence',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'RC',
      values: [
        {
          key: 'UC',
          name: 'Unconfirmed',
          description:
            'A single unconfirmed source or possibly several conflicting reports. There is little confidence in the validity of the report.',
        },
        {
          key: 'UR',
          name: 'Uncorroborated',
          description:
            'Multiple non-official sources; possibily including independent security companies or research organizations. At this point there may be conflicting technical details or some other lingering ambiguity.',
        },
        {
          key: 'C',
          name: 'Confirmed',
          description:
            'Vendor or author of the affected technology has acknowledged that the vulnerability exists. This value may also be set when existence of a vulnerability is confirmed with absolute confidence through some other event, such as publication of functional proof of concept exploit code or widespread exploitation.',
        },
      ],
    },
    {
      name: 'Report Confidence',
      namespace: 'cvss',
      version: '1.1.0',
      key: 'RC',
      values: [
        {
          key: 'UC',
          name: 'Unconfirmed',
          description:
            'A single unconfirmed source or possibly several conflicting reports. There is little confidence in the validity of the report.',
        },
        {
          key: 'UR',
          name: 'Uncorroborated',
          description:
            'Multiple non-official sources; possibily including independent security companies or research organizations. At this point there may be conflicting technical details or some other lingering ambiguity.',
        },
        {
          key: 'C',
          name: 'Confirmed',
          description:
            'Vendor or author of the affected technology has acknowledged that the vulnerability exists. This value may also be set when existence of a vulnerability is confirmed with absolute confidence through some other event, such as publication of functional proof of concept exploit code or widespread exploitation.',
        },
        {
          key: 'ND',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Report Confidence',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'RC',
      values: [
        {
          key: 'U',
          name: 'Unknown',
          description:
            'There are reports of impacts that indicate a vulnerability is present. The reports indicate that the cause of the vulnerability is unknown, or reports may differ on the cause or impacts of the vulnerability. Reporters are uncertain of the true nature of the vulnerability, and there is little confidence in the validity of the reports or whether a static Base score can be applied given the differences described.',
        },
        {
          key: 'R',
          name: 'Reasonable',
          description:
            'Significant details are published, but researchers either do not have full confidence in the root cause, or do not have access to source code to fully confirm all of the interactions that may lead to the result. Reasonable confidence exists, however, that the bug is reproducible and at least one impact is able to be verified (proof-of-concept exploits may provide this).',
        },
        {
          key: 'C',
          name: 'Confirmed',
          description:
            'Detailed reports exist, or functional reproduction is possible (functional exploits may provide this). Source code is available to independently verify the assertions of the research, or the author or vendor of the affected code has confirmed the presence of the vulnerability.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'Safety',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'SF',
      values: [
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
        {
          key: 'P',
          name: 'Present',
          description:
            'Consequences of the vulnerability meet definition of IEC 61508 consequence categories of "marginal," "critical," or "catastrophic."',
        },
        {
          key: 'N',
          name: 'Negligible',
          description:
            'Consequences of the vulnerability meet definition of IEC 61508 consequence category "negligible."',
        },
      ],
    },
    {
      name: 'Scope',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'S',
      values: [
        {
          key: 'U',
          name: 'Unchanged',
          description:
            'An exploited vulnerability can only affect resources managed by the same authority. In this case the vulnerable component and the impacted component are the same.',
        },
        {
          key: 'C',
          name: 'Changed',
          description:
            'An exploited vulnerability can affect resources beyond the authorization privileges intended by the vulnerable component. In this case the vulnerable component and the impacted component are different.',
        },
      ],
    },
    {
      name: 'Target Distribution',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'TD',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'No target systems exist, or targets are so highly specialized that they only exist in a laboratory setting. Effectively 0% of the environment is at risk.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Targets exist inside the environment, but on a small scale. Between 1% - 15% of the total environment is at risk.',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Targets exist inside the environment, but on a medium scale. Between 16% - 49% of the total environment is at risk.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Targets exist inside the environment on a considerable scale. Between 50% - 100% of the total environment is considered at risk.',
        },
      ],
    },
    {
      name: 'Target Distribution',
      namespace: 'cvss',
      version: '1.1.0',
      key: 'TD',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'No target systems exist, or targets are so highly specialized that they only exist in a laboratory setting. Effectively 0% of the environment is at risk.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'Targets exist inside the environment, but on a small scale. Between 1% - 15% of the total environment is at risk.',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Targets exist inside the environment, but on a medium scale. Between 16% - 49% of the total environment is at risk.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Targets exist inside the environment on a considerable scale. Between 50% - 100% of the total environment is considered at risk.',
        },
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
      ],
    },
    {
      name: 'User Interaction',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'UI',
      values: [
        {
          key: 'R',
          name: 'Required',
          description:
            'Successful exploitation of this vulnerability requires a user to take some action before the vulnerability can be exploited.',
        },
        {
          key: 'N',
          name: 'None',
          description:
            'The vulnerable system can be exploited without interaction from any user.',
        },
      ],
    },
    {
      name: 'User Interaction',
      namespace: 'cvss',
      version: '2.0.0',
      key: 'UI',
      values: [
        {
          key: 'A',
          name: 'Active',
          description:
            'Successful exploitation of this vulnerability requires a targeted user to perform specific, conscious interactions with the vulnerable system and the attacker’s payload, or the user’s interactions would actively subvert protection mechanisms which would lead to exploitation of the vulnerability.',
        },
        {
          key: 'P',
          name: 'Passive',
          description:
            'Successful exploitation of this vulnerability requires limited interaction by the targeted user with the vulnerable system and the attacker’s payload. These interactions would be considered involuntary and do not require that the user actively subvert protections built into the vulnerable system.',
        },
        {
          key: 'N',
          name: 'None',
          description:
            'The vulnerable system can be exploited without interaction from any human user, other than the attacker.',
        },
      ],
    },
    {
      name: 'Value Density',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'V',
      values: [
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
        {
          key: 'D',
          name: 'Diffuse',
          description:
            'The vulnerable system has limited resources. That is, the resources that the attacker will gain control over with a single exploitation event are relatively small.',
        },
        {
          key: 'C',
          name: 'Concentrated',
          description:
            'The vulnerable system is rich in resources. Heuristically, such systems are often the direct responsibility of "system operators" rather than users.',
        },
      ],
    },
    {
      name: 'Vulnerability Response Effort',
      namespace: 'cvss',
      version: '1.0.0',
      key: 'RE',
      values: [
        {
          key: 'X',
          name: 'Not Defined',
          description:
            'This metric value is not defined. See CVSS documentation for details.',
        },
        {
          key: 'L',
          name: 'Low',
          description:
            'The effort required to respond to a vulnerability is low/trivial.',
        },
        {
          key: 'M',
          name: 'Moderate',
          description:
            'The actions required to respond to a vulnerability require some effort on behalf of the consumer and could cause minimal service impact to implement.',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'The actions required to respond to a vulnerability are significant and/or difficult, and may possibly lead to an extended, scheduled service impact. This would need to be considered for scheduling purposes including honoring any embargo on deployment of the selected response. Alternatively, response to the vulnerability in the field is not possible remotely. The only resolution to the vulnerability involves physical replacement (e.g. units deployed would have to be recalled for a depot level repair or replacement).',
        },
      ],
    },
    {
      name: 'Automatable',
      namespace: 'ssvc',
      version: '2.0.0',
      key: 'A',
      values: [
        {
          key: 'N',
          name: 'No',
          description:
            'Attackers cannot reliably automate steps 1-4 of the kill chain for this vulnerability. These steps are (1) reconnaissance, (2) weaponization, (3) delivery, and (4) exploitation.',
        },
        {
          key: 'Y',
          name: 'Yes',
          description:
            'Attackers can reliably automate steps 1-4 of the kill chain.',
        },
      ],
    },
    {
      name: 'Critical Software',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'CS',
      values: [
        {
          key: 'N',
          name: 'No',
          description: 'System does not meet a critical software definition.',
        },
        {
          key: 'Y',
          name: 'Yes',
          description: 'System meets a critical software definition.',
        },
      ],
    },
    {
      name: 'Decline, Track, Coordinate',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'COORDINATE',
      values: [
        { key: 'D', name: 'Decline', description: 'Decline' },
        { key: 'T', name: 'Track', description: 'Track' },
        { key: 'C', name: 'Coordinate', description: 'Coordinate' },
      ],
    },
    {
      name: 'Defer, Scheduled, Out-of-Cycle, Immediate',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'DSOI',
      values: [
        { key: 'D', name: 'Defer', description: 'Defer' },
        { key: 'S', name: 'Scheduled', description: 'Scheduled' },
        { key: 'O', name: 'Out-of-Cycle', description: 'Out-of-Cycle' },
        { key: 'I', name: 'Immediate', description: 'Immediate' },
      ],
    },
    {
      name: 'Exploitation',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'E',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no evidence of active exploitation and no public proof of concept (PoC) of how to exploit the vulnerability.',
        },
        {
          key: 'P',
          name: 'PoC',
          description:
            'One of the following cases is true: (1) private evidence of exploitation is attested but not shared; (2) widespread hearsay attests to exploitation; (3) typical public PoC in places such as Metasploit or ExploitDB; or (4) the vulnerability has a well-known method of exploitation.',
        },
        {
          key: 'A',
          name: 'Active',
          description:
            'Shared, observable, reliable evidence that the exploit is being used in the wild by real attackers; there is credible public reporting.',
        },
      ],
    },
    {
      name: 'Exploitation',
      namespace: 'ssvc',
      version: '1.1.0',
      key: 'E',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'There is no evidence of active exploitation and no public proof of concept (PoC) of how to exploit the vulnerability.',
        },
        {
          key: 'P',
          name: 'Public PoC',
          description:
            'One of the following is true: (1) Typical public PoC exists in sources such as Metasploit or websites like ExploitDB; or (2) the vulnerability has a well-known method of exploitation.',
        },
        {
          key: 'A',
          name: 'Active',
          description:
            'Shared, observable, reliable evidence that the exploit is being used in the wild by real attackers; there is credible public reporting.',
        },
      ],
    },
    {
      name: 'High Value Asset',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'HVA',
      values: [
        {
          key: 'N',
          name: 'No',
          description: 'System does not meet a high value asset definition.',
        },
        {
          key: 'Y',
          name: 'Yes',
          description: 'System meets a high value asset definition.',
        },
      ],
    },
    {
      name: 'Human Impact',
      namespace: 'ssvc',
      version: '2.0.0',
      key: 'HI',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Safety Impact:(None OR Minor) AND Mission Impact:(None OR Degraded OR Crippled)',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            '(Safety Impact:(None OR Minor) AND Mission Impact:MEF Failure) OR (Safety Impact:Major AND Mission Impact:(None OR Degraded OR Crippled))',
        },
        {
          key: 'H',
          name: 'High',
          description:
            '(Safety Impact:Hazardous AND Mission Impact:(None OR Degraded OR Crippled)) OR (Safety Impact:Major AND Mission Impact:MEF Failure)',
        },
        {
          key: 'VH',
          name: 'Very High',
          description:
            'Safety Impact:Catastrophic OR Mission Impact:Mission Failure',
        },
      ],
    },
    {
      name: 'Human Impact',
      namespace: 'ssvc',
      version: '2.0.1',
      key: 'HI',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Safety Impact:(Negligible) AND Mission Impact:(None OR Degraded OR Crippled)',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            '(Safety Impact:Negligible AND Mission Impact:MEF Failure) OR (Safety Impact:Marginal AND Mission Impact:(None OR Degraded OR Crippled))',
        },
        {
          key: 'H',
          name: 'High',
          description:
            '(Safety Impact:Critical AND Mission Impact:(None OR Degraded OR Crippled)) OR (Safety Impact:Marginal AND Mission Impact:MEF Failure)',
        },
        {
          key: 'VH',
          name: 'Very High',
          description:
            'Safety Impact:Catastrophic OR Mission Impact:Mission Failure',
        },
      ],
    },
    {
      name: 'In KEV',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'KEV',
      values: [
        {
          key: 'N',
          name: 'No',
          description: 'Vulnerability is not listed in KEV.',
        },
        {
          key: 'Y',
          name: 'Yes',
          description: 'Vulnerability is listed in KEV.',
        },
      ],
    },
    {
      name: 'Mission and Well-Being Impact',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'MWI',
      values: [
        {
          key: 'L',
          name: 'Low',
          description:
            'Mission Prevalence:Minimal AND Public Well-Being Impact:Minimal',
        },
        {
          key: 'M',
          name: 'Medium',
          description:
            'Mission Prevalence:Support AND Public Well-Being Impact:(Minimal OR Material)',
        },
        {
          key: 'H',
          name: 'High',
          description:
            'Mission Prevalence:Essential OR Public Well-Being Impact:(Irreversible)',
        },
      ],
    },
    {
      name: 'Mission Impact',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'MI',
      values: [
        { key: 'N', name: 'None', description: 'Little to no impact' },
        {
          key: 'NED',
          name: 'Non-Essential Degraded',
          description:
            'Degradation of non-essential functions; chronic degradation would eventually harm essential functions',
        },
        {
          key: 'MSC',
          name: 'MEF Support Crippled',
          description:
            'Activities that directly support essential functions are crippled; essential functions continue for a time',
        },
        {
          key: 'MEF',
          name: 'MEF Failure',
          description:
            'Any one mission essential function fails for period of time longer than acceptable; overall mission of the organization degraded but can still be accomplished for a time',
        },
        {
          key: 'MF',
          name: 'Mission Failure',
          description:
            'Multiple or all mission essential functions fail; ability to recover those functions degraded; organization’s ability to deliver its overall mission fails',
        },
      ],
    },
    {
      name: 'Mission Impact',
      namespace: 'ssvc',
      version: '2.0.0',
      key: 'MI',
      values: [
        {
          key: 'D',
          name: 'Degraded',
          description:
            'Little to no impact up to degradation of non-essential functions; chronic degradation would eventually harm essential functions',
        },
        {
          key: 'MSC',
          name: 'MEF Support Crippled',
          description:
            'Activities that directly support essential functions are crippled; essential functions continue for a time',
        },
        {
          key: 'MEF',
          name: 'MEF Failure',
          description:
            'Any one mission essential function fails for period of time longer than acceptable; overall mission of the organization degraded but can still be accomplished for a time',
        },
        {
          key: 'MF',
          name: 'Mission Failure',
          description:
            'Multiple or all mission essential functions fail; ability to recover those functions degraded; organization’s ability to deliver its overall mission fails',
        },
      ],
    },
    {
      name: 'Public Safety Impact',
      namespace: 'ssvc',
      version: '2.0.0',
      key: 'PSI',
      values: [
        {
          key: 'M',
          name: 'Minimal',
          description: 'Safety Impact:(None OR Minor)',
        },
        {
          key: 'S',
          name: 'Significant',
          description: 'Safety Impact:(Major OR Hazardous OR Catastrophic)',
        },
      ],
    },
    {
      name: 'Public Safety Impact',
      namespace: 'ssvc',
      version: '2.0.1',
      key: 'PSI',
      values: [
        { key: 'M', name: 'Minimal', description: 'Safety Impact:Negligible' },
        {
          key: 'S',
          name: 'Significant',
          description: 'Safety Impact:(Marginal OR Critical OR Catastrophic)',
        },
      ],
    },
    {
      name: 'Public Value Added',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'PVA',
      values: [
        {
          key: 'L',
          name: 'Limited',
          description:
            'Minimal value added to the existing public information because existing information is already high quality and in multiple outlets.',
        },
        {
          key: 'A',
          name: 'Ampliative',
          description:
            'Amplifies and/or augments the existing public information about the vulnerability, for example, adds additional detail, addresses or corrects errors in other public information, draws further attention to the vulnerability, etc.',
        },
        {
          key: 'P',
          name: 'Precedence',
          description:
            'The publication would be the first publicly available, or be coincident with the first publicly available.',
        },
      ],
    },
    {
      name: 'Public Well-Being Impact',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'PWI',
      values: [
        {
          key: 'M',
          name: 'Minimal',
          description:
            'The effect is below the threshold for all aspects described in material. ',
        },
        {
          key: 'M',
          name: 'Material',
          description:
            'Any one or more of these conditions hold. Physical harm: Does one or more of the following: (a) Causes physical distress or injury to system users. (b) Introduces occupational safety hazards. (c) Reduces and/or results in failure of cyber-physical system safety margins. Environment: Major externalities (property damage, environmental damage, etc.) are imposed on other parties. Financial: Financial losses likely lead to bankruptcy of multiple persons. Psychological: Widespread emotional or psychological harm, sufficient to necessitate counseling or therapy, impact populations of people. ',
        },
        {
          key: 'I',
          name: 'Irreversible',
          description:
            'Any one or more of these conditions hold. Physical harm: One or both of the following are true: (a) Multiple fatalities are likely.(b) The cyber-physical system, of which the vulnerable componen is a part, is likely lost or destroyed.  Environment: Extreme or serious externalities (immediate public health threat, environmental damage leading to small  ecosystem collapse, etc.) are imposed on other parties.  Financial: Social systems (elections, financial grid, etc.) supported by the software are destabilized and potentially collapse.  Psychological: N/A ',
        },
      ],
    },
    {
      name: 'Publish, Do Not Publish',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'PUBLISH',
      values: [
        { key: 'N', name: 'Do Not Publish', description: 'Do Not Publish' },
        { key: 'P', name: 'Publish', description: 'Publish' },
      ],
    },
    {
      name: 'Report Credibility',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'RC',
      values: [
        {
          key: 'NC',
          name: 'Not Credible',
          description: 'The report is not credible.',
        },
        { key: 'C', name: 'Credible', description: 'The report is credible.' },
      ],
    },
    {
      name: 'Report Public',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'RP',
      values: [
        {
          key: 'Y',
          name: 'Yes',
          description: 'A public report of the vulnerability exists.',
        },
        {
          key: 'N',
          name: 'No',
          description: 'No public report of the vulnerability exists.',
        },
      ],
    },
    {
      name: 'Safety Impact',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'SI',
      values: [
        {
          key: 'N',
          name: 'None',
          description:
            'The effect is below the threshold for all aspects described in Minor.',
        },
        {
          key: 'M',
          name: 'Minor',
          description:
            'Any one or more of these conditions hold. Physical harm: Physical discomfort for users (not operators) of the system. Operator resiliency: Requires action by system operator to maintain safe system state as a result of exploitation of the vulnerability where operator actions would be well within expected operator abilities; OR causes a minor occupational safety hazard. System resiliency: Small reduction in built-in system safety margins; OR small reduction in system functional capabilities that support safe operation. Environment: Minor externalities (property damage, environmental damage, etc.) imposed on other parties. Financial Financial losses, which are not readily absorbable, to multiple persons. Psychological: Emotional or psychological harm, sufficient to be cause for counselling or therapy, to multiple persons.',
        },
        {
          key: 'J',
          name: 'Major',
          description:
            'Any one or more of these conditions hold. Physical harm: Physical distress and injuries for users (not operators) of the system. Operator resiliency: Requires action by system operator to maintain safe system state as a result of exploitation of the vulnerability where operator actions would be within their capabilities but the actions require their full attention and effort; OR significant distraction or discomfort to operators; OR causes significant occupational safety hazard. System resiliency: System safety margin effectively eliminated but no actual harm; OR failure of system functional capabilities that support safe operation. Environment: Major externalities (property damage, environmental damage, etc.) imposed on other parties. Financial: Financial losses that likely lead to bankruptcy of multiple persons. Psychological: Widespread emotional or psychological harm, sufficient to be cause for counselling or therapy, to populations of people.',
        },
        {
          key: 'H',
          name: 'Hazardous',
          description:
            'Any one or more of these conditions hold. Physical harm: Serious or fatal injuries, where fatalities are plausibly preventable via emergency services or other measures. Operator resiliency: Actions that would keep the system in a safe state are beyond system operator capabilities, resulting in adverse conditions; OR great physical distress to system operators such that they cannot be expected to operate the system properly. System resiliency: Parts of the cyber-physical system break; system’s ability to recover lost functionality remains intact. Environment: Serious externalities (threat to life as well as property, widespread environmental damage, measurable public health risks, etc.) imposed on other parties. Financial: Socio-technical system (elections, financial grid, etc.) of which the affected component is a part is actively destabilized and enters unsafe state. Psychological: N/A.',
        },
        {
          key: 'C',
          name: 'Catastrophic',
          description:
            'Any one or more of these conditions hold. Physical harm: Multiple immediate fatalities (Emergency response probably cannot save the victims.) Operator resiliency: Operator incapacitated (includes fatality or otherwise incapacitated). System resiliency: Total loss of whole cyber-physical system, of which the software is a part. Environment: Extreme externalities (immediate public health threat, environmental damage leading to small ecosystem collapse, etc.) imposed on other parties. Financial: Social systems (elections, financial grid, etc.) supported by the software collapse. Psychological: N/A.',
        },
      ],
    },
    {
      name: 'Safety Impact',
      namespace: 'ssvc',
      version: '2.0.0',
      key: 'SI',
      values: [
        {
          key: 'N',
          name: 'Negligible',
          description:
            'Any one or more of these conditions hold.<br/><br/>- *Physical harm*: Minor injuries at worst (IEC 61508 Negligible).<br/>- *Operator resiliency*: Requires action by system operator to maintain safe system state as a result of exploitation of the vulnerability where operator actions would be well within expected operator abilities; OR causes a minor occupational safety hazard.<br/>- *System resiliency*: Small reduction in built-in system safety margins; OR small reduction in system functional capabilities that support safe operation.<br/>- *Environment*: Minor externalities (property damage, environmental damage, etc.) imposed on other parties.<br/>- *Financial*: Financial losses, which are not readily absorbable, to multiple persons.<br/>- *Psychological*: Emotional or psychological harm, sufficient to be cause for counselling or therapy, to multiple persons.',
        },
        {
          key: 'M',
          name: 'Marginal',
          description:
            'Any one or more of these conditions hold.<br/><br/>- *Physical harm*: Major injuries to one or more persons (IEC 61508 Marginal).<br/>- *Operator resiliency*: Requires action by system operator to maintain safe system state as a result of exploitation of the vulnerability where operator actions would be within their capabilities but the actions require their full attention and effort; OR significant distraction or discomfort to operators; OR causes significant occupational safety hazard.<br/>- *System resiliency*: System safety margin effectively eliminated but no actual harm; OR failure of system functional capabilities that support safe operation.<br/>- *Environment*: Major externalities (property damage, environmental damage, etc.) imposed on other parties.<br/>- *Financial*: Financial losses that likely lead to bankruptcy of multiple persons.<br/>- *Psychological*: Widespread emotional or psychological harm, sufficient to be cause for counselling or therapy, to populations of people.',
        },
        {
          key: 'R',
          name: 'Critical',
          description:
            'Any one or more of these conditions hold.<br/><br/>- *Physical harm*: Loss of life (IEC 61508 Critical).<br/>- *Operator resiliency*: Actions that would keep the system in a safe state are beyond system operator capabilities, resulting in adverse conditions; OR great physical distress to system operators such that they cannot be expected to operate the system properly.<br/>- *System resiliency*: Parts of the cyber-physical system break; system’s ability to recover lost functionality remains intact.<br/>- *Environment*: Serious externalities (threat to life as well as property, widespread environmental damage, measurable public health risks, etc.) imposed on other parties.<br/>- *Financial*: Socio-technical system (elections, financial grid, etc.) of which the affected component is a part is actively destabilized and enters unsafe state.<br/>- *Psychological*: N/A.',
        },
        {
          key: 'C',
          name: 'Catastrophic',
          description:
            'Any one or more of these conditions hold.<br/><br/>- *Physical harm*: Multiple loss of life (IEC 61508 Catastrophic).<br/>- *Operator resiliency*: Operator incapacitated (includes fatality or otherwise incapacitated).<br/>- *System resiliency*: Total loss of whole cyber-physical system, of which the software is a part.<br/>- *Environment*: Extreme externalities (immediate public health threat, environmental damage leading to small ecosystem collapse, etc.) imposed on other parties.<br/>- *Financial*: Social systems (elections, financial grid, etc.) supported by the software collapse.<br/>- *Psychological*: N/A.',
        },
      ],
    },
    {
      name: 'Supplier Cardinality',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'SC',
      values: [
        {
          key: 'O',
          name: 'One',
          description:
            'There is only one supplier of the vulnerable component.',
        },
        {
          key: 'M',
          name: 'Multiple',
          description:
            'There are multiple suppliers of the vulnerable component.',
        },
      ],
    },
    {
      name: 'Supplier Contacted',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'SCON',
      values: [
        {
          key: 'N',
          name: 'No',
          description: 'The supplier has not been contacted.',
        },
        {
          key: 'Y',
          name: 'Yes',
          description: 'The supplier has been contacted.',
        },
      ],
    },
    {
      name: 'Supplier Engagement',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'SE',
      values: [
        {
          key: 'A',
          name: 'Active',
          description:
            'The supplier is responding to the reporter’s contact effort and actively participating in the coordination effort.',
        },
        {
          key: 'U',
          name: 'Unresponsive',
          description:
            'The supplier is not responding to the reporter’s contact effort and not actively participating in the coordination effort.',
        },
      ],
    },
    {
      name: 'Supplier Involvement',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'SINV',
      values: [
        {
          key: 'FR',
          name: 'Fix Ready',
          description: 'The supplier has provided a patch or fix.',
        },
        {
          key: 'C',
          name: 'Cooperative',
          description:
            'The supplier is actively generating a patch or fix; they may or may not have provided a mitigation or work-around in the mean time.',
        },
        {
          key: 'UU',
          name: 'Uncooperative/Unresponsive',
          description:
            'The supplier has not responded, declined to generate a remediation, or no longer exists.',
        },
      ],
    },
    {
      name: 'System Exposure',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'EXP',
      values: [
        {
          key: 'S',
          name: 'Small',
          description: 'Local service or program; highly controlled network',
        },
        {
          key: 'C',
          name: 'Controlled',
          description:
            'Networked service with some access restrictions or mitigations already in place (whether locally or on the network). A successful mitigation must reliably interrupt the adversary’s attack, which requires the attack is detectable both reliably and quickly enough to respond. Controlled covers the situation in which a vulnerability can be exploited through chaining it with other vulnerabilities. The assumption is that the number of steps in the attack path is relatively low; if the path is long enough that it is implausible for an adversary to reliably execute it, then exposure should be small.',
        },
        {
          key: 'U',
          name: 'Unavoidable',
          description:
            'Internet or another widely accessible network where access cannot plausibly be restricted or controlled (e.g., DNS servers, web servers, VOIP servers, email servers)',
        },
      ],
    },
    {
      name: 'System Exposure',
      namespace: 'ssvc',
      version: '1.0.1',
      key: 'EXP',
      values: [
        {
          key: 'S',
          name: 'Small',
          description: 'Local service or program; highly controlled network',
        },
        {
          key: 'C',
          name: 'Controlled',
          description:
            'Networked service with some access restrictions or mitigations already in place (whether locally or on the network). A successful mitigation must reliably interrupt the adversary’s attack, which requires the attack is detectable both reliably and quickly enough to respond. Controlled covers the situation in which a vulnerability can be exploited through chaining it with other vulnerabilities. The assumption is that the number of steps in the attack path is relatively low; if the path is long enough that it is implausible for an adversary to reliably execute it, then exposure should be small.',
        },
        {
          key: 'O',
          name: 'Open',
          description:
            'Internet or another widely accessible network where access cannot plausibly be restricted or controlled (e.g., DNS servers, web servers, VOIP servers, email servers)',
        },
      ],
    },
    {
      name: 'Technical Impact',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'TI',
      values: [
        {
          key: 'P',
          name: 'Partial',
          description:
            'The exploit gives the adversary limited control over, or information exposure about, the behavior of the software that contains the vulnerability. Or the exploit gives the adversary an importantly low stochastic opportunity for total control.',
        },
        {
          key: 'T',
          name: 'Total',
          description:
            'The exploit gives the adversary total control over the behavior of the software, or it gives total disclosure of all information on the system that contains the vulnerability.',
        },
      ],
    },
    {
      name: 'Utility',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'U',
      values: [
        {
          key: 'L',
          name: 'Laborious',
          description: 'Virulence:Slow and Value Density:Diffuse',
        },
        {
          key: 'E',
          name: 'Efficient',
          description:
            'Virulence:Rapid and Value Density:Diffuse OR Virulence:Slow and Value Density:Concentrated',
        },
        {
          key: 'S',
          name: 'Super Effective',
          description: 'Virulence:Rapid and Value Density:Concentrated',
        },
      ],
    },
    {
      name: 'Utility',
      namespace: 'ssvc',
      version: '1.0.1',
      key: 'U',
      values: [
        {
          key: 'L',
          name: 'Laborious',
          description: 'Automatable:No AND Value Density:Diffuse',
        },
        {
          key: 'E',
          name: 'Efficient',
          description:
            '(Automatable:Yes AND Value Density:Diffuse) OR (Automatable:No AND Value Density:Concentrated)',
        },
        {
          key: 'S',
          name: 'Super Effective',
          description: 'Automatable:Yes AND Value Density:Concentrated',
        },
      ],
    },
    {
      name: 'Value Density',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'VD',
      values: [
        {
          key: 'D',
          name: 'Diffuse',
          description:
            'The system that contains the vulnerable component has limited resources. That is, the resources that the adversary will gain control over with a single exploitation event are relatively small.',
        },
        {
          key: 'C',
          name: 'Concentrated',
          description:
            'The system that contains the vulnerable component is rich in resources. Heuristically, such systems are often the direct responsibility of “system operators” rather than users.',
        },
      ],
    },
    {
      name: 'Virulence',
      namespace: 'ssvc',
      version: '1.0.0',
      key: 'V',
      values: [
        {
          key: 'S',
          name: 'Slow',
          description:
            'Steps 1-4 of the kill chain cannot be reliably automated for this vulnerability for some reason. These steps are reconnaissance, weaponization, delivery, and exploitation.',
        },
        {
          key: 'R',
          name: 'Rapid',
          description:
            'Steps 1-4 of the of the kill chain can be reliably automated. If the vulnerability allows remote code execution or command injection, the default response should be rapid.',
        },
      ],
    },
  ],
}
