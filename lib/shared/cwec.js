export default /** @type {const} */ ({
  weaknesses: [
    {
      id: 'CWE-1004',
      name: "Sensitive Cookie Without 'HttpOnly' Flag",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.10',
    },
    {
      id: 'CWE-1007',
      name: 'Insufficient Visual Distinction of Homoglyphs Presented to User',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.12',
    },
    {
      id: 'CWE-102',
      name: 'Struts: Duplicate Validation Forms',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1021',
      name: 'Improper Restriction of Rendered UI Layers or Frames',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.12',
    },
    {
      id: 'CWE-1022',
      name: 'Use of Web Link to Untrusted Target with window.opener Access',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.12',
    },
    {
      id: 'CWE-1023',
      name: 'Incomplete Comparison with Missing Factors',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '3.1',
    },
    {
      id: 'CWE-1024',
      name: 'Comparison of Incompatible Types',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.1',
    },
    {
      id: 'CWE-1025',
      name: 'Comparison Using Wrong Factors',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.1',
    },
    {
      id: 'CWE-103',
      name: 'Struts: Incomplete validate() Method Definition',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1037',
      name: 'Processor Optimization Removal or Modification of Security-critical Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.1',
    },
    {
      id: 'CWE-1038',
      name: 'Insecure Automated Optimizations',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '3.1',
    },
    {
      id: 'CWE-1039',
      name: 'Automated Recognition Mechanism with Inadequate Detection or Handling of Adversarial Input Perturbations',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '3.1',
    },
    {
      id: 'CWE-104',
      name: 'Struts: Form Bean Does Not Extend Validation Class',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1041',
      name: 'Use of Redundant Code',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1042',
      name: 'Static Member Data Element outside of a Singleton Class Element',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1043',
      name: 'Data Element Aggregating an Excessively Large Number of Non-Primitive Elements',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1044',
      name: 'Architecture with Number of Horizontal Layers Outside of Expected Range',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1045',
      name: 'Parent Class with a Virtual Destructor and a Child Class without a Virtual Destructor',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1046',
      name: 'Creation of Immutable Text Using String Concatenation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1047',
      name: 'Modules with Circular Dependencies',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1048',
      name: 'Invokable Control Element with Large Number of Outward Calls',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1049',
      name: 'Excessive Data Query Operations in a Large Data Table',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-105',
      name: 'Struts: Form Field Without Validator',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1050',
      name: 'Excessive Platform Resource Consumption within a Loop',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1051',
      name: 'Initialization with Hard-Coded Network Resource Configuration Data',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1052',
      name: 'Excessive Use of Hard-Coded Literals in Initialization',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1053',
      name: 'Missing Documentation for Design',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1054',
      name: 'Invocation of a Control Element at an Unnecessarily Deep Horizontal Layer',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1055',
      name: 'Multiple Inheritance from Concrete Classes',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1056',
      name: 'Invokable Control Element with Variadic Parameters',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1057',
      name: 'Data Access Operations Outside of Expected Data Manager Component',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1058',
      name: 'Invokable Control Element in Multi-Thread Context with non-Final Static Storable or Member Element',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1059',
      name: 'Insufficient Technical Documentation',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-106',
      name: 'Struts: Plug-in Framework not in Use',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1060',
      name: 'Excessive Number of Inefficient Server-Side Data Accesses',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1061',
      name: 'Insufficient Encapsulation',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '3.2',
    },
    {
      id: 'CWE-1062',
      name: 'Parent Class with References to Child Class',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1063',
      name: 'Creation of Class Instance within a Static Code Block',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1064',
      name: 'Invokable Control Element with Signature Containing an Excessive Number of Parameters',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1065',
      name: 'Runtime Resource Management Control Element in a Component Built to Run on Application Servers',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1066',
      name: 'Missing Serialization Control Element',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1067',
      name: 'Excessive Execution of Sequential Searches of Data Resource',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1068',
      name: 'Inconsistency Between Implementation and Documented Design',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1069',
      name: 'Empty Exception Block',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-107',
      name: 'Struts: Unused Validation Form',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1070',
      name: 'Serializable Data Element Containing non-Serializable Item Elements',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1071',
      name: 'Empty Code Block',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1072',
      name: 'Data Resource Access without Use of Connection Pooling',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1073',
      name: 'Non-SQL Invokable Control Element with Excessive Number of Data Resource Accesses',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1074',
      name: 'Class with Excessively Deep Inheritance',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1075',
      name: 'Unconditional Control Flow Transfer outside of Switch Block',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1076',
      name: 'Insufficient Adherence to Expected Conventions',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1077',
      name: 'Floating Point Comparison with Incorrect Operator',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1078',
      name: 'Inappropriate Source Code Style or Formatting',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1079',
      name: 'Parent Class without Virtual Destructor Method',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-108',
      name: 'Struts: Unvalidated Action Form',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1080',
      name: 'Source Code File with Excessive Number of Lines of Code',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1082',
      name: 'Class Instance Self Destruction Control Element',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1083',
      name: 'Data Access from Outside Expected Data Manager Component',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1084',
      name: 'Invokable Control Element with Excessive File or Data Access Operations',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1085',
      name: 'Invokable Control Element with Excessive Volume of Commented-out Code',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1086',
      name: 'Class with Excessive Number of Child Classes',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1087',
      name: 'Class with Virtual Method without a Virtual Destructor',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1088',
      name: 'Synchronous Access of Remote Resource without Timeout',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1089',
      name: 'Large Data Table with Excessive Number of Indices',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-109',
      name: 'Struts: Validator Turned Off',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1090',
      name: 'Method Containing Access of a Member Element from Another Class',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1091',
      name: 'Use of Object without Invoking Destructor Method',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1092',
      name: 'Use of Same Invokable Control Element in Multiple Architectural Layers',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1093',
      name: 'Excessively Complex Data Representation',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '3.2',
    },
    {
      id: 'CWE-1094',
      name: 'Excessive Index Range Scan for a Data Resource',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1095',
      name: 'Loop Condition Value Update within the Loop',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1096',
      name: 'Singleton Class Instance Creation without Proper Locking or Synchronization',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1097',
      name: 'Persistent Storable Data Element without Associated Comparison Control Element',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1098',
      name: 'Data Element containing Pointer Item without Proper Copy Control Element',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1099',
      name: 'Inconsistent Naming Conventions for Identifiers',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-11',
      name: 'ASP.NET Misconfiguration: Creating Debug Binary',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-110',
      name: 'Struts: Validator Without Form Field',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1100',
      name: 'Insufficient Isolation of System-Dependent Functions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1101',
      name: 'Reliance on Runtime Component in Generated Code',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1102',
      name: 'Reliance on Machine-Dependent Data Representation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1103',
      name: 'Use of Platform-Dependent Third Party Components',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1104',
      name: 'Use of Unmaintained Third Party Components',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1105',
      name: 'Insufficient Encapsulation of Machine-Dependent Functionality',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1106',
      name: 'Insufficient Use of Symbolic Constants',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1107',
      name: 'Insufficient Isolation of Symbolic Constant Definitions',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1108',
      name: 'Excessive Reliance on Global Variables',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1109',
      name: 'Use of Same Variable for Multiple Purposes',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-111',
      name: 'Direct Use of Unsafe JNI',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1110',
      name: 'Incomplete Design Documentation',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1111',
      name: 'Incomplete I/O Documentation',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1112',
      name: 'Incomplete Documentation of Program Execution',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1113',
      name: 'Inappropriate Comment Style',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1114',
      name: 'Inappropriate Whitespace Style',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1115',
      name: 'Source Code Element without Standard Prologue',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1116',
      name: 'Inaccurate Comments',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1117',
      name: 'Callable with Insufficient Behavioral Summary',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1118',
      name: 'Insufficient Documentation of Error Handling Techniques',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1119',
      name: 'Excessive Use of Unconditional Branching',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-112',
      name: 'Missing XML Validation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1120',
      name: 'Excessive Code Complexity',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '3.2',
    },
    {
      id: 'CWE-1121',
      name: 'Excessive McCabe Cyclomatic Complexity',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1122',
      name: 'Excessive Halstead Complexity',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1123',
      name: 'Excessive Use of Self-Modifying Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1124',
      name: 'Excessively Deep Nesting',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1125',
      name: 'Excessive Attack Surface',
      usage: 'Prohibited',
      rationale:
        'This entry is primarily a quality issue with no direct security implications.',
      version: '3.2',
    },
    {
      id: 'CWE-1126',
      name: 'Declaration of Variable with Unnecessarily Wide Scope',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1127',
      name: 'Compilation with Insufficient Warnings or Errors',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-113',
      name: "Improper Neutralization of CRLF Sequences in HTTP Headers ('HTTP Request/Response Splitting')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-114',
      name: 'Process Control',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-115',
      name: 'Misinterpretation of Input',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-116',
      name: 'Improper Encoding or Escaping of Output',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1164',
      name: 'Irrelevant Code',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '3.2',
    },
    {
      id: 'CWE-117',
      name: 'Improper Output Neutralization for Logs',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1173',
      name: 'Improper Use of Validation Framework',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1174',
      name: 'ASP.NET Misconfiguration: Improper Model Validation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.2',
    },
    {
      id: 'CWE-1176',
      name: 'Inefficient CPU Computation',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '3.2',
    },
    {
      id: 'CWE-1177',
      name: 'Use of Prohibited Code',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '3.2',
    },
    {
      id: 'CWE-118',
      name: "Incorrect Access of Indexable Resource ('Range Error')",
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a level-1 Class (i.e., a child of a Pillar). It might have lower-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1187',
      name: 'DEPRECATED: Use of Uninitialized Resource',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: '3.3',
    },
    {
      id: 'CWE-1188',
      name: 'Initialization of a Resource with an Insecure Default',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '3.3',
    },
    {
      id: 'CWE-1189',
      name: 'Improper Isolation of Shared Resources on System-on-a-Chip (SoC)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-119',
      name: 'Improper Restriction of Operations within the Bounds of a Memory Buffer',
      usage: 'Discouraged',
      rationale:
        'CWE-119 is commonly misused in low-information vulnerability reports when lower-level CWEs could be used instead, or when more details about the vulnerability are available.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1190',
      name: 'DMA Device Enabled Too Early in Boot Phase',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1191',
      name: 'On-Chip Debug and Test Interface With Improper Access Control',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1192',
      name: 'Improper Identifier for IP Block used in System-On-Chip (SOC)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1193',
      name: 'Power-On of Untrusted Execution Core Before Enabling Fabric Access Control',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-12',
      name: 'ASP.NET Misconfiguration: Missing Custom Error Page',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-120',
      name: "Buffer Copy without Checking Size of Input ('Classic Buffer Overflow')",
      usage: 'Allowed-with-Review',
      rationale:
        'There are some indications that this CWE ID might be misused and selected simply because it mentions "buffer overflow" - an increasingly vague term. This CWE entry is only appropriate for "Buffer Copy" operations (not buffer reads), in which where there is no "Checking [the] Size of Input", and (by implication of the copy) writing past the end of the buffer.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1204',
      name: 'Generation of Weak Initialization Vector (IV)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.4',
    },
    {
      id: 'CWE-1209',
      name: 'Failure to Disable Reserved Bits',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-121',
      name: 'Stack-based Buffer Overflow',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-122',
      name: 'Heap-based Buffer Overflow',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1220',
      name: 'Insufficient Granularity of Access Control',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1221',
      name: 'Incorrect Register Defaults or Module Parameters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1222',
      name: 'Insufficient Granularity of Address Regions Protected by Register Locks',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1223',
      name: 'Race Condition for Write-Once Attributes',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1224',
      name: 'Improper Restriction of Write-Once Bit Fields',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1229',
      name: 'Creation of Emergent Resource',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '4.0',
    },
    {
      id: 'CWE-123',
      name: 'Write-what-where Condition',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1230',
      name: 'Exposure of Sensitive Information Through Metadata',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1231',
      name: 'Improper Prevention of Lock Bit Modification',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1232',
      name: 'Improper Lock Behavior After Power State Transition',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1233',
      name: 'Security-Sensitive Hardware Controls with Missing Lock Bit Protection',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1234',
      name: 'Hardware Internal or Debug Modes Allow Override of Locks',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1235',
      name: 'Incorrect Use of Autoboxing and Unboxing for Performance Critical Operations',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1236',
      name: 'Improper Neutralization of Formula Elements in a CSV File',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1239',
      name: 'Improper Zeroization of Hardware Register',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-124',
      name: "Buffer Underwrite ('Buffer Underflow')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1240',
      name: 'Use of a Cryptographic Primitive with a Risky Implementation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1241',
      name: 'Use of Predictable Algorithm in Random Number Generator',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1242',
      name: 'Inclusion of Undocumented Features or Chicken Bits',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1243',
      name: 'Sensitive Non-Volatile Information Not Protected During Debug',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1244',
      name: 'Internal Asset Exposed to Unsafe Debug Access Level or State',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1245',
      name: 'Improper Finite State Machines (FSMs) in Hardware Logic',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1246',
      name: 'Improper Write Handling in Limited-write Non-Volatile Memories',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1247',
      name: 'Improper Protection Against Voltage and Clock Glitches',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1248',
      name: 'Semiconductor Defects in Hardware Logic with Security-Sensitive Implications',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1249',
      name: 'Application-Level Admin Tool with Inconsistent View of Underlying Operating System',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-125',
      name: 'Out-of-bounds Read',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1250',
      name: 'Improper Preservation of Consistency Between Independent Representations of Shared State',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1251',
      name: 'Mirrored Regions with Different Values',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1252',
      name: 'CPU Hardware Not Configured to Support Exclusivity of Write and Execute Operations',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.0',
    },
    {
      id: 'CWE-1253',
      name: 'Incorrect Selection of Fuse Values',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1254',
      name: 'Incorrect Comparison Logic Granularity',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1255',
      name: 'Comparison Logic is Vulnerable to Power Side-Channel Attacks',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1256',
      name: 'Improper Restriction of Software Interfaces to Hardware Features',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1257',
      name: 'Improper Access Control Applied to Mirrored or Aliased Memory Regions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1258',
      name: 'Exposure of Sensitive System Information Due to Uncleared Debug Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1259',
      name: 'Improper Restriction of Security Token Assignment',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-126',
      name: 'Buffer Over-read',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1260',
      name: 'Improper Handling of Overlap Between Protected Memory Ranges',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1261',
      name: 'Improper Handling of Single Event Upsets',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1262',
      name: 'Improper Access Control for Register Interface',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1263',
      name: 'Improper Physical Access Control',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '4.1',
    },
    {
      id: 'CWE-1264',
      name: 'Hardware Logic with Insecure De-Synchronization between Control and Data Channels',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1265',
      name: 'Unintended Reentrant Invocation of Non-reentrant Code Via Nested Calls',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1266',
      name: 'Improper Scrubbing of Sensitive Data from Decommissioned Device',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1267',
      name: 'Policy Uses Obsolete Encoding',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1268',
      name: 'Policy Privileges are not Assigned Consistently Between Control and Data Agents',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1269',
      name: 'Product Released in Non-Release Configuration',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-127',
      name: 'Buffer Under-read',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1270',
      name: 'Generation of Incorrect Security Tokens',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1271',
      name: 'Uninitialized Value on Reset for Registers Holding Security Settings',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1272',
      name: 'Sensitive Information Uncleared Before Debug/Power State Transition',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1273',
      name: 'Device Unlock Credential Sharing',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1274',
      name: 'Improper Access Control for Volatile Memory Containing Boot Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1275',
      name: 'Sensitive Cookie with Improper SameSite Attribute',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1276',
      name: 'Hardware Child Block Incorrectly Connected to Parent System',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1277',
      name: 'Firmware Not Updateable',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1278',
      name: 'Missing Protection Against Hardware Reverse Engineering Using Integrated Circuit (IC) Imaging Techniques',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1279',
      name: 'Cryptographic Operations are run Before Supporting Units are Ready',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-128',
      name: 'Wrap-around Error',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1280',
      name: 'Access Control Check Implemented After Asset is Accessed',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1281',
      name: 'Sequence of Processor Instructions Leads to Unexpected Behavior',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1282',
      name: 'Assumed-Immutable Data is Stored in Writable Memory',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1283',
      name: 'Mutable Attestation or Measurement Reporting Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1284',
      name: 'Improper Validation of Specified Quantity in Input',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1285',
      name: 'Improper Validation of Specified Index, Position, or Offset in Input',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1286',
      name: 'Improper Validation of Syntactic Correctness of Input',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1287',
      name: 'Improper Validation of Specified Type of Input',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1288',
      name: 'Improper Validation of Consistency within Input',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-1289',
      name: 'Improper Validation of Unsafe Equivalence in Input',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.1',
    },
    {
      id: 'CWE-129',
      name: 'Improper Validation of Array Index',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1290',
      name: 'Incorrect Decoding of Security Identifiers ',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1291',
      name: 'Public Key Re-Use for Signing both Debug and Production Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1292',
      name: 'Incorrect Conversion of Security Identifiers',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1293',
      name: 'Missing Source Correlation of Multiple Independent Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1294',
      name: 'Insecure Security Identifier Mechanism',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '4.2',
    },
    {
      id: 'CWE-1295',
      name: 'Debug Messages Revealing Unnecessary Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1296',
      name: 'Incorrect Chaining or Granularity of Debug Components',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1297',
      name: 'Unprotected Confidential Information on Device is Accessible by OSAT Vendors',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1298',
      name: 'Hardware Logic Contains Race Conditions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1299',
      name: 'Missing Protection Mechanism for Alternate Hardware Interface',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-13',
      name: 'ASP.NET Misconfiguration: Password in Configuration File',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-130',
      name: 'Improper Handling of Length Parameter Inconsistency',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1300',
      name: 'Improper Protection of Physical Side Channels',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1301',
      name: 'Insufficient or Incomplete Data Removal within Hardware Component',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1302',
      name: 'Missing Source Identifier in Entity Transactions on a System-On-Chip (SOC)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1303',
      name: 'Non-Transparent Sharing of Microarchitectural Resources',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-1304',
      name: 'Improperly Preserved Integrity of Hardware Configuration State During a Power Save/Restore Operation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.2',
    },
    {
      id: 'CWE-131',
      name: 'Incorrect Calculation of Buffer Size',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1310',
      name: 'Missing Ability to Patch ROM Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1311',
      name: 'Improper Translation of Security Attributes by Fabric Bridge',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1312',
      name: 'Missing Protection for Mirrored Regions in On-Chip Fabric Firewall',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1313',
      name: 'Hardware Allows Activation of Test or Debug Logic at Runtime',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1314',
      name: 'Missing Write Protection for Parametric Data Values',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1315',
      name: 'Improper Setting of Bus Controlling Capability in Fabric End-point',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1316',
      name: 'Fabric-Address Map Allows Programming of Unwarranted Overlaps of Protected and Unprotected Ranges',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1317',
      name: 'Improper Access Control in Fabric Bridge',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1318',
      name: 'Missing Support for Security Features in On-chip Fabrics or Buses',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1319',
      name: 'Improper Protection against Electromagnetic Fault Injection (EM-FI)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-132',
      name: 'DEPRECATED: Miscalculated Null Termination',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1320',
      name: 'Improper Protection for Outbound Error Messages and Alert Signals',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1321',
      name: "Improperly Controlled Modification of Object Prototype Attributes ('Prototype Pollution')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1322',
      name: 'Use of Blocking Code in Single-threaded, Non-blocking Context',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1323',
      name: 'Improper Management of Sensitive Trace Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1324',
      name: 'DEPRECATED: Sensitive Information Accessible by Physical Probing of JTAG Interface',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: '4.3',
    },
    {
      id: 'CWE-1325',
      name: 'Improperly Controlled Sequential Memory Allocation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1326',
      name: 'Missing Immutable Root of Trust in Hardware',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1327',
      name: 'Binding to an Unrestricted IP Address',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1328',
      name: 'Security Version Number Mutable to Older Versions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1329',
      name: 'Reliance on Component That is Not Updateable',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1330',
      name: 'Remanent Data Readable after Memory Erase',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1331',
      name: 'Improper Isolation of Shared Resources in Network On Chip (NoC)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1332',
      name: 'Improper Handling of Faults that Lead to Instruction Skips',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1333',
      name: 'Inefficient Regular Expression Complexity',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.4',
    },
    {
      id: 'CWE-1334',
      name: 'Unauthorized Error Injection Can Degrade Hardware Redundancy',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1335',
      name: 'Incorrect Bitwise Shift of Integer',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.5',
    },
    {
      id: 'CWE-1336',
      name: 'Improper Neutralization of Special Elements Used in a Template Engine',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.5',
    },
    {
      id: 'CWE-1338',
      name: 'Improper Protections Against Hardware Overheating',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.3',
    },
    {
      id: 'CWE-1339',
      name: 'Insufficient Precision or Accuracy of a Real Number',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.5',
    },
    {
      id: 'CWE-134',
      name: 'Use of Externally-Controlled Format String',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1341',
      name: 'Multiple Releases of Same Resource or Handle',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.6',
    },
    {
      id: 'CWE-1342',
      name: 'Information Exposure through Microarchitectural State after Transient Execution',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.6',
    },
    {
      id: 'CWE-135',
      name: 'Incorrect Calculation of Multi-Byte String Length',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1351',
      name: 'Improper Handling of Hardware Behavior in Exceptionally Cold Environments',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.5',
    },
    {
      id: 'CWE-1357',
      name: 'Reliance on Insufficiently Trustworthy Component',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '4.7',
    },
    {
      id: 'CWE-138',
      name: 'Improper Neutralization of Special Elements',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a level-1 Class (i.e., a child of a Pillar). It might have lower-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1384',
      name: 'Improper Handling of Physical or Environmental Conditions',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '4.7',
    },
    {
      id: 'CWE-1385',
      name: 'Missing Origin Validation in WebSockets',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.7',
    },
    {
      id: 'CWE-1386',
      name: 'Insecure Operation on Windows Junction / Mount Point',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.8',
    },
    {
      id: 'CWE-1389',
      name: 'Incorrect Parsing of Numbers with Different Radices',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.9',
    },
    {
      id: 'CWE-1390',
      name: 'Weak Authentication',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '4.9',
    },
    {
      id: 'CWE-1391',
      name: 'Use of Weak Credentials',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '4.9',
    },
    {
      id: 'CWE-1392',
      name: 'Use of Default Credentials',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.9',
    },
    {
      id: 'CWE-1393',
      name: 'Use of Default Password',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.9',
    },
    {
      id: 'CWE-1394',
      name: 'Use of Default Cryptographic Key',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.9',
    },
    {
      id: 'CWE-1395',
      name: 'Dependency on Vulnerable Third-Party Component',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '4.10',
    },
    {
      id: 'CWE-14',
      name: 'Compiler Removal of Code to Clear Buffers',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-140',
      name: 'Improper Neutralization of Delimiters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-141',
      name: 'Improper Neutralization of Parameter/Argument Delimiters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1419',
      name: 'Incorrect Initialization of Resource',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '4.13',
    },
    {
      id: 'CWE-142',
      name: 'Improper Neutralization of Value Delimiters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-1420',
      name: 'Exposure of Sensitive Information during Transient Execution',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.14',
    },
    {
      id: 'CWE-1421',
      name: 'Exposure of Sensitive Information in Shared Microarchitectural Structures during Transient Execution',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities',
      version: '4.14',
    },
    {
      id: 'CWE-1422',
      name: 'Exposure of Sensitive Information caused by Incorrect Data Forwarding during Transient Execution',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities\n\t\t\t  ',
      version: '4.14',
    },
    {
      id: 'CWE-1423',
      name: 'Exposure of Sensitive Information caused by Shared Microarchitectural Predictor State that Influences Transient Execution',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities\n\t\t\t',
      version: '4.14',
    },
    {
      id: 'CWE-1426',
      name: 'Improper Validation of Generative AI Output',
      usage: 'Discouraged',
      rationale:
        'There is potential for this CWE entry to be modified in the future for further clarification as the research community continues to better understand weaknesses in this domain.',
      version: '4.15',
    },
    {
      id: 'CWE-1427',
      name: 'Improper Neutralization of Input Used for LLM Prompting',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '4.16',
    },
    {
      id: 'CWE-143',
      name: 'Improper Neutralization of Record Delimiters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-144',
      name: 'Improper Neutralization of Line Delimiters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-145',
      name: 'Improper Neutralization of Section Delimiters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-146',
      name: 'Improper Neutralization of Expression/Command Delimiters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-147',
      name: 'Improper Neutralization of Input Terminators',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-148',
      name: 'Improper Neutralization of Input Leaders',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-149',
      name: 'Improper Neutralization of Quoting Syntax',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-15',
      name: 'External Control of System or Configuration Setting',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-150',
      name: 'Improper Neutralization of Escape, Meta, or Control Sequences',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-151',
      name: 'Improper Neutralization of Comment Delimiters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-152',
      name: 'Improper Neutralization of Macro Symbols',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-153',
      name: 'Improper Neutralization of Substitution Characters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-154',
      name: 'Improper Neutralization of Variable Name Delimiters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-155',
      name: 'Improper Neutralization of Wildcards or Matching Symbols',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-156',
      name: 'Improper Neutralization of Whitespace',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-157',
      name: 'Failure to Sanitize Paired Delimiters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-158',
      name: 'Improper Neutralization of Null Byte or NUL Character',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-159',
      name: 'Improper Handling of Invalid Use of Special Elements',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-160',
      name: 'Improper Neutralization of Leading Special Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-161',
      name: 'Improper Neutralization of Multiple Leading Special Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-162',
      name: 'Improper Neutralization of Trailing Special Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-163',
      name: 'Improper Neutralization of Multiple Trailing Special Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-164',
      name: 'Improper Neutralization of Internal Special Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-165',
      name: 'Improper Neutralization of Multiple Internal Special Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-166',
      name: 'Improper Handling of Missing Special Element',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-167',
      name: 'Improper Handling of Additional Special Element',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-168',
      name: 'Improper Handling of Inconsistent Special Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-170',
      name: 'Improper Null Termination',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-172',
      name: 'Encoding Error',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-173',
      name: 'Improper Handling of Alternate Encoding',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-174',
      name: 'Double Decoding of the Same Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-175',
      name: 'Improper Handling of Mixed Encoding',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-176',
      name: 'Improper Handling of Unicode Encoding',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-177',
      name: 'Improper Handling of URL Encoding (Hex Encoding)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-178',
      name: 'Improper Handling of Case Sensitivity',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-179',
      name: 'Incorrect Behavior Order: Early Validation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-180',
      name: 'Incorrect Behavior Order: Validate Before Canonicalize',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-181',
      name: 'Incorrect Behavior Order: Validate Before Filter',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-182',
      name: 'Collapse of Data into Unsafe Value',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-183',
      name: 'Permissive List of Allowed Inputs',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-184',
      name: 'Incomplete List of Disallowed Inputs',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-185',
      name: 'Incorrect Regular Expression',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-186',
      name: 'Overly Restrictive Regular Expression',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-187',
      name: 'Partial String Comparison',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-188',
      name: 'Reliance on Data/Memory Layout',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-190',
      name: 'Integer Overflow or Wraparound',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-191',
      name: 'Integer Underflow (Wrap or Wraparound)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-192',
      name: 'Integer Coercion Error',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-193',
      name: 'Off-by-one Error',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-194',
      name: 'Unexpected Sign Extension',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-195',
      name: 'Signed to Unsigned Conversion Error',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-196',
      name: 'Unsigned to Signed Conversion Error',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-197',
      name: 'Numeric Truncation Error',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-198',
      name: 'Use of Incorrect Byte Ordering',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-20',
      name: 'Improper Input Validation',
      usage: 'Discouraged',
      rationale:
        'CWE-20 is commonly misused in low-information vulnerability reports when lower-level CWEs could be used instead, or when more details about the vulnerability are available [REF-1287]. It is not useful for trend analysis. It is also a level-1 Class (i.e., a child of a Pillar).',
      version: 'Draft 3',
    },
    {
      id: 'CWE-200',
      name: 'Exposure of Sensitive Information to an Unauthorized Actor',
      usage: 'Discouraged',
      rationale:
        'CWE-200 is commonly misused to represent the loss of confidentiality in a vulnerability, but confidentiality loss is a technical impact - not a root cause error. As of CWE 4.9, over 400 CWE entries can lead to a loss of confidentiality. Other options are often available. [REF-1287].',
      version: 'Draft 3',
    },
    {
      id: 'CWE-201',
      name: 'Insertion of Sensitive Information Into Sent Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-202',
      name: 'Exposure of Sensitive Information Through Data Queries',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-203',
      name: 'Observable Discrepancy',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-204',
      name: 'Observable Response Discrepancy',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-205',
      name: 'Observable Behavioral Discrepancy',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-206',
      name: 'Observable Internal Behavioral Discrepancy',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-207',
      name: 'Observable Behavioral Discrepancy With Equivalent Products',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-208',
      name: 'Observable Timing Discrepancy',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-209',
      name: 'Generation of Error Message Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-210',
      name: 'Self-generated Error Message Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-211',
      name: 'Externally-Generated Error Message Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-212',
      name: 'Improper Removal of Sensitive Information Before Storage or Transfer',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-213',
      name: 'Exposure of Sensitive Information Due to Incompatible Policies',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-214',
      name: 'Invocation of Process Using Visible Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-215',
      name: 'Insertion of Sensitive Information Into Debugging Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-216',
      name: 'DEPRECATED: Containment Errors (Container Errors)',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-217',
      name: 'DEPRECATED: Failure to Protect Stored Data from Modification',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-218',
      name: 'DEPRECATED: Failure to provide confidentiality for stored data',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-219',
      name: 'Storage of File with Sensitive Data Under Web Root',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-22',
      name: "Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-220',
      name: 'Storage of File With Sensitive Data Under FTP Root',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-221',
      name: 'Information Loss or Omission',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-222',
      name: 'Truncation of Security-relevant Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-223',
      name: 'Omission of Security-relevant Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-224',
      name: 'Obscured Security-relevant Information by Alternate Name',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-225',
      name: 'DEPRECATED: General Information Management Problems',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-226',
      name: 'Sensitive Information in Resource Not Removed Before Reuse',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-228',
      name: 'Improper Handling of Syntactically Invalid Structure',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-229',
      name: 'Improper Handling of Values',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-23',
      name: 'Relative Path Traversal',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-230',
      name: 'Improper Handling of Missing Values',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-231',
      name: 'Improper Handling of Extra Values',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-232',
      name: 'Improper Handling of Undefined Values',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-233',
      name: 'Improper Handling of Parameters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-234',
      name: 'Failure to Handle Missing Parameter',
      usage: 'Discouraged',
      rationale:
        'This CWE entry could be deprecated in a future version of CWE.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-235',
      name: 'Improper Handling of Extra Parameters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-236',
      name: 'Improper Handling of Undefined Parameters',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-237',
      name: 'Improper Handling of Structural Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-238',
      name: 'Improper Handling of Incomplete Structural Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-239',
      name: 'Failure to Handle Incomplete Element',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-24',
      name: "Path Traversal: '../filedir'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-240',
      name: 'Improper Handling of Inconsistent Structural Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-241',
      name: 'Improper Handling of Unexpected Data Type',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-242',
      name: 'Use of Inherently Dangerous Function',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-243',
      name: 'Creation of chroot Jail Without Changing Working Directory',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-244',
      name: "Improper Clearing of Heap Memory Before Release ('Heap Inspection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-245',
      name: 'J2EE Bad Practices: Direct Management of Connections',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-246',
      name: 'J2EE Bad Practices: Direct Use of Sockets',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-247',
      name: 'DEPRECATED: Reliance on DNS Lookups in a Security Decision',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-248',
      name: 'Uncaught Exception',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-249',
      name: 'DEPRECATED: Often Misused: Path Manipulation',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-25',
      name: "Path Traversal: '/../filedir'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-250',
      name: 'Execution with Unnecessary Privileges',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-252',
      name: 'Unchecked Return Value',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-253',
      name: 'Incorrect Check of Function Return Value',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-256',
      name: 'Plaintext Storage of a Password',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-257',
      name: 'Storing Passwords in a Recoverable Format',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-258',
      name: 'Empty Password in Configuration File',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-259',
      name: 'Use of Hard-coded Password',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-26',
      name: "Path Traversal: '/dir/../filename'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-260',
      name: 'Password in Configuration File',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-261',
      name: 'Weak Encoding for Password',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-262',
      name: 'Not Using Password Aging',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-263',
      name: 'Password Aging with Long Expiration',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-266',
      name: 'Incorrect Privilege Assignment',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-267',
      name: 'Privilege Defined With Unsafe Actions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-268',
      name: 'Privilege Chaining',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-269',
      name: 'Improper Privilege Management',
      usage: 'Discouraged',
      rationale:
        'CWE-269 is commonly misused. It can be conflated with "privilege escalation," which is a technical impact that is listed in many low-information vulnerability reports [REF-1287]. It is not useful for trend analysis.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-27',
      name: "Path Traversal: 'dir/../../filename'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-270',
      name: 'Privilege Context Switching Error',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-271',
      name: 'Privilege Dropping / Lowering Errors',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-272',
      name: 'Least Privilege Violation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-273',
      name: 'Improper Check for Dropped Privileges',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-274',
      name: 'Improper Handling of Insufficient Privileges',
      usage: 'Discouraged',
      rationale:
        'This CWE entry could be deprecated in a future version of CWE.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-276',
      name: 'Incorrect Default Permissions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-277',
      name: 'Insecure Inherited Permissions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-278',
      name: 'Insecure Preserved Inherited Permissions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-279',
      name: 'Incorrect Execution-Assigned Permissions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-28',
      name: "Path Traversal: '..\\filedir'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-280',
      name: 'Improper Handling of Insufficient Permissions or Privileges ',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-281',
      name: 'Improper Preservation of Permissions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-282',
      name: 'Improper Ownership Management',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-283',
      name: 'Unverified Ownership',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-284',
      name: 'Improper Access Control',
      usage: 'Discouraged',
      rationale:
        'CWE-284 is extremely high-level, a Pillar. Its name, "Improper Access Control," is often misused in low-information vulnerability reports [REF-1287] or by active use of the OWASP Top Ten, such as "A01:2021-Broken Access Control". It is not useful for trend analysis.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-285',
      name: 'Improper Authorization',
      usage: 'Discouraged',
      rationale:
        'CWE-285 is high-level and lower-level CWEs can frequently be used instead. It is a level-1 Class (i.e., a child of a Pillar).',
      version: 'Draft 3',
    },
    {
      id: 'CWE-286',
      name: 'Incorrect User Management',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-287',
      name: 'Improper Authentication',
      usage: 'Discouraged',
      rationale:
        'This CWE entry might be misused when lower-level CWE entries are likely to be applicable. It is a level-1 Class (i.e., a child of a Pillar).',
      version: 'Draft 3',
    },
    {
      id: 'CWE-288',
      name: 'Authentication Bypass Using an Alternate Path or Channel',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-289',
      name: 'Authentication Bypass by Alternate Name',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-29',
      name: "Path Traversal: '\\..\\filename'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-290',
      name: 'Authentication Bypass by Spoofing',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-291',
      name: 'Reliance on IP Address for Authentication',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-292',
      name: 'DEPRECATED: Trusting Self-reported DNS Name',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-293',
      name: 'Using Referer Field for Authentication',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-294',
      name: 'Authentication Bypass by Capture-replay',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-295',
      name: 'Improper Certificate Validation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-296',
      name: "Improper Following of a Certificate's Chain of Trust",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-297',
      name: 'Improper Validation of Certificate with Host Mismatch',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-298',
      name: 'Improper Validation of Certificate Expiration',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-299',
      name: 'Improper Check for Certificate Revocation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-30',
      name: "Path Traversal: '\\dir\\..\\filename'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-300',
      name: 'Channel Accessible by Non-Endpoint',
      usage: 'Discouraged',
      rationale:
        'CWE-300 is commonly misused for vulnerabilities in which the prerequisites for exploitation require the adversary to be in a privileged "in-the-middle" position.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-301',
      name: 'Reflection Attack in an Authentication Protocol',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-302',
      name: 'Authentication Bypass by Assumed-Immutable Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-303',
      name: 'Incorrect Implementation of Authentication Algorithm',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-304',
      name: 'Missing Critical Step in Authentication',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-305',
      name: 'Authentication Bypass by Primary Weakness',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-306',
      name: 'Missing Authentication for Critical Function',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-307',
      name: 'Improper Restriction of Excessive Authentication Attempts',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-308',
      name: 'Use of Single-factor Authentication',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-309',
      name: 'Use of Password System for Primary Authentication',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-31',
      name: "Path Traversal: 'dir\\..\\..\\filename'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-311',
      name: 'Missing Encryption of Sensitive Data',
      usage: 'Discouraged',
      rationale:
        'CWE-311 is high-level with more precise children available. It is a level-1 Class (i.e., a child of a Pillar).',
      version: 'Draft 3',
    },
    {
      id: 'CWE-312',
      name: 'Cleartext Storage of Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-313',
      name: 'Cleartext Storage in a File or on Disk',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-314',
      name: 'Cleartext Storage in the Registry',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-315',
      name: 'Cleartext Storage of Sensitive Information in a Cookie',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-316',
      name: 'Cleartext Storage of Sensitive Information in Memory',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-317',
      name: 'Cleartext Storage of Sensitive Information in GUI',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-318',
      name: 'Cleartext Storage of Sensitive Information in Executable',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-319',
      name: 'Cleartext Transmission of Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-32',
      name: "Path Traversal: '...' (Triple Dot)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-321',
      name: 'Use of Hard-coded Cryptographic Key',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-322',
      name: 'Key Exchange without Entity Authentication',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-323',
      name: 'Reusing a Nonce, Key Pair in Encryption',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-324',
      name: 'Use of a Key Past its Expiration Date',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-325',
      name: 'Missing Cryptographic Step',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-326',
      name: 'Inadequate Encryption Strength',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-327',
      name: 'Use of a Broken or Risky Cryptographic Algorithm',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-328',
      name: 'Use of Weak Hash',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-329',
      name: 'Generation of Predictable IV with CBC Mode',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-33',
      name: "Path Traversal: '....' (Multiple Dot)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-330',
      name: 'Use of Insufficiently Random Values',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a level-1 Class (i.e., a child of a Pillar). It might have lower-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-331',
      name: 'Insufficient Entropy',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-332',
      name: 'Insufficient Entropy in PRNG',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-333',
      name: 'Improper Handling of Insufficient Entropy in TRNG',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-334',
      name: 'Small Space of Random Values',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-335',
      name: 'Incorrect Usage of Seeds in Pseudo-Random Number Generator (PRNG)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-336',
      name: 'Same Seed in Pseudo-Random Number Generator (PRNG)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-337',
      name: 'Predictable Seed in Pseudo-Random Number Generator (PRNG)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-338',
      name: 'Use of Cryptographically Weak Pseudo-Random Number Generator (PRNG)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-339',
      name: 'Small Seed Space in PRNG',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-34',
      name: "Path Traversal: '....//'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-340',
      name: 'Generation of Predictable Numbers or Identifiers',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-341',
      name: 'Predictable from Observable State',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-342',
      name: 'Predictable Exact Value from Previous Values',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-343',
      name: 'Predictable Value Range from Previous Values',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-344',
      name: 'Use of Invariant Value in Dynamically Changing Context',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-345',
      name: 'Insufficient Verification of Data Authenticity',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a level-1 Class (i.e., a child of a Pillar). It might have lower-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-346',
      name: 'Origin Validation Error',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-347',
      name: 'Improper Verification of Cryptographic Signature',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-348',
      name: 'Use of Less Trusted Source',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-349',
      name: 'Acceptance of Extraneous Untrusted Data With Trusted Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-35',
      name: "Path Traversal: '.../...//'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-350',
      name: 'Reliance on Reverse DNS Resolution for a Security-Critical Action',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-351',
      name: 'Insufficient Type Distinction',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-352',
      name: 'Cross-Site Request Forgery (CSRF)',
      usage: 'Allowed',
      rationale:
        'This is a well-known Composite of multiple weaknesses that must all occur simultaneously, although it is attack-oriented in nature.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-353',
      name: 'Missing Support for Integrity Check',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-354',
      name: 'Improper Validation of Integrity Check Value',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-356',
      name: 'Product UI does not Warn User of Unsafe Actions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-357',
      name: 'Insufficient UI Warning of Dangerous Operations',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-358',
      name: 'Improperly Implemented Security Check for Standard',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-359',
      name: 'Exposure of Private Personal Information to an Unauthorized Actor',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-36',
      name: 'Absolute Path Traversal',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-360',
      name: 'Trust of System Event Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-362',
      name: "Concurrent Execution using Shared Resource with Improper Synchronization ('Race Condition')",
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-363',
      name: 'Race Condition Enabling Link Following',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-364',
      name: 'Signal Handler Race Condition',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-365',
      name: 'DEPRECATED: Race Condition in Switch',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-366',
      name: 'Race Condition within a Thread',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-367',
      name: 'Time-of-check Time-of-use (TOCTOU) Race Condition',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-368',
      name: 'Context Switching Race Condition',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-369',
      name: 'Divide By Zero',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-37',
      name: "Path Traversal: '/absolute/pathname/here'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-370',
      name: 'Missing Check for Certificate Revocation after Initial Check',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-372',
      name: 'Incomplete Internal State Distinction',
      usage: 'Discouraged',
      rationale:
        'This CWE entry could be deprecated in a future version of CWE.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-373',
      name: 'DEPRECATED: State Synchronization Error',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-374',
      name: 'Passing Mutable Objects to an Untrusted Method',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-375',
      name: 'Returning a Mutable Object to an Untrusted Caller',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-377',
      name: 'Insecure Temporary File',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-378',
      name: 'Creation of Temporary File With Insecure Permissions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-379',
      name: 'Creation of Temporary File in Directory with Insecure Permissions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-38',
      name: "Path Traversal: '\\absolute\\pathname\\here'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-382',
      name: 'J2EE Bad Practices: Use of System.exit()',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-383',
      name: 'J2EE Bad Practices: Direct Use of Threads',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-384',
      name: 'Session Fixation',
      usage: 'Allowed',
      rationale:
        'This is a well-known Composite of multiple weaknesses that must all occur simultaneously, although it is attack-oriented in nature.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-385',
      name: 'Covert Timing Channel',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-386',
      name: 'Symbolic Name not Mapping to Correct Object',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-39',
      name: "Path Traversal: 'C:dirname'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-390',
      name: 'Detection of Error Condition Without Action',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-391',
      name: 'Unchecked Error Condition',
      usage: 'Prohibited',
      rationale:
        'This entry is slated for deprecation; it has multiple widespread interpretations by CWE analysts. It combines information from three different taxonomies, but each taxonomy is talking about a slightly different issue.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-392',
      name: 'Missing Report of Error Condition',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-393',
      name: 'Return of Wrong Status Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-394',
      name: 'Unexpected Status Code or Return Value',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-395',
      name: 'Use of NullPointerException Catch to Detect NULL Pointer Dereference',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-396',
      name: 'Declaration of Catch for Generic Exception',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-397',
      name: 'Declaration of Throws for Generic Exception',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-40',
      name: "Path Traversal: '\\\\UNC\\share\\name\\' (Windows UNC Share)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-400',
      name: 'Uncontrolled Resource Consumption',
      usage: 'Discouraged',
      rationale:
        'CWE-400 is intended for incorrect behaviors in which the product is expected to track and restrict how many resources it consumes, but CWE-400 is often misused because it is conflated with the "technical impact" of vulnerabilities in which resource consumption occurs. It is sometimes used for low-information vulnerability reports. It is a level-1 Class (i.e., a child of a Pillar).',
      version: 'Draft 3',
    },
    {
      id: 'CWE-401',
      name: 'Missing Release of Memory after Effective Lifetime',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-402',
      name: "Transmission of Private Resources into a New Sphere ('Resource Leak')",
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-403',
      name: "Exposure of File Descriptor to Unintended Control Sphere ('File Descriptor Leak')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-404',
      name: 'Improper Resource Shutdown or Release',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-405',
      name: 'Asymmetric Resource Consumption (Amplification)',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-406',
      name: 'Insufficient Control of Network Message Volume (Network Amplification)',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-407',
      name: 'Inefficient Algorithmic Complexity',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-408',
      name: 'Incorrect Behavior Order: Early Amplification',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-409',
      name: 'Improper Handling of Highly Compressed Data (Data Amplification)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-41',
      name: 'Improper Resolution of Path Equivalence',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-410',
      name: 'Insufficient Resource Pool',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-412',
      name: 'Unrestricted Externally Accessible Lock',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-413',
      name: 'Improper Resource Locking',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-414',
      name: 'Missing Lock Check',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-415',
      name: 'Double Free',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-416',
      name: 'Use After Free',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-419',
      name: 'Unprotected Primary Channel',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-42',
      name: "Path Equivalence: 'filename.' (Trailing Dot)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-420',
      name: 'Unprotected Alternate Channel',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-421',
      name: 'Race Condition During Access to Alternate Channel',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-422',
      name: "Unprotected Windows Messaging Channel ('Shatter')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-423',
      name: 'DEPRECATED: Proxied Trusted Channel',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-424',
      name: 'Improper Protection of Alternate Path',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-425',
      name: "Direct Request ('Forced Browsing')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-426',
      name: 'Untrusted Search Path',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-427',
      name: 'Uncontrolled Search Path Element',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-428',
      name: 'Unquoted Search Path or Element',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-43',
      name: "Path Equivalence: 'filename....' (Multiple Trailing Dot)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-430',
      name: 'Deployment of Wrong Handler',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-431',
      name: 'Missing Handler',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-432',
      name: 'Dangerous Signal Handler not Disabled During Sensitive Operations',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-433',
      name: 'Unparsed Raw Web Content Delivery',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-434',
      name: 'Unrestricted Upload of File with Dangerous Type',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-435',
      name: 'Improper Interaction Between Multiple Correctly-Behaving Entities',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is extremely high-level, a Pillar. However, sometimes this weakness is forced to be used due to the lack of in-depth weakness research. See Research Gaps.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-436',
      name: 'Interpretation Conflict',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-437',
      name: 'Incomplete Model of Endpoint Features',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-439',
      name: 'Behavioral Change in New Version or Environment',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-44',
      name: "Path Equivalence: 'file.name' (Internal Dot)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-440',
      name: 'Expected Behavior Violation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-441',
      name: "Unintended Proxy or Intermediary ('Confused Deputy')",
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-443',
      name: 'DEPRECATED: HTTP response splitting',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-444',
      name: "Inconsistent Interpretation of HTTP Requests ('HTTP Request/Response Smuggling')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-446',
      name: 'UI Discrepancy for Security Feature',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-447',
      name: 'Unimplemented or Unsupported Feature in UI',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-448',
      name: 'Obsolete Feature in UI',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-449',
      name: 'The UI Performs the Wrong Action',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-45',
      name: "Path Equivalence: 'file...name' (Multiple Internal Dot)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-450',
      name: 'Multiple Interpretations of UI Input',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-451',
      name: 'User Interface (UI) Misrepresentation of Critical Information',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-453',
      name: 'Insecure Default Variable Initialization',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-454',
      name: 'External Initialization of Trusted Variables or Data Stores',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-455',
      name: 'Non-exit on Failed Initialization',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-456',
      name: 'Missing Initialization of a Variable',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-457',
      name: 'Use of Uninitialized Variable',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-458',
      name: 'DEPRECATED: Incorrect Initialization',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-459',
      name: 'Incomplete Cleanup',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-46',
      name: "Path Equivalence: 'filename ' (Trailing Space)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-460',
      name: 'Improper Cleanup on Thrown Exception',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-462',
      name: 'Duplicate Key in Associative List (Alist)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-463',
      name: 'Deletion of Data Structure Sentinel',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-464',
      name: 'Addition of Data Structure Sentinel',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-466',
      name: 'Return of Pointer Value Outside of Expected Range',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-467',
      name: 'Use of sizeof() on a Pointer Type',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-468',
      name: 'Incorrect Pointer Scaling',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-469',
      name: 'Use of Pointer Subtraction to Determine Size',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-47',
      name: "Path Equivalence: ' filename' (Leading Space)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-470',
      name: "Use of Externally-Controlled Input to Select Classes or Code ('Unsafe Reflection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-471',
      name: 'Modification of Assumed-Immutable Data (MAID)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-472',
      name: 'External Control of Assumed-Immutable Web Parameter',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-473',
      name: 'PHP External Variable Modification',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-474',
      name: 'Use of Function with Inconsistent Implementations',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-475',
      name: 'Undefined Behavior for Input to API',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-476',
      name: 'NULL Pointer Dereference',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-477',
      name: 'Use of Obsolete Function',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-478',
      name: 'Missing Default Case in Multiple Condition Expression',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-479',
      name: 'Signal Handler Use of a Non-reentrant Function',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-48',
      name: "Path Equivalence: 'file name' (Internal Whitespace)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-480',
      name: 'Use of Incorrect Operator',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-481',
      name: 'Assigning instead of Comparing',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-482',
      name: 'Comparing instead of Assigning',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-483',
      name: 'Incorrect Block Delimitation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-484',
      name: 'Omitted Break Statement in Switch',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-486',
      name: 'Comparison of Classes by Name',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-487',
      name: 'Reliance on Package-level Scope',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-488',
      name: 'Exposure of Data Element to Wrong Session',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-489',
      name: 'Active Debug Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-49',
      name: "Path Equivalence: 'filename/' (Trailing Slash)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-491',
      name: "Public cloneable() Method Without Final ('Object Hijack')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-492',
      name: 'Use of Inner Class Containing Sensitive Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-493',
      name: 'Critical Public Variable Without Final Modifier',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-494',
      name: 'Download of Code Without Integrity Check',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-495',
      name: 'Private Data Structure Returned From A Public Method',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-496',
      name: 'Public Data Assigned to Private Array-Typed Field',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-497',
      name: 'Exposure of Sensitive System Information to an Unauthorized Control Sphere',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-498',
      name: 'Cloneable Class Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-499',
      name: 'Serializable Class Containing Sensitive Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-5',
      name: 'J2EE Misconfiguration: Data Transmission Without Encryption',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-50',
      name: "Path Equivalence: '//multiple/leading/slash'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-500',
      name: 'Public Static Field Not Marked Final',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-501',
      name: 'Trust Boundary Violation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-502',
      name: 'Deserialization of Untrusted Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-506',
      name: 'Embedded Malicious Code',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-507',
      name: 'Trojan Horse',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-508',
      name: 'Non-Replicating Malicious Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-509',
      name: 'Replicating Malicious Code (Virus or Worm)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-51',
      name: "Path Equivalence: '/multiple//internal/slash'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-510',
      name: 'Trapdoor',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-511',
      name: 'Logic/Time Bomb',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-512',
      name: 'Spyware',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-514',
      name: 'Covert Channel',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-515',
      name: 'Covert Storage Channel',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-516',
      name: 'DEPRECATED: Covert Timing Channel',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-52',
      name: "Path Equivalence: '/multiple/trailing/slash//'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-520',
      name: '.NET Misconfiguration: Use of Impersonation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-521',
      name: 'Weak Password Requirements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-522',
      name: 'Insufficiently Protected Credentials',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
    {
      id: 'CWE-523',
      name: 'Unprotected Transport of Credentials',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-524',
      name: 'Use of Cache Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-525',
      name: 'Use of Web Browser Cache Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-526',
      name: 'Cleartext Storage of Sensitive Information in an Environment Variable',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-527',
      name: 'Exposure of Version-Control Repository to an Unauthorized Control Sphere',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-528',
      name: 'Exposure of Core Dump File to an Unauthorized Control Sphere',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-529',
      name: 'Exposure of Access Control List Files to an Unauthorized Control Sphere',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-53',
      name: "Path Equivalence: '\\multiple\\\\internal\\backslash'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-530',
      name: 'Exposure of Backup File to an Unauthorized Control Sphere',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-531',
      name: 'Inclusion of Sensitive Information in Test Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-532',
      name: 'Insertion of Sensitive Information into Log File',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-533',
      name: 'DEPRECATED: Information Exposure Through Server Log Files',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-534',
      name: 'DEPRECATED: Information Exposure Through Debug Log Files',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-535',
      name: 'Exposure of Information Through Shell Error Message',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-536',
      name: 'Servlet Runtime Error Message Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-537',
      name: 'Java Runtime Error Message Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-538',
      name: 'Insertion of Sensitive Information into Externally-Accessible File or Directory',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-539',
      name: 'Use of Persistent Cookies Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-54',
      name: "Path Equivalence: 'filedir\\' (Trailing Backslash)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-540',
      name: 'Inclusion of Sensitive Information in Source Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-541',
      name: 'Inclusion of Sensitive Information in an Include File',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-542',
      name: 'DEPRECATED: Information Exposure Through Cleanup Log Files',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-543',
      name: 'Use of Singleton Pattern Without Synchronization in a Multithreaded Context',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-544',
      name: 'Missing Standardized Error Handling Mechanism',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-545',
      name: 'DEPRECATED: Use of Dynamic Class Loading',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-546',
      name: 'Suspicious Comment',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-547',
      name: 'Use of Hard-coded, Security-relevant Constants',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-548',
      name: 'Exposure of Information Through Directory Listing',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-549',
      name: 'Missing Password Field Masking',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-55',
      name: "Path Equivalence: '/./' (Single Dot Directory)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-550',
      name: 'Server-generated Error Message Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-551',
      name: 'Incorrect Behavior Order: Authorization Before Parsing and Canonicalization',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-552',
      name: 'Files or Directories Accessible to External Parties',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-553',
      name: 'Command Shell in Externally Accessible Directory',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-554',
      name: 'ASP.NET Misconfiguration: Not Using Input Validation Framework',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-555',
      name: 'J2EE Misconfiguration: Plaintext Password in Configuration File',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-556',
      name: 'ASP.NET Misconfiguration: Use of Identity Impersonation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-558',
      name: 'Use of getlogin() in Multithreaded Application',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-56',
      name: "Path Equivalence: 'filedir*' (Wildcard)",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-560',
      name: 'Use of umask() with chmod-style Argument',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-561',
      name: 'Dead Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-562',
      name: 'Return of Stack Variable Address',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-563',
      name: 'Assignment to Variable without Use',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-564',
      name: 'SQL Injection: Hibernate',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-565',
      name: 'Reliance on Cookies without Validation and Integrity Checking',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-566',
      name: 'Authorization Bypass Through User-Controlled SQL Primary Key',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-567',
      name: 'Unsynchronized Access to Shared Data in a Multithreaded Context',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-568',
      name: 'finalize() Method Without super.finalize()',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-57',
      name: "Path Equivalence: 'fakedir/../realdir/filename'",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-570',
      name: 'Expression is Always False',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-571',
      name: 'Expression is Always True',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-572',
      name: 'Call to Thread run() instead of start()',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-573',
      name: 'Improper Following of Specification by Caller',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 5',
    },
    {
      id: 'CWE-574',
      name: 'EJB Bad Practices: Use of Synchronization Primitives',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-575',
      name: 'EJB Bad Practices: Use of AWT Swing',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-576',
      name: 'EJB Bad Practices: Use of Java I/O',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-577',
      name: 'EJB Bad Practices: Use of Sockets',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-578',
      name: 'EJB Bad Practices: Use of Class Loader',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-579',
      name: 'J2EE Bad Practices: Non-serializable Object Stored in Session',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-58',
      name: 'Path Equivalence: Windows 8.3 Filename',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-580',
      name: 'clone() Method Without super.clone()',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-581',
      name: 'Object Model Violation: Just One of Equals and Hashcode Defined',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-582',
      name: 'Array Declared Public, Final, and Static',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-583',
      name: 'finalize() Method Declared Public',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-584',
      name: 'Return Inside Finally Block',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-585',
      name: 'Empty Synchronized Block',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-586',
      name: 'Explicit Call to Finalize()',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-587',
      name: 'Assignment of a Fixed Address to a Pointer',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-588',
      name: 'Attempt to Access Child of a Non-structure Pointer',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-589',
      name: 'Call to Non-ubiquitous API',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-59',
      name: "Improper Link Resolution Before File Access ('Link Following')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-590',
      name: 'Free of Memory not on the Heap',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-591',
      name: 'Sensitive Data Storage in Improperly Locked Memory',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-592',
      name: 'DEPRECATED: Authentication Bypass Issues',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-593',
      name: 'Authentication Bypass: OpenSSL CTX Object Modified after SSL Objects are Created',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-594',
      name: 'J2EE Framework: Saving Unserializable Objects to Disk',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-595',
      name: 'Comparison of Object References Instead of Object Contents',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-596',
      name: 'DEPRECATED: Incorrect Semantic Object Comparison',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-597',
      name: 'Use of Wrong Operator in String Comparison',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-598',
      name: 'Use of GET Request Method With Sensitive Query Strings',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-599',
      name: 'Missing Validation of OpenSSL Certificate',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-6',
      name: 'J2EE Misconfiguration: Insufficient Session-ID Length',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-600',
      name: 'Uncaught Exception in Servlet ',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 5',
    },
    {
      id: 'CWE-601',
      name: "URL Redirection to Untrusted Site ('Open Redirect')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-602',
      name: 'Client-Side Enforcement of Server-Side Security',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 6',
    },
    {
      id: 'CWE-603',
      name: 'Use of Client-Side Authentication',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-605',
      name: 'Multiple Binds to the Same Port',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-606',
      name: 'Unchecked Input for Loop Condition',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-607',
      name: 'Public Static Final Field References Mutable Object',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-608',
      name: 'Struts: Non-private Field in ActionForm Class',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-609',
      name: 'Double-Checked Locking',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-61',
      name: 'UNIX Symbolic Link (Symlink) Following',
      usage: 'Allowed',
      rationale:
        'This is a well-known Composite of multiple weaknesses that must all occur simultaneously, although it is attack-oriented in nature.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-610',
      name: 'Externally Controlled Reference to a Resource in Another Sphere',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a level-1 Class (i.e., a child of a Pillar). It might have lower-level children that would be more appropriate',
      version: 'Draft 6',
    },
    {
      id: 'CWE-611',
      name: 'Improper Restriction of XML External Entity Reference',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-612',
      name: 'Improper Authorization of Index Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-613',
      name: 'Insufficient Session Expiration',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-614',
      name: "Sensitive Cookie in HTTPS Session Without 'Secure' Attribute",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-615',
      name: 'Inclusion of Sensitive Information in Source Code Comments',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-616',
      name: 'Incomplete Identification of Uploaded File Variables (PHP)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-617',
      name: 'Reachable Assertion',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-618',
      name: 'Exposed Unsafe ActiveX Method',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-619',
      name: "Dangling Database Cursor ('Cursor Injection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-62',
      name: 'UNIX Hard Link',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-620',
      name: 'Unverified Password Change',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-621',
      name: 'Variable Extraction Error',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-622',
      name: 'Improper Validation of Function Hook Arguments',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-623',
      name: 'Unsafe ActiveX Control Marked Safe For Scripting',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-624',
      name: 'Executable Regular Expression Error',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-625',
      name: 'Permissive Regular Expression',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-626',
      name: 'Null Byte Interaction Error (Poison Null Byte)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-627',
      name: 'Dynamic Variable Evaluation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-628',
      name: 'Function Call with Incorrectly Specified Arguments',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 6',
    },
    {
      id: 'CWE-636',
      name: "Not Failing Securely ('Failing Open')",
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 8',
    },
    {
      id: 'CWE-637',
      name: "Unnecessary Complexity in Protection Mechanism (Not Using 'Economy of Mechanism')",
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 8',
    },
    {
      id: 'CWE-638',
      name: 'Not Using Complete Mediation',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 8',
    },
    {
      id: 'CWE-639',
      name: 'Authorization Bypass Through User-Controlled Key',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-64',
      name: 'Windows Shortcut Following (.LNK)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-640',
      name: 'Weak Password Recovery Mechanism for Forgotten Password',
      usage: 'Allowed-with-Review',
      rationale:
        'This entry appears to be frequently misused for any weakness related to password changes, even though the name focuses on "Password Recovery" for a "forgotten" password.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-641',
      name: 'Improper Restriction of Names for Files and Other Resources',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-642',
      name: 'External Control of Critical State Data',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 8',
    },
    {
      id: 'CWE-643',
      name: "Improper Neutralization of Data within XPath Expressions ('XPath Injection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-644',
      name: 'Improper Neutralization of HTTP Headers for Scripting Syntax',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-645',
      name: 'Overly Restrictive Account Lockout Mechanism',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-646',
      name: 'Reliance on File Name or Extension of Externally-Supplied File',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-647',
      name: 'Use of Non-Canonical URL Paths for Authorization Decisions',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-648',
      name: 'Incorrect Use of Privileged APIs',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-649',
      name: 'Reliance on Obfuscation or Encryption of Security-Relevant Inputs without Integrity Checking',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-65',
      name: 'Windows Hard Link',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-650',
      name: 'Trusting HTTP Permission Methods on the Server Side',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-651',
      name: 'Exposure of WSDL File Containing Sensitive Information',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-652',
      name: "Improper Neutralization of Data within XQuery Expressions ('XQuery Injection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-653',
      name: 'Improper Isolation or Compartmentalization',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-654',
      name: 'Reliance on a Single Factor in a Security Decision',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 8',
    },
    {
      id: 'CWE-655',
      name: 'Insufficient Psychological Acceptability',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 8',
    },
    {
      id: 'CWE-656',
      name: 'Reliance on Security Through Obscurity',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 8',
    },
    {
      id: 'CWE-657',
      name: 'Violation of Secure Design Principles',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a level-1 Class (i.e., a child of a Pillar). It might have lower-level children that would be more appropriate',
      version: 'Draft 8',
    },
    {
      id: 'CWE-66',
      name: 'Improper Handling of File Names that Identify Virtual Resources',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-662',
      name: 'Improper Synchronization',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a level-1 Class (i.e., a child of a Pillar). It might have lower-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-663',
      name: 'Use of a Non-reentrant Function in a Concurrent Context',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-664',
      name: 'Improper Control of a Resource Through its Lifetime',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is high-level when lower-level children are available.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-665',
      name: 'Improper Initialization',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a level-1 Class (i.e., a child of a Pillar). It might have lower-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-666',
      name: 'Operation on Resource in Wrong Phase of Lifetime',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a level-1 Class (i.e., a child of a Pillar). It might have lower-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-667',
      name: 'Improper Locking',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-668',
      name: 'Exposure of Resource to Wrong Sphere',
      usage: 'Discouraged',
      rationale:
        'CWE-668 is high-level and is often misused as a catch-all when lower-level CWE IDs might be applicable. It is sometimes used for low-information vulnerability reports [REF-1287]. It is a level-1 Class (i.e., a child of a Pillar). It is not useful for trend analysis.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-669',
      name: 'Incorrect Resource Transfer Between Spheres',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-67',
      name: 'Improper Handling of Windows Device Names',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-670',
      name: 'Always-Incorrect Control Flow Implementation',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-671',
      name: 'Lack of Administrator Control over Security',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-672',
      name: 'Operation on a Resource after Expiration or Release',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-673',
      name: 'External Influence of Sphere Definition',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-674',
      name: 'Uncontrolled Recursion',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-675',
      name: 'Multiple Operations on Resource in Single-Operation Context',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-676',
      name: 'Use of Potentially Dangerous Function',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-680',
      name: 'Integer Overflow to Buffer Overflow',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a named chain, which combines multiple weaknesses.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-681',
      name: 'Incorrect Conversion between Numeric Types',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-682',
      name: 'Incorrect Calculation',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is extremely high-level, a Pillar. In many cases, lower-level children or descendants are more appropriate. However, sometimes this weakness is forced to be used due to the lack of in-depth weakness research. See Research Gaps.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-683',
      name: 'Function Call With Incorrect Order of Arguments',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-684',
      name: 'Incorrect Provision of Specified Functionality',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 9',
    },
    {
      id: 'CWE-685',
      name: 'Function Call With Incorrect Number of Arguments',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-686',
      name: 'Function Call With Incorrect Argument Type',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-687',
      name: 'Function Call With Incorrectly Specified Argument Value',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-688',
      name: 'Function Call With Incorrect Variable or Reference as Argument',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-689',
      name: 'Permission Race Condition During Resource Copy',
      usage: 'Allowed',
      rationale:
        'This is a Composite of multiple weaknesses that must all occur simultaneously.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-69',
      name: 'Improper Handling of Windows ::DATA Alternate Data Stream',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-690',
      name: 'Unchecked Return Value to NULL Pointer Dereference',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a named chain, which combines multiple weaknesses.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-691',
      name: 'Insufficient Control Flow Management',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is extremely high-level, a Pillar. However, classification research is limited for weaknesses of this type, so there can be gaps or organizational difficulties within CWE that force use of this weakness, even at such a high level of abstraction.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-692',
      name: 'Incomplete Denylist to Cross-Site Scripting',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a named chain, which combines multiple weaknesses.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-693',
      name: 'Protection Mechanism Failure',
      usage: 'Discouraged',
      rationale: 'This CWE entry is extremely high-level, a Pillar.',
      version: 'Draft 9',
    },
    {
      id: 'CWE-694',
      name: 'Use of Multiple Resources with Duplicate Identifier',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.0',
    },
    {
      id: 'CWE-695',
      name: 'Use of Low-Level Functionality',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.0',
    },
    {
      id: 'CWE-696',
      name: 'Incorrect Behavior Order',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '1.0',
    },
    {
      id: 'CWE-697',
      name: 'Incorrect Comparison',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is extremely high-level, a Pillar. However, sometimes this weakness is forced to be used due to the lack of in-depth weakness research. See Research Gaps.',
      version: '1.0',
    },
    {
      id: 'CWE-698',
      name: 'Execution After Redirect (EAR)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.0',
    },
    {
      id: 'CWE-7',
      name: 'J2EE Misconfiguration: Missing Custom Error Page',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-703',
      name: 'Improper Check or Handling of Exceptional Conditions',
      usage: 'Discouraged',
      rationale: 'This CWE entry is extremely high-level, a Pillar.',
      version: '1.0',
    },
    {
      id: 'CWE-704',
      name: 'Incorrect Type Conversion or Cast',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '1.0',
    },
    {
      id: 'CWE-705',
      name: 'Incorrect Control Flow Scoping',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '1.0',
    },
    {
      id: 'CWE-706',
      name: 'Use of Incorrectly-Resolved Name or Reference',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '1.0',
    },
    {
      id: 'CWE-707',
      name: 'Improper Neutralization',
      usage: 'Discouraged',
      rationale: 'This CWE entry is extremely high-level, a Pillar.',
      version: '1.0',
    },
    {
      id: 'CWE-708',
      name: 'Incorrect Ownership Assignment',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.0',
    },
    {
      id: 'CWE-71',
      name: "DEPRECATED: Apple '.DS_Store'",
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-710',
      name: 'Improper Adherence to Coding Standards',
      usage: 'Discouraged',
      rationale: 'This CWE entry is extremely high-level, a Pillar.',
      version: '1.0',
    },
    {
      id: 'CWE-72',
      name: 'Improper Handling of Apple HFS+ Alternate Data Stream Path',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-73',
      name: 'External Control of File Name or Path',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-732',
      name: 'Incorrect Permission Assignment for Critical Resource',
      usage: 'Allowed-with-Review',
      rationale:
        'While the name itself indicates an assignment of permissions for resources, this is often misused for vulnerabilities in which "permissions" are not checked, which is an "authorization" weakness (CWE-285 or descendants) within CWE\'s model [REF-1287].',
      version: '1.0',
    },
    {
      id: 'CWE-733',
      name: 'Compiler Optimization Removal or Modification of Security-critical Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.0.1',
    },
    {
      id: 'CWE-74',
      name: "Improper Neutralization of Special Elements in Output Used by a Downstream Component ('Injection')",
      usage: 'Discouraged',
      rationale:
        'CWE-74 is high-level and often misused when lower-level weaknesses are more appropriate.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-749',
      name: 'Exposed Dangerous Method or Function',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.1',
    },
    {
      id: 'CWE-75',
      name: 'Failure to Sanitize Special Elements into a Different Plane (Special Element Injection)',
      usage: 'Discouraged',
      rationale:
        'This CWE entry might be under consideraton for deprecation, as it is not easily distinguishable from CWE-74.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-754',
      name: 'Improper Check for Unusual or Exceptional Conditions',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '1.3',
    },
    {
      id: 'CWE-755',
      name: 'Improper Handling of Exceptional Conditions',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a level-1 Class (i.e., a child of a Pillar). It might have lower-level children that would be more appropriate',
      version: '1.3',
    },
    {
      id: 'CWE-756',
      name: 'Missing Custom Error Page',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.3',
    },
    {
      id: 'CWE-757',
      name: "Selection of Less-Secure Algorithm During Negotiation ('Algorithm Downgrade')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.3',
    },
    {
      id: 'CWE-758',
      name: 'Reliance on Undefined, Unspecified, or Implementation-Defined Behavior',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '1.3',
    },
    {
      id: 'CWE-759',
      name: 'Use of a One-Way Hash without a Salt',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.3',
    },
    {
      id: 'CWE-76',
      name: 'Improper Neutralization of Equivalent Special Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-760',
      name: 'Use of a One-Way Hash with a Predictable Salt',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.3',
    },
    {
      id: 'CWE-761',
      name: 'Free of Pointer not at Start of Buffer',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-762',
      name: 'Mismatched Memory Management Routines',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-763',
      name: 'Release of Invalid Pointer or Reference',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-764',
      name: 'Multiple Locks of a Critical Resource',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-765',
      name: 'Multiple Unlocks of a Critical Resource',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-766',
      name: 'Critical Data Element Declared Public',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-767',
      name: 'Access to Critical Private Variable via Public Method',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-768',
      name: 'Incorrect Short Circuit Evaluation',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-769',
      name: 'DEPRECATED: Uncontrolled File Descriptor Consumption',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: '1.4',
    },
    {
      id: 'CWE-77',
      name: "Improper Neutralization of Special Elements used in a Command ('Command Injection')",
      usage: 'Allowed-with-Review',
      rationale:
        'CWE-77 is often misused when OS command injection (CWE-78) was intended instead [REF-1287].',
      version: 'Draft 3',
    },
    {
      id: 'CWE-770',
      name: 'Allocation of Resources Without Limits or Throttling',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-771',
      name: 'Missing Reference to Active Allocated Resource',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-772',
      name: 'Missing Release of Resource after Effective Lifetime',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-773',
      name: 'Missing Reference to Active File Descriptor or Handle',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-774',
      name: 'Allocation of File Descriptors or Handles Without Limits or Throttling',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-775',
      name: 'Missing Release of File Descriptor or Handle after Effective Lifetime',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.4',
    },
    {
      id: 'CWE-776',
      name: "Improper Restriction of Recursive Entity References in DTDs ('XML Entity Expansion')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.5',
    },
    {
      id: 'CWE-777',
      name: 'Regular Expression without Anchors',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.5',
    },
    {
      id: 'CWE-778',
      name: 'Insufficient Logging',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.5',
    },
    {
      id: 'CWE-779',
      name: 'Logging of Excessive Data',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.5',
    },
    {
      id: 'CWE-78',
      name: "Improper Neutralization of Special Elements used in an OS Command ('OS Command Injection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-780',
      name: 'Use of RSA Algorithm without OAEP',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.5',
    },
    {
      id: 'CWE-781',
      name: 'Improper Address Validation in IOCTL with METHOD_NEITHER I/O Control Code',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.5',
    },
    {
      id: 'CWE-782',
      name: 'Exposed IOCTL with Insufficient Access Control',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.5',
    },
    {
      id: 'CWE-783',
      name: 'Operator Precedence Logic Error',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.5',
    },
    {
      id: 'CWE-784',
      name: 'Reliance on Cookies without Validation and Integrity Checking in a Security Decision',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.5',
    },
    {
      id: 'CWE-785',
      name: 'Use of Path Manipulation Function without Maximum-sized Buffer',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.5',
    },
    {
      id: 'CWE-786',
      name: 'Access of Memory Location Before Start of Buffer',
      usage: 'Discouraged',
      rationale:
        'The CWE entry might be misused when lower-level CWE entries might be available. It also overlaps existing CWE entries and might be deprecated in the future.',
      version: '1.6',
    },
    {
      id: 'CWE-787',
      name: 'Out-of-bounds Write',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.6',
    },
    {
      id: 'CWE-788',
      name: 'Access of Memory Location After End of Buffer',
      usage: 'Discouraged',
      rationale:
        'The CWE entry might be misused when lower-level CWE entries might be available. It also overlaps existing CWE entries and might be deprecated in the future.',
      version: '1.6',
    },
    {
      id: 'CWE-789',
      name: 'Memory Allocation with Excessive Size Value',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.6',
    },
    {
      id: 'CWE-79',
      name: "Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-790',
      name: 'Improper Filtering of Special Elements',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '1.7',
    },
    {
      id: 'CWE-791',
      name: 'Incomplete Filtering of Special Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.7',
    },
    {
      id: 'CWE-792',
      name: 'Incomplete Filtering of One or More Instances of Special Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.7',
    },
    {
      id: 'CWE-793',
      name: 'Only Filtering One Instance of a Special Element',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.7',
    },
    {
      id: 'CWE-794',
      name: 'Incomplete Filtering of Multiple Instances of Special Elements',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.7',
    },
    {
      id: 'CWE-795',
      name: 'Only Filtering Special Elements at a Specified Location',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.7',
    },
    {
      id: 'CWE-796',
      name: 'Only Filtering Special Elements Relative to a Marker',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.7',
    },
    {
      id: 'CWE-797',
      name: 'Only Filtering Special Elements at an Absolute Position',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.7',
    },
    {
      id: 'CWE-798',
      name: 'Use of Hard-coded Credentials',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.8',
    },
    {
      id: 'CWE-799',
      name: 'Improper Control of Interaction Frequency',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '1.8',
    },
    {
      id: 'CWE-8',
      name: 'J2EE Misconfiguration: Entity Bean Declared Remote',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-80',
      name: 'Improper Neutralization of Script-Related HTML Tags in a Web Page (Basic XSS)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-804',
      name: 'Guessable CAPTCHA',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.8',
    },
    {
      id: 'CWE-805',
      name: 'Buffer Access with Incorrect Length Value',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.8',
    },
    {
      id: 'CWE-806',
      name: 'Buffer Access Using Size of Source Buffer',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.8',
    },
    {
      id: 'CWE-807',
      name: 'Reliance on Untrusted Inputs in a Security Decision',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.8',
    },
    {
      id: 'CWE-81',
      name: 'Improper Neutralization of Script in an Error Message Web Page',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-82',
      name: 'Improper Neutralization of Script in Attributes of IMG Tags in a Web Page',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-820',
      name: 'Missing Synchronization',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.10',
    },
    {
      id: 'CWE-821',
      name: 'Incorrect Synchronization',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.10',
    },
    {
      id: 'CWE-822',
      name: 'Untrusted Pointer Dereference',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.10',
    },
    {
      id: 'CWE-823',
      name: 'Use of Out-of-range Pointer Offset',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.10',
    },
    {
      id: 'CWE-824',
      name: 'Access of Uninitialized Pointer',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.10',
    },
    {
      id: 'CWE-825',
      name: 'Expired Pointer Dereference',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.10',
    },
    {
      id: 'CWE-826',
      name: 'Premature Release of Resource During Expected Lifetime',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.10',
    },
    {
      id: 'CWE-827',
      name: 'Improper Control of Document Type Definition',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.11',
    },
    {
      id: 'CWE-828',
      name: 'Signal Handler with Functionality that is not Asynchronous-Safe',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.11',
    },
    {
      id: 'CWE-829',
      name: 'Inclusion of Functionality from Untrusted Control Sphere',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.11',
    },
    {
      id: 'CWE-83',
      name: 'Improper Neutralization of Script in Attributes in a Web Page',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-830',
      name: 'Inclusion of Web Functionality from an Untrusted Source',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.11',
    },
    {
      id: 'CWE-831',
      name: 'Signal Handler Function Associated with Multiple Signals',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.11',
    },
    {
      id: 'CWE-832',
      name: 'Unlock of a Resource that is not Locked',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.11',
    },
    {
      id: 'CWE-833',
      name: 'Deadlock',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.11',
    },
    {
      id: 'CWE-834',
      name: 'Excessive Iteration',
      usage: 'Discouraged',
      rationale:
        'This CWE entry is a level-1 Class (i.e., a child of a Pillar). It might have lower-level children that would be more appropriate',
      version: '1.12',
    },
    {
      id: 'CWE-835',
      name: "Loop with Unreachable Exit Condition ('Infinite Loop')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.12',
    },
    {
      id: 'CWE-836',
      name: 'Use of Password Hash Instead of Password for Authentication',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.12',
    },
    {
      id: 'CWE-837',
      name: 'Improper Enforcement of a Single, Unique Action',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.12',
    },
    {
      id: 'CWE-838',
      name: 'Inappropriate Encoding for Output Context',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.12',
    },
    {
      id: 'CWE-839',
      name: 'Numeric Range Comparison Without Minimum Check',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.12',
    },
    {
      id: 'CWE-84',
      name: 'Improper Neutralization of Encoded URI Schemes in a Web Page',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-841',
      name: 'Improper Enforcement of Behavioral Workflow',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.12',
    },
    {
      id: 'CWE-842',
      name: 'Placement of User into Incorrect Group',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.12',
    },
    {
      id: 'CWE-843',
      name: "Access of Resource Using Incompatible Type ('Type Confusion')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '1.13',
    },
    {
      id: 'CWE-85',
      name: 'Doubled Character XSS Manipulations',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-86',
      name: 'Improper Neutralization of Invalid Characters in Identifiers in Web Pages',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-862',
      name: 'Missing Authorization',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '1.13',
    },
    {
      id: 'CWE-863',
      name: 'Incorrect Authorization',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '1.13',
    },
    {
      id: 'CWE-87',
      name: 'Improper Neutralization of Alternate XSS Syntax',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-88',
      name: "Improper Neutralization of Argument Delimiters in a Command ('Argument Injection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-89',
      name: "Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-9',
      name: 'J2EE Misconfiguration: Weak Access Permissions for EJB Methods',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-90',
      name: "Improper Neutralization of Special Elements used in an LDAP Query ('LDAP Injection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-908',
      name: 'Use of Uninitialized Resource',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.4',
    },
    {
      id: 'CWE-909',
      name: 'Missing Initialization of Resource',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '2.4',
    },
    {
      id: 'CWE-91',
      name: 'XML Injection (aka Blind XPath Injection)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-910',
      name: 'Use of Expired File Descriptor',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.4',
    },
    {
      id: 'CWE-911',
      name: 'Improper Update of Reference Count',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.4',
    },
    {
      id: 'CWE-912',
      name: 'Hidden Functionality',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '2.4',
    },
    {
      id: 'CWE-913',
      name: 'Improper Control of Dynamically-Managed Code Resources',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '2.4',
    },
    {
      id: 'CWE-914',
      name: 'Improper Control of Dynamically-Identified Variables',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.4',
    },
    {
      id: 'CWE-915',
      name: 'Improperly Controlled Modification of Dynamically-Determined Object Attributes',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.4',
    },
    {
      id: 'CWE-916',
      name: 'Use of Password Hash With Insufficient Computational Effort',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.4',
    },
    {
      id: 'CWE-917',
      name: "Improper Neutralization of Special Elements used in an Expression Language Statement ('Expression Language Injection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.4',
    },
    {
      id: 'CWE-918',
      name: 'Server-Side Request Forgery (SSRF)',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.4',
    },
    {
      id: 'CWE-92',
      name: 'DEPRECATED: Improper Sanitization of Custom Special Characters',
      usage: 'Prohibited',
      rationale: 'This CWE has been deprecated.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-920',
      name: 'Improper Restriction of Power Consumption',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.5',
    },
    {
      id: 'CWE-921',
      name: 'Storage of Sensitive Data in a Mechanism without Access Control',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.5',
    },
    {
      id: 'CWE-922',
      name: 'Insecure Storage of Sensitive Information',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '2.5',
    },
    {
      id: 'CWE-923',
      name: 'Improper Restriction of Communication Channel to Intended Endpoints',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '2.5',
    },
    {
      id: 'CWE-924',
      name: 'Improper Enforcement of Message Integrity During Transmission in a Communication Channel',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.5',
    },
    {
      id: 'CWE-925',
      name: 'Improper Verification of Intent by Broadcast Receiver',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.5',
    },
    {
      id: 'CWE-926',
      name: 'Improper Export of Android Application Components',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.5',
    },
    {
      id: 'CWE-927',
      name: 'Use of Implicit Intent for Sensitive Communication',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.5',
    },
    {
      id: 'CWE-93',
      name: "Improper Neutralization of CRLF Sequences ('CRLF Injection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-939',
      name: 'Improper Authorization in Handler for Custom URL Scheme',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.6',
    },
    {
      id: 'CWE-94',
      name: "Improper Control of Generation of Code ('Code Injection')",
      usage: 'Allowed-with-Review',
      rationale:
        'This entry is frequently misused for vulnerabilities with a technical impact of "code execution," which does not by itself indicate a root cause weakness, since dozens of weaknesses can enable code execution.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-940',
      name: 'Improper Verification of Source of a Communication Channel',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.6',
    },
    {
      id: 'CWE-941',
      name: 'Incorrectly Specified Destination in a Communication Channel',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.6',
    },
    {
      id: 'CWE-942',
      name: 'Permissive Cross-domain Policy with Untrusted Domains',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: '2.7',
    },
    {
      id: 'CWE-943',
      name: 'Improper Neutralization of Special Elements in Data Query Logic',
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: '2.7',
    },
    {
      id: 'CWE-95',
      name: "Improper Neutralization of Directives in Dynamically Evaluated Code ('Eval Injection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-96',
      name: "Improper Neutralization of Directives in Statically Saved Code ('Static Code Injection')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Base level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-97',
      name: 'Improper Neutralization of Server-Side Includes (SSI) Within a Web Page',
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-98',
      name: "Improper Control of Filename for Include/Require Statement in PHP Program ('PHP Remote File Inclusion')",
      usage: 'Allowed',
      rationale:
        'This CWE entry is at the Variant level of abstraction, which is a preferred level of abstraction for mapping to the root causes of vulnerabilities.',
      version: 'Draft 3',
    },
    {
      id: 'CWE-99',
      name: "Improper Control of Resource Identifiers ('Resource Injection')",
      usage: 'Allowed-with-Review',
      rationale:
        'This CWE entry is a Class and might have Base-level children that would be more appropriate',
      version: 'Draft 3',
    },
  ],
})
