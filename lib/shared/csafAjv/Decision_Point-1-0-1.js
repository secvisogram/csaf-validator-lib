export default {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Decision Point schema definition',
  $id: 'https://certcc.github.io/SSVC/data/schema/v1/Decision_Point-1-0-1.schema.json',
  description:
    'Decision points are the basic building blocks of SSVC decision functions. Individual decision points describe a single aspect of the input to a decision function.',
  $defs: {
    schemaVersion: {
      description: 'Schema version used to represent this Decision Point.',
      type: 'string',
      enum: ['1-0-1'],
    },
    decision_point_value: {
      type: 'object',
      additionalProperties: false,
      properties: {
        key: {
          type: 'string',
          description:
            'A short, unique string (or key) used as a shorthand identifier for a Decision Point Value.',
          minLength: 1,
          examples: ['P', 'Y'],
        },
        name: {
          type: 'string',
          description: 'A short label that identifies a Decision Point Value',
          minLength: 1,
          examples: ['Public PoC', 'Yes'],
        },
        description: {
          type: 'string',
          description: 'A full description of the Decision Point Value.',
          minLength: 1,
          examples: [
            'One of the following is true: (1) Typical public PoC exists in sources such as Metasploit or websites like ExploitDB; or (2) the vulnerability has a well-known method of exploitation.',
            'Attackers can reliably automate steps 1-4 of the kill chain.',
          ],
        },
      },
      required: ['key', 'name', 'description'],
    },
    decision_point: {
      type: 'object',
      additionalProperties: false,
      properties: {
        schemaVersion: {
          $ref: '#/$defs/schemaVersion',
        },
        namespace: {
          type: 'string',
          description:
            'Namespace (a short, unique string): The value must be one of the official namespaces, currenlty "ssvc", "cvss" OR can start with \'x_\' for private namespaces. See SSVC Documentation for details.',
          pattern: '^(?=.{3,100}$)(x_)?[a-z0-9]{3}([/.-]?[a-z0-9]+){0,97}$',
          examples: ['ssvc', 'cvss', 'x_custom', 'x_custom/extension'],
        },
        version: {
          type: 'string',
          description:
            'Version (a semantic version string) that identifies the version of a Decision Point.',
          pattern:
            '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$',
          examples: ['1.0.1', '1.0.1-alpha'],
        },
        key: {
          type: 'string',
          description:
            'A short, unique string (or key) used as a shorthand identifier for a Decision Point.',

          minLength: 1,
          examples: ['E', 'A'],
        },
        name: {
          type: 'string',
          description: 'A short label that identifies a Decision Point.',
          minLength: 1,
          examples: ['Exploitation', 'Automatable'],
        },
        description: {
          type: 'string',
          description:
            'A full description of the Decision Point, explaining what it represents and how it is used in SSVC.',
          minLength: 1,
        },
        values: {
          description: 'A set of possible answers for a given Decision Point',
          uniqueItems: true,
          type: 'array',
          minItems: 1,
          items: {
            $ref: '#/$defs/decision_point_value',
          },
        },
      },
      required: [
        'namespace',
        'version',
        'key',
        'name',
        'description',
        'values',
        'schemaVersion',
      ],
    },
  },
  $ref: '#/$defs/decision_point',
}
