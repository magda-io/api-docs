define({ "api": [
  {
    "group": "Auth",
    "type": "post",
    "url": "/v0/auth/opa/decision[/path...]",
    "title": "Get Auth Decision From OPA",
    "description": "<p>Ask OPA (<a href=\"https://www.openpolicyagent.org/\">Open Policy Agent</a>) make authorisation decision on proposed resource operation URI. The resource operation URI is supplied as part of request URL path. e.g. a request sent to URL <code>https://&lt;host&gt;/api/v0/auth/opa/decision/object/dataset/draft/read</code> indicates an authorisation decision for is sought:</p> <ul> <li>operation uri: <code>object/dataset/draft/read</code></li> <li>resource uri: <code>object/dataset/draft</code></li> </ul> <p>The <code>resource uri</code> &amp; <code>operation uri</code> info together with:</p> <ul> <li>other optional extra context data supplied</li> <li>current user profile. e.g. roles &amp; permissions</li> </ul> <p>will be used to construct the context data object <code>input</code> that will be used to assist OPA's auth decision making.</p> <p>Regardless the <code>operation uri</code> supplied, this endpoint will always ask OPA to make decision using entrypoint policy <code>entrypoint/allow.rego</code>. The <code>entrypoint/allow.rego</code> should be responsible for delegating the designated policy to make the actual auth decision for a particular type of resource.</p> <p>e.g. The default policy <code>entrypoint/allow.rego</code> will delegate policy <code>object/dataset/allow.rego</code> to make decision for operation uri: <code>object/dataset/draft/read</code>.</p> <p>Please note: you can <a href=\"https://github.com/magda-io/magda/blob/master/docs/docs/how-to-add-custom-opa-policies.md\">replace built-in policy files</a> (including <code>entrypoint/allow.rego</code>) when deploy Magda with helm config.</p> <blockquote> <p>This API endpoint is also available as a HTTP GET endpoint. You can access the same functionality via the GET endpoint except not being able to supply parameters via HTTP request body.</p> </blockquote>",
    "parameter": {
      "fields": {
        "Request URL Path": [
          {
            "group": "Request URL Path",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<p>The URI of the resource operation that you propose to perform. From this URI (e.g. <code>object/dataset/draft/read</code>), we can also work out resource URI(e.g. <code>object/dataset/draft</code>). Depends on policy logic, URI pattern (e.g. <code>object/dataset/*&amp;#47;read</code>) might be supported.</p> <blockquote> <p>If you request the decision for a non-exist resource type, the default policy will evaluate to <code>false</code> (denied).</p> </blockquote>"
          }
        ],
        "Query String Parameters": [
          {
            "group": "Query String Parameters",
            "type": "String",
            "optional": true,
            "field": "operationUri",
            "description": "<p>Use to supply / overwrite the operation uri. Any parameters supplied via <code>Query String Parameters</code> have higher priority. Thus, can overwrite the same parameter supplied via <code>Request Body JSON</code>. However, <code>operationUri</code> supplied via <code>Query String Parameters</code> can't overwrite the <code>operationUri</code> supplied via <code>Request URL Path</code>.</p>"
          },
          {
            "group": "Query String Parameters",
            "type": "String",
            "optional": true,
            "field": "resourceUri",
            "description": "<p>Use to supply / overwrite the resource uri. Please note: Magda's built-in policies don't utilise <code>resourceUri</code> as we can figure it out from <code>operationUri</code> instead. This interface is provided to facilitate users' own customised implementation only.</p>"
          },
          {
            "group": "Query String Parameters",
            "type": "String[]",
            "optional": true,
            "field": "unknowns",
            "description": "<p>Use to supply A list of references that should be considered as &quot;unknown&quot; during the policy evaluation. If a conclusive/unconditional auth decision can't be made without knowing &quot;unknown&quot; data, the residual rules of the &quot;partial evaluation&quot; result will be responded in <a href=\"https://www.openpolicyagent.org/docs/latest/policy-language/\">rego</a> AST JSON format. e.g. When <code>unknowns=[&quot;input.object.dataset&quot;]</code>, any rules related to dataset's attributes will be kept and output as residual rules, unless existing context info is sufficient to make a conclusive/unconditional auth decision (e.g. admin can access all datasets the values of regardless dataset attributes).</p> <blockquote> <p>Please note: When <code>unknowns</code> is NOT supplied, this endpoint will auto-generate a JSON path that is made up of string &quot;input&quot; and the first segment of <code>operationUri</code> as the unknown reference. e.g. When <code>operationUri</code> = <code>object/dataset/draft/read</code> and <code>unknowns</code> parameter is not supplied, by default, this endpoint will set <code>unknowns</code> parameter's value to array [&quot;input.object&quot;].</p> </blockquote> <blockquote> <p>However, when extra context data is supplied as part request data at JSON path <code>input.object</code>, the <code>unknowns</code> will not be auto-set.</p> </blockquote> <blockquote> <p>If you want to force stop the endpoint from auto-generating <code>unknowns</code>, you can supply <code>unknowns</code> parameter as an empty string. Please note: When <code>unknowns</code> is set to an empty string, the request will be send to <a href=\"https://www.openpolicyagent.org/docs/latest/rest-api/#get-a-document-with-input\">&quot;full evaluation endpoint&quot;</a>, instead of <a href=\"https://www.openpolicyagent.org/docs/latest/rest-api/#compile-api\">&quot;partial evaluation endpoint&quot;</a>. You will always get definite answer from &quot;full evaluation endpoint&quot;.</p> </blockquote> <blockquote> <p>Please note: you can supply an array by a query string like <code>unknowns=ref1&amp;unknowns=ref2</code></p> </blockquote>"
          },
          {
            "group": "Query String Parameters",
            "type": "string",
            "allowedValues": [
              "\"true\""
            ],
            "optional": true,
            "field": "rawAst",
            "description": "<p>Output RAW AST response from OPA instead parsed &amp; processed result. As long as the parameter present in query string, the RAW AST option will be turned on. e.g. both <code>?rawAst</code> &amp; <code>?rawAst=true</code> will work.</p>"
          },
          {
            "group": "Query String Parameters",
            "type": "string",
            "allowedValues": [
              "\"full\""
            ],
            "optional": true,
            "field": "explain",
            "description": "<p>Include OPA decision explanation in the RAW AST response from OPA. Only work when <code>rawAst</code> is on.</p>"
          },
          {
            "group": "Query String Parameters",
            "type": "string",
            "allowedValues": [
              "\"true\""
            ],
            "optional": true,
            "field": "pretty",
            "description": "<p>Include human readable OPA decision explanation in the RAW AST response from OPA. Only work when <code>rawAst</code> is on &amp; <code>explain</code>=&quot;full&quot;.</p>"
          },
          {
            "group": "Query String Parameters",
            "type": "string",
            "allowedValues": [
              "\"true\""
            ],
            "optional": true,
            "field": "humanReadable",
            "description": "<p>Output parsed &amp; processed result in human readable format. This option will not work when <code>rawAst</code> is on. As long as the parameter present in query string, the <code>humanReadable</code> option will be turned on. e.g. both <code>?humanReadable</code> &amp; <code>?humanReadable=true</code> will work.</p>"
          },
          {
            "group": "Query String Parameters",
            "type": "string",
            "allowedValues": [
              "\"false\""
            ],
            "optional": true,
            "field": "concise",
            "description": "<p>Output parsed &amp; processed result in a concise format. This is default output format. This option will not work when <code>rawAst</code> is on. You can set <code>concise</code>=<code>false</code> to output a format more similar to original OPA AST (with more details).</p>"
          }
        ],
        "Request Body JSON": [
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": true,
            "field": "operationUri",
            "description": "<p>Same as <code>operationUri</code> in query parameter. Users can also opt to supply <code>operationUri</code> via request body instead.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": true,
            "field": "resourceUri",
            "description": "<p>Same as <code>resourceUri</code> in query parameter. Users can also opt to supply <code>resourceUri</code> via request body instead.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String[]",
            "optional": true,
            "field": "unknowns",
            "description": "<p>Same as <code>unknowns</code> in query parameter. Users can also opt to supply <code>unknowns</code> via request body instead.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Object",
            "optional": true,
            "field": "input",
            "description": "<p>OPA &quot;<code>input</code> data&quot;. Use to provide extra context data to support the auth decision making. e.g. When you need to make decision on one particular dataset (rather than a group of dataset), you can supply the <code>input</code> data object as the following:</p> <pre><code class=\"language-json\">{   &quot;object&quot;: {     &quot;dataset&quot;: {       // all dataset attributes       ...     }   } } </code></pre> <blockquote> <p>Please note: It's not possible to overwrite system generated context data fields via <code>input</code> data object. e.g:</p> <ul> <li><code>input.user</code></li> <li><code>input.timestamp</code></li> </ul> </blockquote>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success JSON Response Body": [
          {
            "group": "Success JSON Response Body",
            "type": "bool",
            "optional": false,
            "field": "hasResidualRules",
            "description": "<p>indicates whether or not the policy engine can make a conclusive/unconditional auth decision. When a conclusive/unconditional auth decision is made (i.e. <code>hasResidualRules</code>=<code>false</code>), the auth decision is returned as policy evaluation value in <code>result</code> field. Usually, <code>true</code> means the operation should be <code>allowed</code>.</p>"
          },
          {
            "group": "Success JSON Response Body",
            "type": "any",
            "optional": true,
            "field": "result",
            "description": "<p>Only presents when <code>hasResidualRules</code>=<code>false</code>. The result field contains the policy evaluation result value. <code>true</code> means the operation is allowed and <code>false</code> means otherwise. By default, it should be in <code>bool</code> type. However, you can opt to overwrite the policy to return other type of data.</p>"
          },
          {
            "group": "Success JSON Response Body",
            "type": "string[]",
            "optional": true,
            "field": "unknowns",
            "description": "<p>Will include any <code>unknowns</code> references set (either explicitly set or auto-set by this API) when request an auth decision from the policy engine.</p>"
          },
          {
            "group": "Success JSON Response Body",
            "type": "object[]",
            "optional": true,
            "field": "residualRules",
            "description": "<p>Only presents when <code>hasResidualRules</code>=<code>true</code>. A list of residual rules as the result of the partial evaluation of policy due to <code>unknowns</code>. The residual rules can be used to generate storage engine DSL (e.g. SQL or Elasticsearch DSL) for policy enforcement.</p>"
          },
          {
            "group": "Success JSON Response Body",
            "type": "bool",
            "optional": true,
            "field": "hasWarns",
            "description": "<p>indicates whether or not the warning messages have been produced during OPA AST parsing. Not available when <code>rawAst</code> query parameter is set.</p>"
          },
          {
            "group": "Success JSON Response Body",
            "type": "string[]",
            "optional": true,
            "field": "warns",
            "description": "<p>Any warning messages that are produced during OPA AST parsing. Only available when <code>hasWarns</code>=<code>true</code>.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unconditional Result Example",
          "content": "{\n   \"hasResidualRules\" : false,\n   \"unknowns\": [],\n   \"result\": true // -- the evaluation value of the policy. By default, `true` means operation should be `allowed`.\n}",
          "type": "json"
        },
        {
          "title": "Partial Evaluation Result Example (Default Concise Format)",
          "content": "\n{\n   \"hasResidualRules\":true,\n   \"residualRules\": [{\"default\":false,\"value\":true,\"fullName\":\"data.partial.object.record.allow\",\"name\":\"allow\",\"expressions\":[{\"negated\":false,\"operator\":null,\"operands\":[{\"isRef\":true,\"value\":\"input.object.dataset.dcat-dataset-strings\"}]},{\"negated\":false,\"operator\":\"=\",\"operands\":[{\"isRef\":true,\"value\":\"input.object.record.publishing.state\"},{\"isRef\":false,\"value\":\"published\"}]}]}],\n   \"unknowns\": [\"input.object.dataset\"],\n   \"hasWarns\":false\n }",
          "type": "json"
        },
        {
          "title": "Partial Evaluation Result Example (Raw AST)",
          "content": "\n{\n   \"hasResidualRules\": true,\n   \"unknowns\": [\"input.object.dataset\"],\n   \"residualRules\": [{\"default\":true,\"head\":{\"name\":\"allow\",\"value\":{\"type\":\"boolean\",\"value\":false}},\"body\":[{\"terms\":{\"type\":\"boolean\",\"value\":true},\"index\":0}]},{\"head\":{\"name\":\"allow\",\"value\":{\"type\":\"boolean\",\"value\":true}},\"body\":[{\"terms\":[{\"type\":\"ref\",\"value\":[{\"type\":\"var\",\"value\":\"eq\"}]},{\"type\":\"ref\",\"value\":[{\"type\":\"var\",\"value\":\"input\"},{\"type\":\"string\",\"value\":\"object\"},{\"type\":\"string\",\"value\":\"dataset\"},{\"type\":\"string\",\"value\":\"publishingState\"}]},{\"type\":\"string\",\"value\":\"published\"}],\"index\":0}]}]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response Example / Status Code: 500/400",
          "content": "Failed to get auth decision: xxxxxxxxx",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/createOpaRouter.ts",
    "groupTitle": "Authorization API",
    "name": "PostV0AuthOpaDecisionPath"
  },
  {
    "group": "Auth_API_Keys",
    "type": "delete",
    "url": "/v0/auth/users/:userId/apiKeys/:apiKeyId",
    "title": "Delete an API Key of the user",
    "description": "<p>Delete an API Key of the user You need have <code>authObject/apiKey/delete</code> permission in order to access this API. As the default <code>Authenticated Users</code> roles contains the permission to all <code>authObject/apiKey/*</code> type operations with ownership constraint. All <code>Authenticated Users</code> (i.e. non-anonymous) users should always have access to their own API keys.</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>the id of the user.</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "apiKeyId",
            "description": "<p>the id of the api key.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"deleted\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_API_Keys",
    "name": "DeleteV0AuthUsersUseridApikeysApikeyid"
  },
  {
    "group": "Auth_API_Keys",
    "type": "get",
    "url": "/v0/auth/users/:userId/apiKeys",
    "title": "Get all API keys of a user",
    "description": "<p>Returns an array of api keys. When no api keys can be found, an empty array will be returned. You need have <code>authObject/apiKey/read</code> permission in order to access this API. As the default <code>Authenticated Users</code> roles contains the permission to all <code>authObject/apiKey/*</code> type operations with ownership constraint. All <code>Authenticated Users</code> (i.e. non-anonymous) users should always have access to their own API keys.</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>the id of the user.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n    id: \"b559889a-2843-4a60-9c6d-103d51eb4410\",\n    user_id: \"be374b6e-d428-4211-b642-b2b65abcf051\",\n    created_timestamp: \"2022-05-16T13:02:59.430Z\",\n    expiry_time: null,\n    last_successful_attempt_time: null,\n    last_failed_attempt_time: null,\n    enabled: true\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_API_Keys",
    "name": "GetV0AuthUsersUseridApikeys"
  },
  {
    "group": "Auth_API_Keys",
    "type": "get",
    "url": "/v0/auth/users/:userId/apiKeys/:apiKeyId",
    "title": "Get an API key of a user by ID",
    "description": "<p>Get an API key record of a user by ID by API key ID. You need have <code>authObject/apiKey/read</code> permission in order to access this API. As the default <code>Authenticated Users</code> roles contains the permission to all <code>authObject/apiKey/*</code> type operations with ownership constraint. All <code>Authenticated Users</code> (i.e. non-anonymous) users should always have access to their own API keys.</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>the id of the user.</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "apiKeyId",
            "description": "<p>the id of the api key.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    id: \"b559889a-2843-4a60-9c6d-103d51eb4410\",\n    user_id: \"be374b6e-d428-4211-b642-b2b65abcf051\",\n    created_timestamp: \"2022-05-16T13:02:59.430Z\",\n    expiry_time: null,\n    last_successful_attempt_time: null,\n    last_failed_attempt_time: null,\n    enabled: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_API_Keys",
    "name": "GetV0AuthUsersUseridApikeysApikeyid"
  },
  {
    "group": "Auth_API_Keys",
    "type": "get",
    "url": "/v0/private/users/apikey/:apiKeyId",
    "title": "Api Key Verification API",
    "description": "<p>Retrieve user info with api key id &amp; api key. This api is only available within cluster (i.e. it's not available via gateway) and only created for the gateway for purpose of verifying incoming API keys. This route doesn't require auth decision to be made as a user must provide valid API key id &amp; key to retrieve his own user info only.</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"id\":\"...\",\n    \"displayName\":\"Fred Nerk\",\n    \"photoURL\":\"...\",\n    \"OrgUnitId\": \"xxx\"\n    ...\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/createApiRouter.ts",
    "groupTitle": "Auth_API_Keys",
    "name": "GetV0PrivateUsersApikeyApikeyid"
  },
  {
    "group": "Auth_API_Keys",
    "type": "post",
    "url": "/v0/auth/users/:userId/apiKeys",
    "title": "Create a new API key for the user",
    "description": "<p>Create a new API key for the specified user. Optional supply a JSON object that contains <code>expiry_time</code> in body. You need have <code>authObject/apiKey/create</code> permission in order to access this API. As the default <code>Authenticated Users</code> roles contains the permission to all <code>authObject/apiKey/*</code> type operations with ownership constraint. All <code>Authenticated Users</code> (i.e. non-anonymous) users should always have access to their own API keys.</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>the id of the user.</p>"
          }
        ],
        "Json Body": [
          {
            "group": "Json Body",
            "type": "string",
            "optional": true,
            "field": "expiryTime",
            "description": "<p>The expiry time (in ISO format (ISO 8601)) of the API key that is about to be created.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  expiryTime: \"2022-05-16T13:02:59.430Z\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    id: \"b559889a-2843-4a60-9c6d-103d51eb4410\",\n    key: \"1RoGs0+MMYxjJlGH6UkyRnXC8Wrc9Y1ecREAnm5D2GM=\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_API_Keys",
    "name": "PostV0AuthUsersUseridApikeys"
  },
  {
    "group": "Auth_API_Keys",
    "type": "put",
    "url": "/v0/auth/users/:userId/apiKeys/:apiKeyId",
    "title": "Update an API Key of the user",
    "description": "<p>Update an API Key of the user. You need have <code>authObject/apiKey/update</code> permission in order to access this API. As the default <code>Authenticated Users</code> roles contains the permission to all <code>authObject/apiKey/*</code> type operations with ownership constraint. All <code>Authenticated Users</code> (i.e. non-anonymous) users should always have access to their own API keys.</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>the id of the user.</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "apiKeyId",
            "description": "<p>the id of the api key.</p>"
          }
        ],
        "Json Body": [
          {
            "group": "Json Body",
            "type": "string",
            "optional": true,
            "field": "expiryTime",
            "description": "<p>The expiry time (in ISO format (ISO 8601)) of the API key.</p>"
          },
          {
            "group": "Json Body",
            "type": "boolean",
            "optional": true,
            "field": "enabled",
            "description": "<p>Whether the api key is enabled.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  \"enabled\": false\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    id: \"b559889a-2843-4a60-9c6d-103d51eb4410\",\n    user_id: \"be374b6e-d428-4211-b642-b2b65abcf051\",\n    created_timestamp: \"2022-05-16T13:02:59.430Z\",\n    hash: \"$2b$10$6DD8hle27X/dVdDD3Sl3Y.V6NtJ9jBiy2cyS8SnBO5EEWMD5Wpdwe\",\n    expiry_time: null,\n    last_successful_attempt_time: null,\n    last_failed_attempt_time: null,\n    enabled: false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_API_Keys",
    "name": "PutV0AuthUsersUseridApikeysApikeyid"
  },
  {
    "group": "Auth_Access_Groups",
    "type": "delete",
    "url": "/v0/auth/accessGroups/:groupId",
    "title": "Delete an access group",
    "description": "<p>Delete an access group You can only delete an access group when all resources (e.g. datasets) that are associated with the access group are removed from the access group. Once an access group is deleted, the role &amp; permission that are associated with the access group will be also deleted.</p> <p>You need <code>object/record/delete</code> permission to the access group record in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "groupId",
            "description": "<p>id of the access group</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": true,
            "field": "Response",
            "description": "<p>Body] {boolean} result Indicates whether the deletion action is actually performed or the access group doesn't exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    result: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createAccessGroupApiRouter.ts",
    "groupTitle": "Auth_Access_Groups",
    "name": "DeleteV0AuthAccessgroupsGroupid"
  },
  {
    "group": "Auth_Access_Groups",
    "type": "delete",
    "url": "/v0/auth/accessGroups/:groupId/datasets/:datasetId",
    "title": "Remove an Dataset from an Access Group",
    "description": "<p>Remove an Dataset from an Access Group</p> <p>Access group users will lost the access (granted by the access group) to the removed dataset.</p> <p>You need <code>object/record/update</code> permission to the access group.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "groupId",
            "description": "<p>id of the access group</p>"
          },
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "datasetId",
            "description": "<p>id of the dataset</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": true,
            "field": "Response",
            "description": "<p>Body] {boolean} result Indicates whether the action is actually performed or the dataset had already been removed from the access group.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    result: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createAccessGroupApiRouter.ts",
    "groupTitle": "Auth_Access_Groups",
    "name": "DeleteV0AuthAccessgroupsGroupidDatasetsDatasetid"
  },
  {
    "group": "Auth_Access_Groups",
    "type": "delete",
    "url": "/v0/auth/accessGroups/:groupId/users/:userId",
    "title": "Remove an User from an Access Group",
    "description": "<p>Remove an User from an Access Group</p> <p>You need <code>object/record/update</code> permission to the access group record in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "groupId",
            "description": "<p>id of the access group</p>"
          },
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>id of the user to be added to the access group</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": true,
            "field": "Response",
            "description": "<p>Body] {boolean} result Indicates whether the action is actually performed or the user had already been added to the access group.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    result: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createAccessGroupApiRouter.ts",
    "groupTitle": "Auth_Access_Groups",
    "name": "DeleteV0AuthAccessgroupsGroupidUsersUserid"
  },
  {
    "group": "Auth_Access_Groups",
    "type": "get",
    "url": "/v0/auth/accessGroups/:groupId/users",
    "title": "Get all matched users in an access group",
    "description": "<p>return a list matched users of an access group. Required <code>object/record/read</code> permission to the access group in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "groupId",
            "description": "<p>id of the access group</p>"
          }
        ],
        "Query String": [
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "offset",
            "description": "<p>The index of the first record in the result set to retrieve.</p>"
          },
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "limit",
            "description": "<p>The maximum number of records of the result set to receive. If not present, a default value of 500 will be used.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When set, will only return user records whose &quot;displayName&quot;, &quot;email&quot; or &quot;source&quot; field contains the specified keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When set, will only return records whose id is the specified ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "source",
            "description": "<p>When set, will only return records whose source is the specified source name.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "sourceId",
            "description": "<p>When set, will only return records whose sourceId is the specified source ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "orgUnitId",
            "description": "<p>When set, will only return records whose orgUnitId is the specified org unit id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n    \"id\":\"...\",\n    \"displayName\":\"Fred Nerk\",\n    \"email\":\"fred.nerk@data61.csiro.au\",\n    \"photoURL\":\"...\",\n    \"source\":\"google\",\n    \"orgUnitId\": \"...\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createAccessGroupApiRouter.ts",
    "groupTitle": "Auth_Access_Groups",
    "name": "GetV0AuthAccessgroupsGroupidUsers"
  },
  {
    "group": "Auth_Access_Groups",
    "type": "get",
    "url": "/v0/auth/accessGroups/:groupId/users/count",
    "title": "Get the count of all matched users in an access group",
    "description": "<p>return the count number of all matched users of an access group. Required <code>object/record/read</code> permission to the access group in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "groupId",
            "description": "<p>id of the access group</p>"
          }
        ],
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When set, will only return user records whose &quot;displayName&quot;, &quot;email&quot; or &quot;source&quot; field contains the specified keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When set, will only return records whose id is the specified ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "source",
            "description": "<p>When set, will only return records whose source is the specified source name.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "sourceId",
            "description": "<p>When set, will only return records whose sourceId is the specified source ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "orgUnitId",
            "description": "<p>When set, will only return records whose orgUnitId is the specified org unit id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"count\" : 5\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createAccessGroupApiRouter.ts",
    "groupTitle": "Auth_Access_Groups",
    "name": "GetV0AuthAccessgroupsGroupidUsersCount"
  },
  {
    "group": "Auth_Access_Groups",
    "type": "post",
    "url": "/v0/auth/accessGroups",
    "title": "Create a new access group",
    "description": "<p>Create a new access group. Returns the newly created access group. Required <code>object/accessGroup/create</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "Request Body": [
          {
            "group": "Request Body",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>A name given to the access group</p>"
          },
          {
            "group": "Request Body",
            "type": "string",
            "optional": true,
            "field": "description",
            "description": "<p>The free text description for the access group</p>"
          },
          {
            "group": "Request Body",
            "type": "string[]",
            "optional": true,
            "field": "keywords",
            "description": "<p>Tags (or keywords) help users discover the access-group</p>"
          },
          {
            "group": "Request Body",
            "type": "string",
            "optional": false,
            "field": "resourceUri",
            "description": "<p>The Resource URI specifies the type of resources that the access group manages. At this moment, only one value <code>object/record</code> (registry records) is supported.</p>"
          },
          {
            "group": "Request Body",
            "type": "string",
            "optional": false,
            "field": "operationUris",
            "description": "<p>A list of operations that the access group allows enrolled users to perform on included resources.</p>"
          },
          {
            "group": "Request Body",
            "type": "string",
            "optional": true,
            "field": "ownerId",
            "description": "<p>The user ID of the access group owner. If not specified, the request user (if available) will be the owner. If a <code>null</code> value is supplied, the owner of the access group will be set to <code>null</code>.</p>"
          },
          {
            "group": "Request Body",
            "type": "string",
            "optional": true,
            "field": "orgUnitId",
            "description": "<p>The ID of the orgUnit that the access group belongs to. If not specified, the request user's orgUnit (if available) will be used. If a <code>null</code> value is supplied, the orgUnit of the access group will be set to <code>null</code>.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  \"name\": \"a test access group\",\n  \"description\": \"a test access group\",\n  \"resourceUri\": \"object/record\",\n  \"keywords\": [\"keyword 1\", \"keyword2\"],\n  \"operationUris\": [\"object/record/read\", \"object/record/update\"],\n  \"ownerId\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n  \"orgUnitId\": \"36ef9450-6579-421c-a178-d3b5b4f1a3df\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"name\": \"a test access group\",\n   \"description\": \"a test access group\",\n   \"resourceUri\": \"object/record\",\n   \"operationUris\": [\"object/record/read\", \"object/record/update\"],\n   \"keywords\": [\"keyword 1\", \"keyword2\"],\n   \"permissionId\": \"2b117a5f-dadb-4130-bf44-b72ee67d009b\",\n   \"roleId\": \"5b616fa0-a123-4e9c-b197-65b3db8522fa\",\n   \"ownerId\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"orgUnitId\": \"36ef9450-6579-421c-a178-d3b5b4f1a3df\",\n   \"createBy\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"editTime\": \"2022-03-28T10:18:10.479Z\",\n   \"editBy\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"editTime\": \"2022-03-28T10:18:10.479Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createAccessGroupApiRouter.ts",
    "groupTitle": "Auth_Access_Groups",
    "name": "PostV0AuthAccessgroups"
  },
  {
    "group": "Auth_Access_Groups",
    "type": "post",
    "url": "/v0/auth/accessGroups/:groupId/datasets/:datasetId",
    "title": "Add an Dataset to an Access Group",
    "description": "<p>Add an Dataset to an Access Group</p> <p>Access group users will all granted access (specified by the access group permission) to all added datasets.</p> <p>You need <code>object/record/update</code> permission to both access group and dataset record in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "groupId",
            "description": "<p>id of the access group</p>"
          },
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "datasetId",
            "description": "<p>id of the dataset</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": true,
            "field": "Response",
            "description": "<p>Body] {boolean} result Indicates whether the action is actually performed or the dataset had already been added to the access group.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    result: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createAccessGroupApiRouter.ts",
    "groupTitle": "Auth_Access_Groups",
    "name": "PostV0AuthAccessgroupsGroupidDatasetsDatasetid"
  },
  {
    "group": "Auth_Access_Groups",
    "type": "post",
    "url": "/v0/auth/accessGroups/:groupId/users/:userId",
    "title": "Add an User to an Access Group",
    "description": "<p>Add an User to an Access Group</p> <p>Access group users have access (specified by the access group permission) to all datasets in the access group.</p> <p>You need <code>object/record/update</code> permission to the access group record in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "groupId",
            "description": "<p>id of the access group</p>"
          },
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>id of the user to be added to the access group</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": true,
            "field": "Response",
            "description": "<p>Body] {boolean} result Indicates whether the action is actually performed or the user had already been added to the access group.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    result: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createAccessGroupApiRouter.ts",
    "groupTitle": "Auth_Access_Groups",
    "name": "PostV0AuthAccessgroupsGroupidUsersUserid"
  },
  {
    "group": "Auth_Access_Groups",
    "type": "put",
    "url": "/v0/auth/accessGroups/:groupId",
    "title": "Update an access group",
    "description": "<p>Update an access group Supply a JSON object that contains fields to be updated in body. You need have <code>authObject/operation/update</code> permission to access this API. Please note: you can't update the <code>resourceUri</code> field of an access group. If you have to change the resource type, you should delete the access group and create a new one.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "groupId",
            "description": "<p>id of the access group</p>"
          }
        ],
        "Request Body": [
          {
            "group": "Request Body",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>the name given to the access group</p>"
          },
          {
            "group": "Request Body",
            "type": "string",
            "optional": true,
            "field": "description",
            "description": "<p>The free text description for the access group</p>"
          },
          {
            "group": "Request Body",
            "type": "string[]",
            "optional": true,
            "field": "keywords",
            "description": "<p>Tags (or keywords) help users discover the access-group</p>"
          },
          {
            "group": "Request Body",
            "type": "string",
            "optional": true,
            "field": "operationUris",
            "description": "<p>A list of operations that the access group allows enrolled users to perform on included resources.</p>"
          },
          {
            "group": "Request Body",
            "type": "string",
            "optional": true,
            "field": "ownerId",
            "description": "<p>The user ID of the access group owner. If not specified, the request user (if available) will be the owner. If a <code>null</code> value is supplied, the owner of the access group will be set to <code>null</code>.</p>"
          },
          {
            "group": "Request Body",
            "type": "string",
            "optional": true,
            "field": "orgUnitId",
            "description": "<p>The ID of the orgUnit that the access group belongs to. If not specified, the request user's orgUnit (if available) will be used. If a <code>null</code> value is supplied, the orgUnit of the access group will be set to <code>null</code>.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  \"name\": \"a test access group 2\",\n  \"description\": \"a test access group\",\n  \"keywords\": [\"keyword 1\", \"keyword2\"],\n  \"operationUris\": [\"object/record/read\"],\n  \"ownerId\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n  \"orgUnitId\": null\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"name\": \"a test access group 2\",\n   \"description\": \"a test access group\",\n   \"resourceUri\": \"object/record\",\n   \"operationUris\": [\"object/record/read\"],\n   \"keywords\": [\"keyword 1\", \"keyword2\"],\n   \"permissionId\": \"2b117a5f-dadb-4130-bf44-b72ee67d009b\",\n   \"roleId\": \"5b616fa0-a123-4e9c-b197-65b3db8522fa\",\n   \"ownerId\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"orgUnitId\": null,\n   \"createBy\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"editTime\": \"2022-03-28T10:18:10.479Z\",\n   \"editBy\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"editTime\": \"2022-03-28T10:18:10.479Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createAccessGroupApiRouter.ts",
    "groupTitle": "Auth_Access_Groups",
    "name": "PutV0AuthAccessgroupsGroupid"
  },
  {
    "group": "Auth_Operations",
    "type": "delete",
    "url": "/v0/auth/operations/:id",
    "title": "Delete an operation record",
    "description": "<p>Delete an operation record. When the operation is deleted, access will be removed from all existing permissions that are relevant to the operation.</p> <p>You need <code>authObject/operation/delete</code> permission in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>id of the operation</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": true,
            "field": "Response",
            "description": "<p>Body] {boolean} result Indicates whether the deletion action is actually performed or the record doesn't exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    result: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOperationApiRouter.ts",
    "groupTitle": "Auth_Operations",
    "name": "DeleteV0AuthOperationsId"
  },
  {
    "group": "Auth_Operations",
    "type": "get",
    "url": "/v0/auth/operations/byUri/*",
    "title": "Get a operation record by URI",
    "description": "<p>Get a operation record by URI Required <code>authObject/operation/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "resUri",
            "description": "<p>the operation uri can be specified at the end of the URI path. e.g. <code>/v0/auth/operations/byUri/object/aspect/delete</code></p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"uri\": \"object/aspect/delete\",\n   \"name\": \"Delete Aspect Definition\",\n   \"description\": \"test description\",\n   \"resource_id\": \"2c0981d2-71bf-4806-a590-d1c779dcad8b\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOperationApiRouter.ts",
    "groupTitle": "Auth_Operations",
    "name": "GetV0AuthOperationsByuri"
  },
  {
    "group": "Auth_Operations",
    "type": "get",
    "url": "/v0/auth/operations/:id",
    "title": "Get an operation record by ID",
    "description": "<p>Get an operation record by ID Required <code>authObject/operation/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>the operation id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"uri\": \"object/aspect/delete\",\n   \"name\": \"Delete Aspect Definition\",\n   \"description\": \"test description\",\n   \"resource_id\": \"2c0981d2-71bf-4806-a590-d1c779dcad8b\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOperationApiRouter.ts",
    "groupTitle": "Auth_Operations",
    "name": "GetV0AuthOperationsId"
  },
  {
    "group": "Auth_Operations",
    "type": "get",
    "url": "/v0/auth/resources/:resId/operations",
    "title": "Get operations of a resource that meet selection criteria",
    "description": "<p>return operation records of a role that meet selection criteria Required <code>authObject/resource/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When specified, will return only role records whose <code>name</code>, <code>description</code> or <code>uri</code> contains the supplied keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When specified, will return the records whose <code>id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "uri",
            "description": "<p>When specified, will return the records whose <code>uri</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "offset",
            "description": "<p>When specified, will return the records from specified offset in the result set.</p>"
          },
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "limit",
            "description": "<p>This parameter no.of records to be returned.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"uri\": \"object/aspect/delete\",\n   \"name\": \"Delete Aspect Definition\",\n   \"description\": \"test description\",\n   \"resource_id\": \"2c0981d2-71bf-4806-a590-d1c779dcad8b\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createResourceApiRouter.ts",
    "groupTitle": "Auth_Operations",
    "name": "GetV0AuthResourcesResidOperations"
  },
  {
    "group": "Auth_Operations",
    "type": "get",
    "url": "/v0/auth/resources/:resId/operations/count",
    "title": "Get the count of all operations of a resource that meet selection criteria",
    "description": "<p>return the count of all operation records of a role that meet selection criteria Required <code>authObject/resource/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When specified, will return only role records whose <code>name</code>, <code>description</code> or <code>uri</code> contains the supplied keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When specified, will return the records whose <code>id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "uri",
            "description": "<p>When specified, will return the records whose <code>uri</code> matches the supplied value.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"count\": 5\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createResourceApiRouter.ts",
    "groupTitle": "Auth_Operations",
    "name": "GetV0AuthResourcesResidOperationsCount"
  },
  {
    "group": "Auth_Operations",
    "type": "post",
    "url": "/v0/auth/resources/:resId/operations",
    "title": "Create an operation for a resource",
    "description": "<p>Create an new operation for a resource Returns the newly created operation record. Required <code>authObject/operation/create</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "resId",
            "description": "<p>id of the resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n   \"uri\": \"object/aspect/delete\",\n   \"name\": \"Delete Aspect Definition\",\n   \"description\": \"test description\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"uri\": \"object/aspect/delete\",\n   \"name\": \"Delete Aspect Definition\",\n   \"description\": \"test description\",\n   \"resource_id\": \"2c0981d2-71bf-4806-a590-d1c779dcad8b\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createResourceApiRouter.ts",
    "groupTitle": "Auth_Operations",
    "name": "PostV0AuthResourcesResidOperations"
  },
  {
    "group": "Auth_Operations",
    "type": "put",
    "url": "/v0/auth/operations/:id",
    "title": "Update a operation record",
    "description": "<p>Update a operation record Supply a JSON object that contains fields to be updated in body. You need have <code>authObject/operation/update</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>id of the operation record</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n   \"uri\": \"object/aspect/delete\",\n   \"name\": \"Delete Aspect Definition\",\n   \"description\": \"test description\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"uri\": \"object/aspect/delete\",\n   \"name\": \"Delete Aspect Definition\",\n   \"description\": \"test description\",\n   \"resource_id\": \"2c0981d2-71bf-4806-a590-d1c779dcad8b\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOperationApiRouter.ts",
    "groupTitle": "Auth_Operations",
    "name": "PutV0AuthOperationsId"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "delete",
    "url": "/v0/auth/orgunits/:nodeId",
    "title": "Delete an org unit node",
    "description": "<p>Delete an org unit node. You can't delete a root node with this API.</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "nodeId",
            "description": "<p>The id of the node to be deleted.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "true",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 403, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "DeleteV0AuthOrgunitsNodeid"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "delete",
    "url": "/v0/auth/orgunits/:nodeId/subtree",
    "title": "Delete subtree",
    "description": "<p>Deletes a node and all its children. Will delete the root node if that is the one specified in nodeId.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nodeId",
            "description": "<p>id of the node to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"result\": \"SUCCESS\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "DeleteV0AuthOrgunitsNodeidSubtree"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "get",
    "url": "/v0/auth/orgunits",
    "title": "Get orgunits by name",
    "description": "<p>Gets org units matching a name Optionally provide a test Org Unit Id that will be used to test the relationship with each of returned orgUnit item. Possible Value: 'ancestor', 'descendant', 'equal', 'unrelated'</p>",
    "parameter": {
      "fields": {
        "query": [
          {
            "group": "query",
            "type": "string",
            "optional": false,
            "field": "nodeName",
            "description": "<p>the name of the org unit to look up</p>"
          },
          {
            "group": "query",
            "type": "boolean",
            "optional": false,
            "field": "leafNodesOnly",
            "description": "<p>Whether only leaf nodes should be returned</p>"
          }
        ],
        "Query": [
          {
            "group": "Query",
            "type": "string",
            "optional": false,
            "field": "relationshipOrgUnitId",
            "description": "<p>Optional; The org unit id that is used to test the relationship with each of returned orgUnit item.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n  \"id\": \"e5f0ed5f-aa97-4e49-89a6-3f044aecc3f7\",\n  \"name\": \"other-team\",\n  \"description\": \"The other teams\",\n  \"relationship\": \"unrelated\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "GetV0AuthOrgunits"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "get",
    "url": "/v0/auth/orgunits/bylevel/:orgLevel",
    "title": "List OrgUnits at certain org tree level",
    "description": "<p>List all OrgUnits at certain org tree level Optionally provide a test Org Unit Id that will be used to test the relationship with each of returned orgUnit item. Possible Value: 'ancestor', 'descendant', 'equal', 'unrelated'</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "orgLevel",
            "description": "<p>The level number (starts from 1) where org Units of the tree are taken horizontally.</p>"
          }
        ],
        "Query": [
          {
            "group": "Query",
            "type": "string",
            "optional": false,
            "field": "relationshipOrgUnitId",
            "description": "<p>Optional; The org unit id that is used to test the relationship with each of returned orgUnit item.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n  \"id\": \"e5f0ed5f-aa97-4e49-89a6-3f044aecc3f7\",\n  \"name\": \"node 1\",\n  \"description\": \"xxxxxxxx\",\n  \"relationship\": \"unrelated\"\n},{\n  \"id\": \"e5f0ed5f-bb00-4e49-89a6-3f044aecc3f7\",\n  \"name\": \"node 2\",\n  \"description\": \"xxxxxxxx\",\n  \"relationship\": \"ancestor\"\n}]",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "GetV0AuthOrgunitsBylevelOrglevel"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "get",
    "url": "/v0/auth/orgunits/:higherNodeId/topDownPathTo/:lowerNodeId",
    "title": "Get get top down path between 2 nodes",
    "description": "<p>Get all nodes on the top to down path between the <code>higherNode</code> to the <code>lowerNode</code>. Sort from higher level nodes to lower level node. Result will include <code>higherNode</code> and the <code>lowerNode</code>. If <code>higherNode</code> and the <code>lowerNode</code> is the same node, an array contains the single node will be responded. If a path doesn't exist, <code>[]</code> (empty array) will be responded. If you pass a lower node to the <code>higherNodeId</code> and a higher node to <code>lowerNodeId</code>, <code>[]</code> (empty array) will be responded. If you don't have access to the higherNode, <code>[]</code> (empty array) will be responded.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nodeId",
            "description": "<p>id of the node to query</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n  id: \"e5f0ed5f-aa97-4e49-89a6-3f044aecc3f7\"\n  name: \"other-team\"\n  description: \"The other teams\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "Not authorized",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "GetV0AuthOrgunitsHighernodeidTopdownpathtoLowernodeid"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "get",
    "url": "/v0/auth/orgunits/:nodeId",
    "title": "Get details for a node",
    "description": "<p>Gets the details of the node with this id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nodeId",
            "description": "<p>id of the node to query</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  id: \"e5f0ed5f-aa97-4e49-89a6-3f044aecc3f7\"\n  name: \"other-team\"\n  description: \"The other teams\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "GetV0AuthOrgunitsNodeid"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "get",
    "url": "/v0/auth/orgunits/:nodeId/children/all",
    "title": "Get all children for a node",
    "description": "<p>Gets all the children below the requested node recursively. If node doesn't exist, returns an empty list.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nodeId",
            "description": "<p>id of the node to query</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": " [{\n  id: \"e5f0ed5f-aa97-4e49-89a6-3f044aecc3f7\"\n  name: \"other-team\"\n  description: \"The other teams\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "GetV0AuthOrgunitsNodeidChildrenAll"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "get",
    "url": "/v0/auth/orgunits/:nodeId/children/immediate",
    "title": "Get immediate children for a node",
    "description": "<p>Gets all the children immediately below the requested node. If the node doesn't exist, returns an empty list.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nodeId",
            "description": "<p>id of the node to query</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": " [{\n  id: \"e5f0ed5f-aa97-4e49-89a6-3f044aecc3f7\"\n  name: \"other-team\"\n  description: \"The other teams\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "GetV0AuthOrgunitsNodeidChildrenImmediate"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "get",
    "url": "/v0/auth/orgunits/root",
    "title": "Get root organisational unit",
    "description": "<p>Gets the root organisation unit (top of the tree).</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  id: \"e5f0ed5f-aa97-4e49-89a6-3f044aecc3f7\"\n  name: \"other-team\"\n  description: \"The other teams\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "GetV0AuthOrgunitsRoot"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "post",
    "url": "/v0/auth/orgunits/:parentNodeId/insert",
    "title": "Create a new node under the parent node",
    "description": "<p>Create a new node under the specified parent node</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "parentNodeId",
            "description": "<p>id of the parent node</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  name: \"other-team\"\n  description: \"The other teams\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"id\": \"e5f0ed5f-aa97-4e49-89a6-3f044aecc3f7\",\n  \"name\": \"other-team\",\n  description: \"The other teams\"\n}",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "PostV0AuthOrgunitsParentnodeidInsert"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "post",
    "url": "/v0/auth/orgunits/root",
    "title": "Create root organisation",
    "description": "<p>Creates the root organisation unit (top of the tree).</p>",
    "parameter": {
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  id: \"e5f0ed5f-aa97-4e49-89a6-3f044aecc3f7\"\n  name: \"other-team\"\n  description: \"The other teams\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"nodeId\": \"e5f0ed5f-aa97-4e49-89a6-3f044aecc3f7\"\n}",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "PostV0AuthOrgunitsRoot"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "put",
    "url": "/v0/auth/orgunits/:nodeId",
    "title": "Update details for a node",
    "description": "<p>Update the node with the specified id with supplied node data.</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "nodeId",
            "description": "<p>id of the node to query</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  name: \"other-team\"\n  description: \"The other teams\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"id\": \"e5f0ed5f-aa97-4e49-89a6-3f044aecc3f7\",\n  \"name\": \"other-team\",\n  description: \"The other teams\"\n}",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "PutV0AuthOrgunitsNodeid"
  },
  {
    "group": "Auth_OrgUnits",
    "type": "put",
    "url": "/v0/auth/orgunits/:nodeId/move/:newParentId",
    "title": "Move a sub tree to a new parennt",
    "description": "<p>Move a sub tree to a new parennt.</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "nodeId",
            "description": "<p>The id of the root node of the sub tree to be moved.</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "newParentId",
            "description": "<p>The new parent node id that the sub tree wil be attached to.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "true",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 403, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createOrgUnitApiRouter.ts",
    "groupTitle": "Auth_OrgUnits",
    "name": "PutV0AuthOrgunitsNodeidMoveNewparentid"
  },
  {
    "group": "Auth_Permissions",
    "type": "delete",
    "url": "/v0/auth/permissions/:permissionId",
    "title": "Delete a permission record",
    "description": "<p>Delete a permission record. If this permission has been assigned to any roles, an error will be thrown. You need <code>authObject/permission/delete</code> permission in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "permissionId",
            "description": "<p>id of the permission record</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": true,
            "field": "Response",
            "description": "<p>Body] {boolean} result Indicates whether the deletion action is actually performed or the permission record doesn't exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    result: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createPermissionApiRouter.ts",
    "groupTitle": "Auth_Permissions",
    "name": "DeleteV0AuthPermissionsPermissionid"
  },
  {
    "group": "Auth_Permissions",
    "type": "delete",
    "url": "/v0/auth/roles/:roleId/permissions/:permissionId",
    "title": "Remove a permission from a role",
    "description": "<p>Remove a permission assignment from a role. if the permission has not assigned to any other roles, the permission will be deleted as well unless the <code>deletePermission</code> query string parameter is set to <code>false</code>. You need <code>authObject/role/update</code> permission in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          },
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "permissionId",
            "description": "<p>id of the permission record</p>"
          }
        ],
        "QueryString": [
          {
            "group": "QueryString",
            "type": "boolean",
            "optional": true,
            "field": "deletePermission",
            "description": "<p>Default to <code>true</code>. Indicate whether the API should attempt to delete the permission record as well after remove the permission assignment. Please note: when <code>deletePermission</code> = true, the API will ony delete the permission record when it has not assigned to any other roles.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Response Body": [
          {
            "group": "Response Body",
            "type": "boolean",
            "optional": false,
            "field": "result",
            "description": "<p>Indicates whether the deletion action is actually performed or the permission record doesn't exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    result: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Permissions",
    "name": "DeleteV0AuthRolesRoleidPermissionsPermissionid"
  },
  {
    "group": "Auth_Permissions",
    "type": "get",
    "url": "/v0/auth/permissions/:id",
    "title": "Get permission by ID",
    "description": "<p>return the permission record identified by the ID Required admin access.</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    id: \"xxx-xxx-xxxx-xxxx-xx\",\n    name: \"View Datasets\",\n    resource_id: \"xxx-xxx-xxxx-xx\",\n    resource_uri: \"object/dataset/draft\",\n    user_ownership_constraint: true,\n    org_unit_ownership_constraint: false,\n    pre_authorised_constraint: false,\n    allow_exemption: false,\n    operations: [{\n      id: \"xxxxx-xxx-xxx-xxxx\",\n      name: \"Read Draft Dataset\",\n      uri: \"object/dataset/draft/read\",\n      description: \"xxxxxx\"\n    }],\n    description?: \"this is a dummy permission\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createPermissionApiRouter.ts",
    "groupTitle": "Auth_Permissions",
    "name": "GetV0AuthPermissionsId"
  },
  {
    "group": "Auth_Permissions",
    "type": "get",
    "url": "/v0/auth/roles/:roleId/permissions",
    "title": "Get all matched permissions of a role",
    "description": "<p>return a list matched permissions of a role. Required <code>authObject/role/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          }
        ],
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When specified, will return only permissions whose <code>name</code> or <code>description</code> contains the supplied keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When specified, will return the permission whose <code>id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "owner_id",
            "description": "<p>When specified, will return the permission whose <code>owner_id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "create_by",
            "description": "<p>When specified, will return the permission whose <code>create_by</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "edit_by",
            "description": "<p>When specified, will return the permission whose <code>edit_by</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "offset",
            "description": "<p>When specified, will return the records from specified offset in the result set.</p>"
          },
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "limit",
            "description": "<p>This parameter no.of records to be returned.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n    id: \"xxx-xxx-xxxx-xxxx-xx\",\n    name: \"View Datasets\",\n    resource_id: \"xxx-xxx-xxxx-xx\",\n    resource_uri: \"object/dataset/draft\",\n    user_ownership_constraint: true,\n    org_unit_ownership_constraint: false,\n    pre_authorised_constraint: false,\n    allow_exemption: false,\n    operations: [{\n      id: \"xxxxx-xxx-xxx-xxxx\",\n      name: \"Read Draft Dataset\",\n      uri: \"object/dataset/draft/read\",\n      description: \"xxxxxx\"\n    }],\n    description?: \"this is a dummy permission\",\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Permissions",
    "name": "GetV0AuthRolesRoleidPermissions"
  },
  {
    "group": "Auth_Permissions",
    "type": "get",
    "url": "/v0/auth/roles/:roleId/permissions/count",
    "title": "Get the count of all matched permissions of a role",
    "description": "<p>return the count number of all matched permissions of a role. Required <code>authObject/role/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          }
        ],
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When specified, will return only permissions whose <code>name</code> or <code>description</code> contains the supplied keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When specified, will return the permission whose <code>id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "owner_id",
            "description": "<p>When specified, will return the permission whose <code>owner_id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "create_by",
            "description": "<p>When specified, will return the permission whose <code>create_by</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "edit_by",
            "description": "<p>When specified, will return the permission whose <code>edit_by</code> matches the supplied value.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"count\" : 5\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Permissions",
    "name": "GetV0AuthRolesRoleidPermissionsCount"
  },
  {
    "group": "Auth_Permissions",
    "type": "get",
    "url": "/v0/auth/users/:userId/permissions",
    "title": "Get all permissions of a user",
    "description": "<p>Returns an array of permissions. When no permissions can be found, an empty array will be returned. You need have read permission to the user record in order to access this API.</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n    id: \"xxx-xxx-xxxx-xxxx-xx\",\n    name: \"View Datasets\",\n    resourceId: \"xxx-xxx-xxxx-xx\",\n    resourceId: \"object/dataset/draft\",\n    userOwnershipConstraint: true,\n    orgUnitOwnershipConstraint: false,\n    preAuthorisedConstraint: false,\n    allowExemption: false,\n    operations: [{\n      id: \"xxxxx-xxx-xxx-xxxx\",\n      name: \"Read Draft Dataset\",\n      uri: \"object/dataset/draft/read\",\n      description: \"xxxxxx\"\n    }],\n    permissionIds: [\"xxx-xxx-xxx-xxx-xx\", \"xxx-xx-xxx-xx-xxx-xx\"],\n    description?: \"This is an admin role\",\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Permissions",
    "name": "GetV0AuthUsersUseridPermissions"
  },
  {
    "group": "Auth_Permissions",
    "type": "post",
    "url": "/v0/auth/permissions",
    "title": "Create a new permission record",
    "description": "<p>Create a new permission Returns the newly created permission record. Required <code>authObject/permission/create</code> permission to access this API.</p>",
    "parameter": {
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  \"name\": \"a test permission\",\n  \"user_ownership_constraint\": false,\n  \"org_unit_ownership_constraint\": true,\n  \"pre_authorised_constraint\" : false,\n  \"allow_exemption\": false,\n  \"description\": \"a test permission\",\n  \"resource_id\": \"477d0720-aeda-47bd-8fc9-65badb851f46\",\n  // alternatively, you can supply resourceUri instead of resourceId\n  // \"resourceUri\": \"object/dataset/draft\",\n  \"operationIds\": [\"739b5a83-291d-4420-a0eb-8fbeb2b5c186\", \"e64241f7-1660-4a6c-9bd9-07f716cf9156\"]\n  // alternatively, you can supply operationUris instead of operationIds\n  // \"operationUris\": [\"object/dataset/draft/read\", \"object/dataset/draft/write\"]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"name\": \"a test permission\",\n   \"user_ownership_constraint\": false,\n   \"org_unit_ownership_constraint\": true,\n   \"pre_authorised_constraint\" : false,\n   \"allow_exemption\": false,\n   \"description\": \"a test permission\",\n   \"resource_id\": \"477d0720-aeda-47bd-8fc9-65badb851f46\",\n   \"owner_id\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"create_by\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"edit_time\": \"2022-03-28T10:18:10.479Z\",\n   \"edit_by\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"edit_time\": \"2022-03-28T10:18:10.479Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createPermissionApiRouter.ts",
    "groupTitle": "Auth_Permissions",
    "name": "PostV0AuthPermissions"
  },
  {
    "group": "Auth_Permissions",
    "type": "post",
    "url": "/v0/auth/roles/:roleId/permissions",
    "title": "Create a new permission and add to the role",
    "description": "<p>Create a new permission and add to the role specified by roleId. Returns the newly created permission record. Required <code>authObject/role/update</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  \"name\": \"a test permission\",\n  \"user_ownership_constraint\": false,\n  \"org_unit_ownership_constraint\": true,\n  \"pre_authorised_constraint\" : false,\n  \"allow_exemption\": false,\n  \"description\": \"a test permission\",\n  \"resource_id\": \"477d0720-aeda-47bd-8fc9-65badb851f46\",\n  // alternatively, you can supply resourceUri instead of resourceId\n  // \"resourceUri\": \"object/dataset/draft\",\n  \"operationIds\": [\"739b5a83-291d-4420-a0eb-8fbeb2b5c186\", \"e64241f7-1660-4a6c-9bd9-07f716cf9156\"]\n  // alternatively, you can supply operationUris instead of operationIds\n  // \"operationUris\": [\"object/dataset/draft/read\", \"object/dataset/draft/write\"]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"name\": \"a test permission\",\n   \"user_ownership_constraint\": false,\n   \"org_unit_ownership_constraint\": true,\n   \"pre_authorised_constraint\" : false,\n   \"allow_exemption\": false,\n   \"description\": \"a test permission\",\n   \"resource_id\": \"477d0720-aeda-47bd-8fc9-65badb851f46\",\n   \"owner_id\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"create_by\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"edit_time\": \"2022-03-28T10:18:10.479Z\",\n   \"edit_by\": \"3535fdad-1804-4614-a9ce-ce196e880238\",\n   \"edit_time\": \"2022-03-28T10:18:10.479Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Permissions",
    "name": "PostV0AuthRolesRoleidPermissions"
  },
  {
    "group": "Auth_Permissions",
    "type": "post",
    "url": "/v0/auth/roles/:roleId/permissions/:permissionId",
    "title": "Assign a permission to a role",
    "description": "<p>Assign an existing permission to the role specified by roleId. Required <code>authObject/role/update</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          },
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "permissionId",
            "description": "<p>id of the permission to be added to the role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Response Body": [
          {
            "group": "Response Body",
            "type": "boolean",
            "optional": false,
            "field": "result",
            "description": "<p>Indicates whether the action is actually performed or the permission had assigned to the role already.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"result\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Permissions",
    "name": "PostV0AuthRolesRoleidPermissionsPermissionid"
  },
  {
    "group": "Auth_Permissions",
    "type": "put",
    "url": "/v0/auth/permissions/:permissionId",
    "title": "Update a permission record",
    "description": "<p>Update a permission record Supply a JSON object that contains fields to be updated in body. You need have update permission to the permission record (<code>authObject/permission/update</code>) in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "permissionId",
            "description": "<p>id of the permission record</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  \"name\": \"xxxxx\",\n  \"description\": \"xxsdsd\",\n  \"resource_id\": \"1c0889aa-6d4f-4492-9a6f-1ecc4765e8d6\",\n  // alternatively, you can supply resourceUri instead of resourceId\n  // \"resourceUri\": \"object/dataset/draft\",\n  \"user_ownership_constraint\": true,\n  \"allow_exemption\": false,\n  \"org_unit_ownership_constraint\": false,\n  \"pre_authorised_constraint\": false,\n  \"operationIds\": [\"8d4b99f3-c0c0-46e6-9832-330d14abad00\", \"7c2013bd-eee6-40f1-83ef-920600d21db3\"]\n  // alternatively, you can supply operationUris instead of operationIds\n  // \"operationUris\": [\"object/dataset/draft/read\", \"object/dataset/draft/write\"]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  id: \"c85a9735-7d85-4d50-a151-c79dec644ba0\",\n  \"name\": \"xxxxx\",\n  \"description\": \"sdfsdfds sdfsdf sdfs\",\n  \"resource_id\": \"1c0889aa-6d4f-4492-9a6f-1ecc4765e8d6\",\n  \"user_ownership_constraint\": true,\n  \"org_unit_ownership_constraint\": false,\n  \"pre_authorised_constraint\": false,\n  \"allow_exemption\": false,\n  \"owner_id\": \"78b37c9b-a59a-4da1-9b84-ac48dff43a1a\",\n  \"create_by\": \"78b37c9b-a59a-4da1-9b84-ac48dff43a1a\",\n  \"create_time\": \"2022-06-03 02:28:34.794547+00\",\n  \"edit_by\": \"78b37c9b-a59a-4da1-9b84-ac48dff43a1a\",\n  \"edit_time\": \"2022-06-03 02:28:34.794547+00\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createPermissionApiRouter.ts",
    "groupTitle": "Auth_Permissions",
    "name": "PutV0AuthPermissionsPermissionid"
  },
  {
    "group": "Auth_Permissions",
    "type": "put",
    "url": "/v0/auth/roles/:roleId/permissions/:permissionId",
    "title": "Update a role's permission record",
    "description": "<p>Update a role's permission record Supply a JSON object that contains fields to be updated in body. You need have update permission to the role record (<code>authObject/role/update</code>) in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          },
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "permissionId",
            "description": "<p>id of the permission record</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  \"name\": \"xxxxx\",\n  \"description\": \"xxsdsd\",\n  \"resource_id\": \"1c0889aa-6d4f-4492-9a6f-1ecc4765e8d6\",\n  // alternatively, you can supply resourceUri instead of resourceId\n  // \"resourceUri\": \"object/dataset/draft\",\n  \"user_ownership_constraint\": true,\n  \"org_unit_ownership_constraint\": false,\n  \"pre_authorised_constraint\": false,\n  \"allow_exemption\": false,\n  \"operationIds\": [\"8d4b99f3-c0c0-46e6-9832-330d14abad00\", \"7c2013bd-eee6-40f1-83ef-920600d21db3\"],\n  // alternatively, you can supply operationUris instead of operationIds\n  // \"operationUris\": [\"object/dataset/draft/read\", \"object/dataset/draft/write\"]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  id: \"c85a9735-7d85-4d50-a151-c79dec644ba0\",\n  \"name\": \"xxxxx\",\n  \"description\": \"sdfsdfds sdfsdf sdfs\",\n  \"resource_id\": \"1c0889aa-6d4f-4492-9a6f-1ecc4765e8d6\",\n  \"user_ownership_constraint\": true,\n  \"org_unit_ownership_constraint\": false,\n  \"pre_authorised_constraint\": false,\n  \"allow_exemption\": false,\n  \"owner_id\": \"78b37c9b-a59a-4da1-9b84-ac48dff43a1a\",\n  \"create_by\": \"78b37c9b-a59a-4da1-9b84-ac48dff43a1a\",\n  \"create_time\": \"2022-06-03 02:28:34.794547+00\",\n  \"edit_by\": \"78b37c9b-a59a-4da1-9b84-ac48dff43a1a\",\n  \"edit_time\": \"2022-06-03 02:28:34.794547+00\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Permissions",
    "name": "PutV0AuthRolesRoleidPermissionsPermissionid"
  },
  {
    "group": "Auth_Resources",
    "type": "delete",
    "url": "/v0/auth/resources/:id",
    "title": "Delete a resource record",
    "description": "<p>Delete a resource record. When the resource is deleted, any operations that are associated with this resource will be removed as well. However, if there is a permission associated with the resource that is to be deleted, a database error will be thrown.</p> <p>You need <code>authObject/resource/delete</code> permission in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>id of the resource</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": true,
            "field": "Response",
            "description": "<p>Body] {boolean} result Indicates whether the deletion action is actually performed or the record doesn't exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    result: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createResourceApiRouter.ts",
    "groupTitle": "Auth_Resources",
    "name": "DeleteV0AuthResourcesId"
  },
  {
    "group": "Auth_Resources",
    "type": "get",
    "url": "/v0/auth/resource/count",
    "title": "Get the count of all matched resource records",
    "description": "<p>return the count number of all matched resource records. Required <code>authObject/resource/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When specified, will return only permissions whose <code>name</code>, <code>description</code> or <code>uri</code> contains the supplied keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When specified, will return the records whose <code>id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "uri",
            "description": "<p>When specified, will return the records whose <code>uri</code> field matches the supplied value.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"count\" : 5\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createResourceApiRouter.ts",
    "groupTitle": "Auth_Resources",
    "name": "GetV0AuthResourceCount"
  },
  {
    "group": "Auth_Resources",
    "type": "get",
    "url": "/v0/auth/resources",
    "title": "Get all matched resource records",
    "description": "<p>return a list matched resource records. Required <code>authObject/resource/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When specified, will return only permissions whose <code>name</code>, <code>description</code> or <code>uri</code> contains the supplied keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When specified, will return the records whose <code>id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "uri",
            "description": "<p>When specified, will return the records whose <code>uri</code> field matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "offset",
            "description": "<p>When specified, will return the records from specified offset in the result set.</p>"
          },
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "limit",
            "description": "<p>This parameter no.of records to be returned.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n    \"id\": \"xxx-xxx-xxxx-xxxx-xx\",\n    \"uri\": \"object/record\",\n    \"name\": \"Records\",\n    \"description\": \"A generic concept represents all types of records. Any other derived record types (e.g. datasets) can be considered as generic records with certian aspect data attached. Grant permissions to this resources will allow a user to access any specialized type records (e.g. dataset)\",\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createResourceApiRouter.ts",
    "groupTitle": "Auth_Resources",
    "name": "GetV0AuthResources"
  },
  {
    "group": "Auth_Resources",
    "type": "get",
    "url": "/v0/auth/resources/byUri/*",
    "title": "Get a resource record by URI",
    "description": "<p>Get a resource record by URI Required <code>authObject/resource/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "resUri",
            "description": "<p>the resource uri can be specified at the end of the URI path. e.g. <code>/v0/auth/resources/byUri/object/record</code></p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"id\": \"xxx-xxx-xxxx-xxxx-xx\",\n    \"uri\": \"object/record\",\n    \"name\": \"Records\",\n    \"description\": \"A generic concept represents all types of records. \"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createResourceApiRouter.ts",
    "groupTitle": "Auth_Resources",
    "name": "GetV0AuthResourcesByuri"
  },
  {
    "group": "Auth_Resources",
    "type": "get",
    "url": "/v0/auth/resources/:id",
    "title": "Get a resource record by ID",
    "description": "<p>Get a resource record by ID Required <code>authObject/resource/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>the resource id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"id\": \"xxx-xxx-xxxx-xxxx-xx\",\n    \"uri\": \"object/record\",\n    \"name\": \"Records\",\n    \"description\": \"A generic concept represents all types of records. \"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createResourceApiRouter.ts",
    "groupTitle": "Auth_Resources",
    "name": "GetV0AuthResourcesId"
  },
  {
    "group": "Auth_Resources",
    "type": "post",
    "url": "/v0/auth/resources",
    "title": "Create a new resource record.",
    "description": "<p>Create a new resource record. Returns the newly created resource record. Required <code>authObject/resource/create</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n   \"uri\": \"object/record\",\n   \"name\": \"Records\",\n   \"description\": \"test description\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"uri\": \"object/record\",\n   \"name\": \"Records\",\n   \"description\": \"test description\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createResourceApiRouter.ts",
    "groupTitle": "Auth_Resources",
    "name": "PostV0AuthResources"
  },
  {
    "group": "Auth_Resources",
    "type": "put",
    "url": "/v0/auth/resources/:id",
    "title": "Update a resource record",
    "description": "<p>Update a resource record Supply a JSON object that contains fields to be updated in body. You need have <code>authObject/resource/update</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>id of the resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": " {\n    \"uri\": \"object/record\",\n    \"name\": \"Records\",\n    \"description\": \"test description\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"uri\": \"object/record\",\n   \"name\": \"Records\",\n   \"description\": \"test description\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createResourceApiRouter.ts",
    "groupTitle": "Auth_Resources",
    "name": "PutV0AuthResourcesId"
  },
  {
    "group": "Auth_Roles",
    "type": "delete",
    "url": "/v0/auth/roles/:roleId",
    "title": "Delete a role record",
    "description": "<p>Delete a role record and any permission (not owned by other roles) belongs to it. You need <code>authObject/role/delete</code> permission in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Response Body": [
          {
            "group": "Response Body",
            "type": "boolean",
            "optional": false,
            "field": "result",
            "description": "<p>Indicates whether the deletion action is actually performed or the permission record doesn't exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"result\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Roles",
    "name": "DeleteV0AuthRolesRoleid"
  },
  {
    "group": "Auth_Roles",
    "type": "delete",
    "url": "/v0/auth/users/:userId/roles",
    "title": "Remove a list roles from a user",
    "description": "<p>Returns the JSON response indicates the operation has been done successfully or not You need have update permission to the user record in order to access this API.</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    isError: false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Roles",
    "name": "DeleteV0AuthUsersUseridRoles"
  },
  {
    "group": "Auth_Roles",
    "type": "get",
    "url": "/v0/auth/roles",
    "title": "Get role records meet selection criteria",
    "description": "<p>return role records meet selection criteria Required <code>authObject/role/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When specified, will return only role records whose <code>name</code> or <code>description</code> contains the supplied keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When specified, will return the records whose <code>id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "owner_id",
            "description": "<p>When specified, will return the records whose <code>owner_id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "create_by",
            "description": "<p>When specified, will return the records whose <code>create_by</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "edit_by",
            "description": "<p>When specified, will return the records whose <code>edit_by</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "user_id",
            "description": "<p>When specified, will return the records whose <code>user_id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "offset",
            "description": "<p>When specified, will return the records from specified offset in the result set.</p>"
          },
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "limit",
            "description": "<p>This parameter no.of records to be returned.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n    id: \"xxx-xxx-xxxx-xxxx-xx\",\n    name: \"test role\",\n    description: \"this is a dummy role\",\n    owner_id: \"xxx-xxx-xxxx-xx\",\n    create_by: \"xxx-xxx-xxxx-xx\",\n    create_time: \"2019-04-04 04:20:54.376504+00\",\n    edit_by: \"xxx-xxx-xxxx-xx\",\n    edit_time: \"2019-04-04 04:20:54.376504+00\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Roles",
    "name": "GetV0AuthRoles"
  },
  {
    "group": "Auth_Roles",
    "type": "get",
    "url": "/v0/auth/roles/count",
    "title": "Get the count of the role records meet selection criteria",
    "description": "<p>return the count of the role records meet selection criteria Required <code>authObject/role/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When specified, will return only role records whose <code>name</code> or <code>description</code> contains the supplied keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When specified, will return the records whose <code>id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "owner_id",
            "description": "<p>When specified, will return the records whose <code>owner_id</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "create_by",
            "description": "<p>When specified, will return the records whose <code>create_by</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "edit_by",
            "description": "<p>When specified, will return the records whose <code>edit_by</code> matches the supplied value.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "user_id",
            "description": "<p>When specified, will return the records whose <code>user_id</code> matches the supplied value.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"count\": 5\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Roles",
    "name": "GetV0AuthRolesCount"
  },
  {
    "group": "Auth_Roles",
    "type": "get",
    "url": "/v0/auth/roles/:roleId",
    "title": "Get a role record by ID",
    "description": "<p>Get a role record by ID Required <code>authObject/role/read</code> permission to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"name\": \"a test role\",\n   \"description\": \"a test role\",\n   \"owner_id\": \"xxx-xxx-xxxx-xx\",\n   \"create_by\": \"xxx-xxx-xxxx-xx\",\n   \"create_time\": \"2019-04-04 04:20:54.376504+00\",\n   \"edit_by\": \"xxx-xxx-xxxx-xx\",\n   \"edit_time\": \"2019-04-04 04:20:54.376504+00\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Roles",
    "name": "GetV0AuthRolesRoleid"
  },
  {
    "group": "Auth_Roles",
    "type": "get",
    "url": "/v0/auth/users/:userId/roles",
    "title": "Get all roles of a user",
    "description": "<p>Returns an array of roles. When no roles can be found, an empty array will be returned You need have read permission to the user record in order to access this API.</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n    id: \"xxx-xxx-xxxx-xxxx-xx\",\n    name: \"Admin Roles\",\n    permissionIds: [\"xxx-xxx-xxx-xxx-xx\", \"xxx-xx-xxx-xx-xxx-xx\"],\n    description?: \"This is an admin role\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Roles",
    "name": "GetV0AuthUsersUseridRoles"
  },
  {
    "group": "Auth_Roles",
    "type": "post",
    "url": "/v0/auth/roles",
    "title": "Create a role record",
    "description": "<p>Create a role record Required <code>authObject/role/create</code> permission to access this API.</p>",
    "parameter": {
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  \"name\": \"a test role\",\n  \"description\": \"a test role\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"name\": \"a test role\",\n   \"description\": \"a test role\",\n   \"owner_id\": \"xxx-xxx-xxxx-xx\",\n   \"create_by\": \"xxx-xxx-xxxx-xx\",\n   \"create_time\": \"2019-04-04 04:20:54.376504+00\",\n   \"edit_by\": \"xxx-xxx-xxxx-xx\",\n   \"edit_time\": \"2019-04-04 04:20:54.376504+00\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Roles",
    "name": "PostV0AuthRoles"
  },
  {
    "group": "Auth_Roles",
    "type": "post",
    "url": "/v0/auth/users/:userId/roles",
    "title": "Add Roles to a user",
    "description": "<p>Returns a list of current role ids of the user. You need have update permission to the user record in order to access this API.</p>",
    "parameter": {
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "[\"xxxx-xxxx-xxx-xxx-xx1\", \"xx-xx-xxx-xxxx-xxx2\"]",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[\"xxxx-xxxx-xxx-xxx-xx1\", \"xx-xx-xxx-xxxx-xxx2\", \"xx-xx-xxx-xxxx-xxx3\"]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Roles",
    "name": "PostV0AuthUsersUseridRoles"
  },
  {
    "group": "Auth_Roles",
    "type": "put",
    "url": "/v0/auth/roles/:roleId",
    "title": "Update a role record",
    "description": "<p>Update a role's permission record Supply a JSON object that contains fields to be updated in body. You need have <code>authObject/role/update</code> permission in order to access this API.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  \"name\": \"a test role\",\n  \"description\": \"a test role\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"id\": \"e30135df-523f-46d8-99f6-2450fd8d6a37\",\n   \"name\": \"a test role\",\n   \"description\": \"a test role\",\n   \"owner_id\": \"xxx-xxx-xxxx-xx\",\n   \"create_by\": \"xxx-xxx-xxxx-xx\",\n   \"create_time\": \"2019-04-04 04:20:54.376504+00\",\n   \"edit_by\": \"xxx-xxx-xxxx-xx\",\n   \"edit_time\": \"2019-04-04 04:20:54.376504+00\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Roles",
    "name": "PutV0AuthRolesRoleid"
  },
  {
    "group": "Auth_Users",
    "type": "delete",
    "url": "/v0/auth/users/:userId",
    "title": "Delete a user record",
    "description": "<p>Delete a user record specified by userId. You need have <code>authObject/user/delete</code> permission in order to access this API. Upon the user record deletion,</p> <ul> <li>any api keys that are created for the user will be removed.</li> <li>any credentials records (if any. e.g. when <a href=\"https://github.com/magda-io/magda-auth-internal\">magda-auth-internal</a> is installed) that are created for the user will be removed.</li> <li>any user role association records will be removed, although the role records themselves will not be removed.</li> <li>owner, editor, creator user id of role, permission &amp; orgUnit records will be set to NULL If you want to implement custom user deletion logic, you should implement it in one of your custom <a href=\"https://github.com/magda-io/magda/blob/main/docs/docs/authentication-plugin-spec.md\">Magda auth plugins</a>. This API will response 200 status when no user is required to be deleted.</li> </ul>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>id of user</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    isError: false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "DeleteV0AuthUsersUserid"
  },
  {
    "group": "Auth_Users",
    "type": "get",
    "url": "/private/users/lookup",
    "title": "Lookup User",
    "description": "<p>Lookup user by <code>source</code> &amp; <code>sourceId</code>. require unconditional <code>authObject/user/read</code> permission to access.</p>",
    "deprecated": {
      "content": "use now (#Auth_Users:GetV0AuthUsers). This api is only available within cluster (i.e. it's not available via gateway). This route is deprecated as we have public facing API with fine-gained access control."
    },
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": false,
            "field": "source",
            "description": "<p>The source string of user record to be fetched</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": false,
            "field": "sourceId",
            "description": "<p>The sourceId of user record to be fetched</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"id\":\"...\",\n    \"displayName\":\"Fred Nerk\",\n    \"photoURL\":\"...\",\n    \"OrgUnitId\": \"xxx\"\n    ...\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/createApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "GetPrivateUsersLookup"
  },
  {
    "group": "Auth_Users",
    "type": "get",
    "url": "/private/users/:userId",
    "title": "Get User by Id (Private)",
    "description": "<p>Get user record by user id. This api is only available within cluster (i.e. it's not available via gateway). require unconditional <code>authObject/user/read</code> permission to access.</p>",
    "deprecated": {
      "content": "use now (#Auth_Users:GetV0AuthUsersUserid). This route is deprecated as we have public facing API with fine-gained access control."
    },
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>the id of the user</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"id\":\"...\",\n    \"displayName\":\"Fred Nerk\",\n    \"photoURL\":\"...\",\n    \"OrgUnitId\": \"xxx\"\n    ...\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/createApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "GetPrivateUsersUserid"
  },
  {
    "group": "Auth_Users",
    "type": "get",
    "url": "/v0/auth/roles/:roleId/users",
    "title": "Get all matched users with a role",
    "description": "<p>return a list matched users who have a certain role Required <code>authObject/user/read</code> permission to access this API. If you don't have access to any users, empty array will be returned.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          }
        ],
        "Query String": [
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "offset",
            "description": "<p>The index of the first record in the result set to retrieve.</p>"
          },
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "limit",
            "description": "<p>The maximum number of records of the result set to receive. If not present, a default value of 500 will be used.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When set, will only return user records whose &quot;displayName&quot;, &quot;email&quot; or &quot;source&quot; field contains the specified keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When set, will only return records whose id is the specified ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "source",
            "description": "<p>When set, will only return records whose source is the specified source name.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "sourceId",
            "description": "<p>When set, will only return records whose sourceId is the specified source ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "orgUnitId",
            "description": "<p>When set, will only return records whose orgUnitId is the specified org unit id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n    \"id\":\"...\",\n    \"displayName\":\"Fred Nerk\",\n    \"email\":\"fred.nerk@data61.csiro.au\",\n    \"photoURL\":\"...\",\n    \"source\":\"google\",\n    \"orgUnitId\": \"...\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "GetV0AuthRolesRoleidUsers"
  },
  {
    "group": "Auth_Users",
    "type": "get",
    "url": "/v0/auth/roles/:roleId/users/count",
    "title": "Get the count of all matched users with a role",
    "description": "<p>return the count number of all matched users who have a certain role Required <code>authObject/user/read</code> permission to access this API. If you don't have access to any users, 0 count will be returned.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "roleId",
            "description": "<p>id of the role</p>"
          }
        ],
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When set, will only return user records whose &quot;displayName&quot;, &quot;email&quot; or &quot;source&quot; field contains the specified keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When set, will only return records whose id is the specified ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "source",
            "description": "<p>When set, will only return records whose source is the specified source name.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "sourceId",
            "description": "<p>When set, will only return records whose sourceId is the specified source ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "orgUnitId",
            "description": "<p>When set, will only return records whose orgUnitId is the specified org unit id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"count\" : 5\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createRoleApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "GetV0AuthRolesRoleidUsersCount"
  },
  {
    "group": "Auth_Users",
    "type": "get",
    "url": "/v0/auth/users",
    "title": "Get users",
    "description": "<p>Returns a list users that meet query parameters and the current user is allowed to access.</p>",
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "offset",
            "description": "<p>The index of the first record in the result set to retrieve.</p>"
          },
          {
            "group": "Query String",
            "type": "number",
            "optional": true,
            "field": "limit",
            "description": "<p>The maximum number of records of the result set to receive. If not present, a default value of 500 will be used.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When set, will only return user records whose &quot;displayName&quot;, &quot;email&quot; or &quot;source&quot; field contains the specified keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When set, will only return records whose id is the specified ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "source",
            "description": "<p>When set, will only return records whose source is the specified source name.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "sourceId",
            "description": "<p>When set, will only return records whose sourceId is the specified source ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "orgUnitId",
            "description": "<p>When set, will only return records whose orgUnitId is the specified org unit id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n    \"id\":\"...\",\n    \"displayName\":\"Fred Nerk\",\n    \"email\":\"fred.nerk@data61.csiro.au\",\n    \"photoURL\":\"...\",\n    \"source\":\"google\",\n    \"orgUnitId\": \"...\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "GetV0AuthUsers"
  },
  {
    "group": "Auth_Users",
    "type": "get",
    "url": "/v0/auth/users/all",
    "title": "Get all users",
    "description": "<p>Returns all users.</p>",
    "deprecated": {
      "content": "Legacy API to be deprecated. You should use (#Auth_Users:GetV0AuthUsers) or (#Auth_Users:GetV0AuthUsersCount) instead as they support pagination."
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n    \"id\":\"...\",\n    \"displayName\":\"Fred Nerk\",\n    \"email\":\"fred.nerk@data61.csiro.au\",\n    \"photoURL\":\"...\",\n    \"source\":\"google\",\n    \"roles\": [{\n      id\": \"...\",\n      name: \"Authenticated Users\",\n      permissionIds: [\"e5ce2fc4-9f38-4f52-8190-b770ed2074e\", \"a4a34ab4-67be-4806-a8de-f7e3c5d452f0\"]\n    }]\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "GetV0AuthUsersAll"
  },
  {
    "group": "Auth_Users",
    "type": "get",
    "url": "/v0/auth/users/count",
    "title": "Get user records count",
    "description": "<p>Returns the count of users that meet query parameters and the current user is allowed to access. This API offers the similar functionality as <code>/v0/auth/users</code> API, except only return the records count number.</p>",
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "keyword",
            "description": "<p>When set, will only return user records whose &quot;displayName&quot;, &quot;email&quot; or &quot;source&quot; field contains the specified keyword.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "id",
            "description": "<p>When set, will only return records whose id is the specified ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "source",
            "description": "<p>When set, will only return records whose source is the specified source name.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "sourceId",
            "description": "<p>When set, will only return records whose sourceId is the specified source ID.</p>"
          },
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "orgUnitId",
            "description": "<p>When set, will only return records whose orgUnitId is the specified org unit id.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"count\": 3\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "GetV0AuthUsersCount"
  },
  {
    "group": "Auth_Users",
    "type": "get",
    "url": "/v0/auth/users/:userId",
    "title": "Get User By Id",
    "description": "<p>Returns user by id. Unlike <code>whoami</code> API endpoint, this API requires <code>authObject/user/read</code> permission.</p>",
    "parameter": {
      "fields": {
        "URL Path": [
          {
            "group": "URL Path",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>id of user</p>"
          }
        ],
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "allowCache",
            "description": "<p>By default, this API will respond with certain headers to disable any client side cache behaviour. You can opt to supply a string value <code>true</code> for this parameter to stop sending those headers.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"id\":\"...\",\n    \"displayName\":\"Fred Nerk\",\n    \"photoURL\":\"...\",\n    \"OrgUnitId\": \"xxx\"\n    ...\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "GetV0AuthUsersUserid"
  },
  {
    "group": "Auth_Users",
    "type": "get",
    "url": "/v0/auth/users/whoami",
    "title": "Get Current User Info (whoami)",
    "description": "<p>Returns the user info of the current user. If the user has not logged in yet, the user will be considered as an anonymous user.</p>",
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "string",
            "optional": true,
            "field": "allowCache",
            "description": "<p>By default, this API will respond with certain headers to disable any client side cache behaviour. You can opt to supply a string value <code>true</code> for this parameter to stop sending those headers.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"id\":\"...\",\n    \"displayName\":\"Fred Nerk\",\n    \"email\":\"fred.nerk@data61.csiro.au\",\n    \"photoURL\":\"...\",\n    \"source\":\"google\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "GetV0AuthUsersWhoami"
  },
  {
    "group": "Auth_Users",
    "type": "post",
    "url": "/private/users",
    "title": "Create a new user (private)",
    "description": "<p>Create a new user record. Supply a JSON object that contains fields of the new user in body. This api is only available within cluster (i.e. it's not available via gateway). require unconditional <code>authObject/user/create</code> permission to access.</p>",
    "deprecated": {
      "content": "use now (#Auth_Users:PostV0AuthUsers). This route is deprecated as we have public facing API with fine-gained access control."
    },
    "parameter": {
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  displayName: \"xxxx\",\n  email: \"sdds@sds.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  id: \"2a92d9e7-9fb8-4fe4-a2d1-13b6bcf1776d\",\n  displayName: \"xxxx\",\n  email: \"sdds@sds.com\",\n  //....\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/createApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "PostPrivateUsers"
  },
  {
    "group": "Auth_Users",
    "type": "post",
    "url": "/v0/auth/users",
    "title": "Create a new user",
    "description": "<p>Create a new user Supply a JSON object that contains fields of the new user in body.</p>",
    "parameter": {
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  displayName: \"xxxx\",\n  email: \"sdds@sds.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  id: \"2a92d9e7-9fb8-4fe4-a2d1-13b6bcf1776d\",\n  displayName: \"xxxx\",\n  email: \"sdds@sds.com\",\n  //....\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "PostV0AuthUsers"
  },
  {
    "group": "Auth_Users",
    "type": "put",
    "url": "/v0/auth/users/:userId",
    "title": "Update User By Id",
    "description": "<p>Updates a user's info by Id. Supply a JSON object that contains fields to be updated in body.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>id of user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  displayName: \"xxxx\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  id: \"2a92d9e7-9fb8-4fe4-a2d1-13b6bcf1776d\",\n  displayName: \"xxxx\",\n  email: \"sdds@sds.com\",\n  //....\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/404/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 404, 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-authorization-api/src/apiRouters/createUserApiRouter.ts",
    "groupTitle": "Auth_Users",
    "name": "PutV0AuthUsersUserid"
  },
  {
    "group": "Authentication_API",
    "type": "get",
    "url": "https://<host>/auth/logout",
    "title": "Explicitly logout current user session",
    "description": "<p>Returns result of logout action. This endpoint implements the behaviour that is described in <a href=\"https://github.com/magda-io/magda/blob/master/docs/docs/authentication-plugin-spec.md#get-logout-endpoint-optional\">this doc</a> in order to support auth plugin logout process. When the <code>redirect</code> query parameter does not present, this middleware should be compatible with the behaviour prior to version 0.0.60. i.e.:</p> <ul> <li>Turn off Magda session only without forwarding any requests to auth plugins</li> <li>Response a JSON response (that indicates the outcome of the logout action) instead of redirect users. This endpoint is only available when gateway <code>enableAuthEndpoint</code>=true</li> </ul>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"isError\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "500",
          "content": "{\n    \"isError\": true,\n    \"errorCode\": 500,\n    \"errorMessage\": \"xxxxxx\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-gateway/src/createAuthRouter.ts",
    "groupTitle": "Authentication_API",
    "name": "GetHttpsHostAuthLogout"
  },
  {
    "group": "Authentication_API",
    "type": "get",
    "url": "https://<host>/auth/plugins",
    "title": "Get the list of available authentication plugins",
    "description": "<p>Returns all installed authentication plugins. This endpoint is only available when gateway <code>enableAuthEndpoint</code>=true</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n    \"key\":\"google\",\n    \"name\":\"Google\",\n    \"iconUrl\":\"http://xxx/sds/sds.jpg\",\n    \"authenticationMethod\": \"IDP-URI-REDIRECTION\"\n}]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-gateway/src/createAuthRouter.ts",
    "groupTitle": "Authentication_API",
    "name": "GetHttpsHostAuthPlugins"
  },
  {
    "group": "Connectors",
    "type": "delete",
    "url": "/v0/admin/connectors/:id",
    "title": "Delete the connector by ID",
    "description": "<p>Delete the connector by ID Require permission of <code>object/connector/delete</code> to access this API. Please note: you cannot delete a connector if it's deployed &amp; managed as part of Helm Charts.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Connector ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "response body": [
          {
            "group": "response body",
            "type": "boolean",
            "optional": false,
            "field": "result",
            "description": "<p>Indicate whether the deletion action is taken or the connector doesn't exist.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-admin-api/src/buildApiRouter.ts",
    "groupTitle": "Connectors",
    "name": "DeleteV0AdminConnectorsId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Connectors",
    "type": "get",
    "url": "/v0/admin/connectors",
    "title": "Get the list of all connectors",
    "description": "<p>Get the list of all connectors. Require permission of <code>object/connector/read</code> to access this API</p>",
    "success": {
      "fields": {
        "response body": [
          {
            "group": "response body",
            "type": "Connector[]",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>a list of connectors. For all available fields of each connector item, please check API <code>{get} /v0/admin/connectors/:id</code>.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-admin-api/src/buildApiRouter.ts",
    "groupTitle": "Connectors",
    "name": "GetV0AdminConnectors",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Connectors",
    "type": "get",
    "url": "/v0/admin/connectors/:id",
    "title": "Get the connector by ID",
    "description": "<p>Get the connector detailed information by ID Require permission of <code>object/connector/read</code> to access this API</p>",
    "success": {
      "fields": {
        "response body": [
          {
            "group": "response body",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Connector ID</p>"
          },
          {
            "group": "response body",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Connector name</p>"
          },
          {
            "group": "response body",
            "type": "string",
            "optional": false,
            "field": "sourceUrl",
            "description": "<p>Connector sourceUrl</p>"
          },
          {
            "group": "response body",
            "type": "number",
            "optional": true,
            "field": "pageSize",
            "description": "<p>Connector pageSize</p>"
          },
          {
            "group": "response body",
            "type": "string",
            "optional": false,
            "field": "schedule",
            "description": "<p>Connector schedule string in crontab format and in UTC timezone.</p>"
          },
          {
            "group": "response body",
            "type": "string[]",
            "optional": true,
            "field": "ignoreHarvestSources",
            "description": "<p>Make connector to ignore datasets from certain sources. Not all connector types &amp; sources support this setting.</p>"
          },
          {
            "group": "response body",
            "type": "string[]",
            "optional": true,
            "field": "allowedOrganisationNames",
            "description": "<p>Make connector to ignore datasets from certain organisations. Not all connector types &amp; sources support this setting.</p>"
          },
          {
            "group": "response body",
            "type": "string[]",
            "optional": true,
            "field": "ignoreOrganisationNames",
            "description": "<p>Make connector to ignore datasets from certain organisations. Not all connector types &amp; sources support this setting.</p>"
          },
          {
            "group": "response body",
            "type": "object",
            "optional": true,
            "field": "extras",
            "description": "<p>Some predefined extra data to be attached to the <code>source</code> aspect of all harvested dataset.</p>"
          },
          {
            "group": "response body",
            "type": "object",
            "optional": true,
            "field": "presetRecordAspects",
            "description": "<p>the config setting that makes connector write predefined data to selected record type's selected aspect.</p>"
          },
          {
            "group": "response body",
            "type": "string",
            "optional": true,
            "field": "presetRecordAspects.id",
            "description": "<p>the ID of the aspect where the predefined data written to.</p>"
          },
          {
            "group": "response body",
            "type": "string",
            "optional": true,
            "field": "presetRecordAspects.recordType",
            "description": "<p>the record type where the predefined data written to. Possible value: &quot;Organization&quot; | &quot;Dataset&quot; | &quot;Distribution&quot;;</p>"
          },
          {
            "group": "response body",
            "type": "string",
            "optional": true,
            "field": "presetRecordAspects.opType",
            "description": "<p>operation type; Describe how to add the aspect to the record</p> <ul> <li>MERGE_LEFT: merge <code>presetAspect</code> with records aspects. i.e. <code>presetAspect</code> will be overwritten by records aspects data if any</li> <li>MEREG_RIGHT: merge records aspects with <code>presetAspect</code>. i.e. records aspects data (if any) will be overwritten by <code>presetAspect</code></li> <li>REPLACE: <code>presetAspect</code> will replace any existing records aspect</li> <li>FILL: <code>presetAspect</code> will be added if no existing aspect Default value (If not specified) will be <code>MERGE_LEFT</code></li> </ul>"
          },
          {
            "group": "response body",
            "type": "object",
            "optional": true,
            "field": "presetRecordAspects.data",
            "description": "<p>The extra aspect data to be applied to the selected aspect of selected records.</p>"
          },
          {
            "group": "response body",
            "type": "object",
            "optional": false,
            "field": "cronJob",
            "description": "<p>Details of the cronJob object created for the connector in <a href=\"https://github.com/kubernetes-client/javascript/blob/2b6813f99a85605f691973d6bc43f291ac072fc7/src/gen/model/v1CronJob.ts#L21\">v1CronJob</a> structure.</p>"
          },
          {
            "group": "response body",
            "type": "boolean",
            "optional": false,
            "field": "suspend",
            "description": "<p>Whether the cronjob has been suspended.</p>"
          },
          {
            "group": "response body",
            "type": "object",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the cronjob</p>"
          },
          {
            "group": "response body",
            "type": "object",
            "optional": true,
            "field": "status.lastScheduleTime",
            "description": "<p>The last schedule time</p>"
          },
          {
            "group": "response body",
            "type": "object",
            "optional": true,
            "field": "status.lastSuccessfulTime",
            "description": "<p>The last successful job run time</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-admin-api/src/buildApiRouter.ts",
    "groupTitle": "Connectors",
    "name": "GetV0AdminConnectorsId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Connectors",
    "type": "post",
    "url": "/v0/admin/connectors",
    "title": "Create a new connector",
    "description": "<p>Create a new connector Require permission of <code>object/connector/create</code> to access this API.</p>",
    "parameter": {
      "fields": {
        "request body": [
          {
            "group": "request body",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Connector ID</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": false,
            "field": "dockerImageString",
            "description": "<p>the full docker image string of the connector including docker repository, image name &amp; tag. e.g. <code>ghcr.io/magda-io/magda-ckan-connector:2.1.0</code> When <code>dockerImageString</code> is provided, <code>dockerImageName</code> field will not be used.</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": false,
            "field": "dockerImageName",
            "description": "<p>The docker image name of the connector. e.g. <code>magda-ckan-connector</code>. System will pull docker image from configured docker repository &amp; image tag (configurable via magda-admin-api helm chart). <code>dockerImageName</code> will only be used when <code>dockerImageString</code> is not supplied.</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>Connector name</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "sourceUrl",
            "description": "<p>Connector sourceUrl</p>"
          },
          {
            "group": "request body",
            "type": "number",
            "optional": true,
            "field": "pageSize",
            "description": "<p>Connector pageSize</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "schedule",
            "description": "<p>Connector schedule string in crontab format and in UTC timezone.</p>"
          },
          {
            "group": "request body",
            "type": "string[]",
            "optional": true,
            "field": "ignoreHarvestSources",
            "description": "<p>Make connector to ignore datasets from certain sources. Not all connector types &amp; sources support this setting.</p>"
          },
          {
            "group": "request body",
            "type": "string[]",
            "optional": true,
            "field": "allowedOrganisationNames",
            "description": "<p>Make connector to ignore datasets from certain organisations. Not all connector types &amp; sources support this setting.</p>"
          },
          {
            "group": "request body",
            "type": "string[]",
            "optional": true,
            "field": "ignoreOrganisationNames",
            "description": "<p>Make connector to ignore datasets from certain organisations. Not all connector types &amp; sources support this setting.</p>"
          },
          {
            "group": "request body",
            "type": "object",
            "optional": true,
            "field": "extras",
            "description": "<p>Some predefined extra data to be attached to the <code>source</code> aspect of all harvested dataset.</p>"
          },
          {
            "group": "request body",
            "type": "object",
            "optional": true,
            "field": "presetRecordAspects",
            "description": "<p>the config setting that makes connector write predefined data to selected record type's selected aspect.</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "presetRecordAspects.id",
            "description": "<p>the ID of the aspect where the predefined data written to.</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "presetRecordAspects.recordType",
            "description": "<p>the record type where the predefined data written to. Possible value: &quot;Organization&quot; | &quot;Dataset&quot; | &quot;Distribution&quot;;</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "presetRecordAspects.opType",
            "description": "<p>operation type; Describe how to add the aspect to the record</p> <ul> <li>MERGE_LEFT: merge <code>presetAspect</code> with records aspects. i.e. <code>presetAspect</code> will be overwritten by records aspects data if any</li> <li>MEREG_RIGHT: merge records aspects with <code>presetAspect</code>. i.e. records aspects data (if any) will be overwritten by <code>presetAspect</code></li> <li>REPLACE: <code>presetAspect</code> will replace any existing records aspect</li> <li>FILL: <code>presetAspect</code> will be added if no existing aspect Default value (If not specified) will be <code>MERGE_LEFT</code></li> </ul>"
          },
          {
            "group": "request body",
            "type": "object",
            "optional": true,
            "field": "presetRecordAspects.data",
            "description": "<p>The extra aspect data to be applied to the selected aspect of selected records.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "response body": [
          {
            "group": "response body",
            "type": "Connector",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Information of the created connector. For all available fields of the connector, please check API <code>{get} /v0/admin/connectors/:id</code>.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-admin-api/src/buildApiRouter.ts",
    "groupTitle": "Connectors",
    "name": "PostV0AdminConnectors",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Connectors",
    "type": "post",
    "url": "/v0/admin/connectors/:id/start",
    "title": "Start the connector by ID",
    "description": "<p>Start the connector by ID Require permission of <code>object/connector/update</code> to access this API. The API will set the <code>suspend</code> field of the connector cronjob to <code>false</code>.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Connector ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "response body": [
          {
            "group": "response body",
            "type": "boolean",
            "optional": false,
            "field": "result",
            "description": "<p>will always be <code>true</code>.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-admin-api/src/buildApiRouter.ts",
    "groupTitle": "Connectors",
    "name": "PostV0AdminConnectorsIdStart",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Connectors",
    "type": "post",
    "url": "/v0/admin/connectors/:id/stop",
    "title": "Stop the connector by ID",
    "description": "<p>Stop the connector by ID Require permission of <code>object/connector/update</code> to access this API. The API will set the <code>suspend</code> field of the connector cronjob to <code>true</code>.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Connector ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "response body": [
          {
            "group": "response body",
            "type": "boolean",
            "optional": false,
            "field": "result",
            "description": "<p>will always be <code>true</code>.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-admin-api/src/buildApiRouter.ts",
    "groupTitle": "Connectors",
    "name": "PostV0AdminConnectorsIdStop",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Connectors",
    "type": "put",
    "url": "/v0/admin/connectors/:id",
    "title": "Update the connector by ID",
    "description": "<p>Update the connector by ID Require permission of <code>object/connector/update</code> to access this API. Please note: you cannot update a connector if it's deployed &amp; managed as part of Helm Charts.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Connector ID</p>"
          }
        ],
        "request body": [
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>Connector name</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "sourceUrl",
            "description": "<p>Connector sourceUrl</p>"
          },
          {
            "group": "request body",
            "type": "number",
            "optional": true,
            "field": "pageSize",
            "description": "<p>Connector pageSize</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "schedule",
            "description": "<p>Connector schedule string in crontab format and in UTC timezone.</p>"
          },
          {
            "group": "request body",
            "type": "string[]",
            "optional": true,
            "field": "ignoreHarvestSources",
            "description": "<p>Make connector to ignore datasets from certain sources. Not all connector types &amp; sources support this setting.</p>"
          },
          {
            "group": "request body",
            "type": "string[]",
            "optional": true,
            "field": "allowedOrganisationNames",
            "description": "<p>Make connector to ignore datasets from certain organisations. Not all connector types &amp; sources support this setting.</p>"
          },
          {
            "group": "request body",
            "type": "string[]",
            "optional": true,
            "field": "ignoreOrganisationNames",
            "description": "<p>Make connector to ignore datasets from certain organisations. Not all connector types &amp; sources support this setting.</p>"
          },
          {
            "group": "request body",
            "type": "object",
            "optional": true,
            "field": "extras",
            "description": "<p>Some predefined extra data to be attached to the <code>source</code> aspect of all harvested dataset.</p>"
          },
          {
            "group": "request body",
            "type": "object",
            "optional": true,
            "field": "presetRecordAspects",
            "description": "<p>the config setting that makes connector write predefined data to selected record type's selected aspect.</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "presetRecordAspects.id",
            "description": "<p>the ID of the aspect where the predefined data written to.</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "presetRecordAspects.recordType",
            "description": "<p>the record type where the predefined data written to. Possible value: &quot;Organization&quot; | &quot;Dataset&quot; | &quot;Distribution&quot;;</p>"
          },
          {
            "group": "request body",
            "type": "string",
            "optional": true,
            "field": "presetRecordAspects.opType",
            "description": "<p>operation type; Describe how to add the aspect to the record</p> <ul> <li>MERGE_LEFT: merge <code>presetAspect</code> with records aspects. i.e. <code>presetAspect</code> will be overwritten by records aspects data if any</li> <li>MEREG_RIGHT: merge records aspects with <code>presetAspect</code>. i.e. records aspects data (if any) will be overwritten by <code>presetAspect</code></li> <li>REPLACE: <code>presetAspect</code> will replace any existing records aspect</li> <li>FILL: <code>presetAspect</code> will be added if no existing aspect Default value (If not specified) will be <code>MERGE_LEFT</code></li> </ul>"
          },
          {
            "group": "request body",
            "type": "object",
            "optional": true,
            "field": "presetRecordAspects.data",
            "description": "<p>The extra aspect data to be applied to the selected aspect of selected records.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "response body": [
          {
            "group": "response body",
            "type": "Connector",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Information of the updated connector. For all available fields of the connector, please check API <code>{get} /v0/admin/connectors/:id</code>.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-admin-api/src/buildApiRouter.ts",
    "groupTitle": "Connectors",
    "name": "PutV0AdminConnectorsId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Content",
    "type": "delete",
    "url": "/v0/content/:contentId",
    "title": "Delete Content",
    "description": "<p>Delete content by content id. Must be an admin. Only available for contents with wildcard ids.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "contentId",
            "description": "<p>id of content item</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n     \"result\": \"SUCCESS\"\n}",
          "type": "any"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-content-api/src/createApiRouter.ts",
    "groupTitle": "Content API",
    "groupDescription": "<p>Contents are dynamically configurable assets which are persisted in a database. They are intended to support the magda UI/client. They are identified by a string content id (e.g. &quot;logo&quot;). They are all encoded as text prior to storage in database and are decoded prior to serving.</p> <p>The following content items (ids) are currently present:</p> <ul> <li>&quot;logo&quot; - site logo - a png, gif, jpeg, webp or svg image - encoded as base64.</li> <li>&quot;logo-mobile&quot; - site logo - a png, gif, jpeg, webp or svg image - encoded as base64.</li> <li>&quot;stylesheet&quot; - site css style</li> <li>&quot;csv-*&quot; - data csvs</li> </ul>",
    "name": "DeleteV0ContentContentid"
  },
  {
    "group": "Content",
    "type": "get",
    "url": "/v0/content/:contentId",
    "title": "Get Content",
    "description": "<p>Returns content by content id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "contentId",
            "description": "<p>id of content item You can opt to supply optional extension name for the content you request. The extension name will be used to override the default output form of the content, if a proper mime type can be located for the extension name. e.g. suppose we have a content id: <code>header/logo</code> If we request <code>{get} /v0/content/header/logo</code> (without extension), the api will respond in binary as it's an image. If we request <code>{get} /v0/content/header/logo.txt</code>, the api will respond in based64 text.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "Content in format requested",
          "type": "any"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "string",
            "optional": false,
            "field": "result",
            "defaultValue": "FAILED",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "404",
          "content": "{\n     \"result\": \"FAILED\"\n}",
          "type": "json"
        },
        {
          "title": "500",
          "content": "{\n     \"result\": \"FAILED\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-content-api/src/createApiRouter.ts",
    "groupTitle": "Content API",
    "groupDescription": "<p>Contents are dynamically configurable assets which are persisted in a database. They are intended to support the magda UI/client. They are identified by a string content id (e.g. &quot;logo&quot;). They are all encoded as text prior to storage in database and are decoded prior to serving.</p> <p>The following content items (ids) are currently present:</p> <ul> <li>&quot;logo&quot; - site logo - a png, gif, jpeg, webp or svg image - encoded as base64.</li> <li>&quot;logo-mobile&quot; - site logo - a png, gif, jpeg, webp or svg image - encoded as base64.</li> <li>&quot;stylesheet&quot; - site css style</li> <li>&quot;csv-*&quot; - data csvs</li> </ul>",
    "name": "GetV0ContentContentid"
  },
  {
    "group": "Content",
    "type": "post",
    "url": "/v0/content/all",
    "title": "Get All",
    "description": "<p>Get a list of content items and their type.</p>",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>filter content id by this wildcard pattern. For example: &quot;id=header/<em>&amp;id=footer/</em>&quot;. Can specify multiple.</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": false,
            "field": "type",
            "description": "<p>filter content mime type by this wildcard pattern. For example: &quot;type=application/*&quot;. Can specify multiple.</p>"
          },
          {
            "group": "Query",
            "type": "boolean",
            "optional": false,
            "field": "inline",
            "description": "<p>flag to specify if content should be inlined. Only application/json mime type content is supported now.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "result",
            "defaultValue": "SUCCESS",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "[\n    {\n        \"id\": ...\n        \"type\": ...\n        \"length\": ...\n        \"content\": ...\n    },\n    ...\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-content-api/src/createApiRouter.ts",
    "groupTitle": "Content API",
    "groupDescription": "<p>Contents are dynamically configurable assets which are persisted in a database. They are intended to support the magda UI/client. They are identified by a string content id (e.g. &quot;logo&quot;). They are all encoded as text prior to storage in database and are decoded prior to serving.</p> <p>The following content items (ids) are currently present:</p> <ul> <li>&quot;logo&quot; - site logo - a png, gif, jpeg, webp or svg image - encoded as base64.</li> <li>&quot;logo-mobile&quot; - site logo - a png, gif, jpeg, webp or svg image - encoded as base64.</li> <li>&quot;stylesheet&quot; - site css style</li> <li>&quot;csv-*&quot; - data csvs</li> </ul>",
    "name": "PostV0ContentAll"
  },
  {
    "group": "Content",
    "type": "put",
    "url": "/v0/content/:contentId",
    "title": "Update Content",
    "description": "<p>Update content by id</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "contentId",
            "description": "<p>id of content item</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "defaultValue": "text/plain",
            "description": "<p>mime type of posted content.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "result",
            "defaultValue": "SUCCESS",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n     \"result\": \"SUCCESS\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "string",
            "optional": false,
            "field": "result",
            "defaultValue": "FAILED",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "400",
          "content": "{\n     \"result\": \"FAILED\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-content-api/src/createApiRouter.ts",
    "groupTitle": "Content API",
    "groupDescription": "<p>Contents are dynamically configurable assets which are persisted in a database. They are intended to support the magda UI/client. They are identified by a string content id (e.g. &quot;logo&quot;). They are all encoded as text prior to storage in database and are decoded prior to serving.</p> <p>The following content items (ids) are currently present:</p> <ul> <li>&quot;logo&quot; - site logo - a png, gif, jpeg, webp or svg image - encoded as base64.</li> <li>&quot;logo-mobile&quot; - site logo - a png, gif, jpeg, webp or svg image - encoded as base64.</li> <li>&quot;stylesheet&quot; - site css style</li> <li>&quot;csv-*&quot; - data csvs</li> </ul>",
    "name": "PutV0ContentContentid"
  },
  {
    "group": "Correspondence_API",
    "type": "post",
    "url": "/v0/correspondence/send/dataset/:datasetId/question",
    "title": "Send a question about a dataest",
    "description": "<p>Sends a question about a dataset to the data custodian if available, and to the administrators if not</p>",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "string",
            "optional": false,
            "field": "senderName",
            "description": "<p>The name of the sender</p>"
          },
          {
            "group": "Request body",
            "type": "string",
            "optional": false,
            "field": "senderEmail",
            "description": "<p>The email address of the sender</p>"
          },
          {
            "group": "Request body",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>The message to send</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>OK</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n     \"status\": \"OK\",\n     \"recipient\": \"xx@xx.com\",\n     \"sentToDefaultRecipient\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>FAILED</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "400",
          "content": "{\n     \"status\": \"Failed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-correspondence-api/src/createApiRouter.ts",
    "groupTitle": "Correspondence_API",
    "name": "PostV0CorrespondenceSendDatasetDatasetidQuestion"
  },
  {
    "group": "Correspondence_API",
    "type": "post",
    "url": "/v0/correspondence/send/dataset/request",
    "title": "Send Dataset Request",
    "description": "<p>Sends a request for a dataset to the site administrators</p>",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "string",
            "optional": false,
            "field": "senderName",
            "description": "<p>The name of the sender</p>"
          },
          {
            "group": "Request body",
            "type": "string",
            "optional": false,
            "field": "senderEmail",
            "description": "<p>The email address of the sender</p>"
          },
          {
            "group": "Request body",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>The message to send</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>OK</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n     \"status\": \"OK\",\n     \"recipient\": \"xx@xx.com\",\n     \"sentToDefaultRecipient\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>FAILED</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "400",
          "content": "{\n     \"status\": \"Failed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-correspondence-api/src/createApiRouter.ts",
    "groupTitle": "Correspondence_API",
    "name": "PostV0CorrespondenceSendDatasetRequest"
  },
  {
    "group": "FaaS_Function",
    "type": "delete",
    "url": "/v0/openfaas/system/functions",
    "title": "Delete a function",
    "description": "<p>Delete a deployed function You need <code>object/faas/function/delete</code> permission in order to access this API.</p>",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\n{\n   \"functionName\": \"nodeinfo\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "HTTP/1.1 200 Accepted",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "HTTP/1.1 400 Bad Request",
          "type": "string"
        },
        {
          "title": "404",
          "content": "HTTP/1.1 404 Not Found",
          "type": "string"
        },
        {
          "title": "500",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "string"
        },
        {
          "title": "403",
          "content": "you are not permitted to perform `object/faas/function/delete` on required resources",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-gateway/src/createOpenfaasGatewayProxy.ts",
    "groupTitle": "FaaS_Function",
    "name": "DeleteV0OpenfaasSystemFunctions"
  },
  {
    "group": "FaaS_Function",
    "type": "get",
    "url": "/v0/openfaas/system/function/:functionName",
    "title": "Get the info of a deployed function",
    "description": "<p>Returns the info of a deployed function You need <code>object/faas/function/read</code> permission in order to access this API.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "Number",
            "optional": false,
            "field": "functionName",
            "description": "<p>the name of the function</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"name\": \"nodeinfo\",\n    \"image\": \"functions/nodeinfo:latest\",\n    \"invocationCount\": 1337,\n    \"replicas\": 2,\n    \"availableReplicas\": 2,\n    \"envProcess\": \"node main.js\",\n    \"labels\": {\n      \"foo\": \"bar\"\n    },\n    \"annotations\": {\n      \"topics\": \"awesome-kafka-topic\",\n      \"foo\": \"bar\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "500",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "string"
        },
        {
          "title": "404",
          "content": "HTTP/1.1 404 Not Found",
          "type": "string"
        },
        {
          "title": "403",
          "content": "you are not permitted to perform `object/faas/function/read` on required resources",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-gateway/src/createOpenfaasGatewayProxy.ts",
    "groupTitle": "FaaS_Function",
    "name": "GetV0OpenfaasSystemFunctionFunctionname"
  },
  {
    "group": "FaaS_Function",
    "type": "get",
    "url": "/v0/openfaas/system/functions",
    "title": "Get the info of all deployed functions",
    "description": "<p>Returns a list of deployed FaaS functions You need <code>object/faas/function/read</code> permission in order to access this API.</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[\n   {\n       \"name\": \"nodeinfo\",\n       \"image\": \"functions/nodeinfo:latest\",\n       \"invocationCount\": 1337,\n       \"replicas\": 2,\n       \"availableReplicas\": 2,\n       \"envProcess\": \"node main.js\",\n       \"labels\": {\n         \"foo\": \"bar\"\n       },\n       \"annotations\": {\n         \"topics\": \"awesome-kafka-topic\",\n         \"foo\": \"bar\"\n       }\n   }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "500",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "string"
        },
        {
          "title": "403",
          "content": "you are not permitted to perform `object/faas/function/read` on required resources",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-gateway/src/createOpenfaasGatewayProxy.ts",
    "groupTitle": "FaaS_Function",
    "name": "GetV0OpenfaasSystemFunctions"
  },
  {
    "group": "FaaS_Function",
    "type": "post",
    "url": "/v0/openfaas/async-function/:functionName",
    "title": "Invoke a function asynchronously",
    "description": "<p>Invoke a function asynchronously You need <code>object/faas/function/invoke</code> permission in order to access this API.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "Number",
            "optional": false,
            "field": "functionName",
            "description": "<p>the name of the function</p>"
          }
        ],
        "header": [
          {
            "group": "header",
            "type": "String",
            "optional": false,
            "field": "X-Callback-Url",
            "description": "<p>the call back url that the function return data will be posted to.</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "any",
            "optional": true,
            "field": "input",
            "description": "<p>when invoke the function, you can optionally supply function input in HTTP request body. The whole request body will be passed to the function as input. However, how body data is parsed depends on the mime type.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "// Content-Type: application/json\n{\"hello\": \"world\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "header": [
          {
            "group": "header",
            "type": "String",
            "optional": false,
            "field": "X-Call-Id",
            "description": "<p>the call id that identify this invocation. The same header will also be included by the notification request that is sent to the call back http url.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "202",
          "content": "HTTP/1.1 202 Accepted\nRequest accepted and queued",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "404",
          "content": "HTTP/1.1 404 Not Found",
          "type": "string"
        },
        {
          "title": "500",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "string"
        },
        {
          "title": "403",
          "content": "you are not permitted to perform `object/faas/function/invoke` on required resources",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-gateway/src/createOpenfaasGatewayProxy.ts",
    "groupTitle": "FaaS_Function",
    "name": "PostV0OpenfaasAsyncFunctionFunctionname"
  },
  {
    "group": "FaaS_Function",
    "type": "post",
    "url": "/v0/openfaas/function/:functionName",
    "title": "Invoke a function",
    "description": "<p>Invoke a function You need <code>object/faas/function/invoke</code> permission in order to access this API.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "Number",
            "optional": false,
            "field": "functionName",
            "description": "<p>the name of the function</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "any",
            "optional": true,
            "field": "input",
            "description": "<p>when invoke the function, you can optionally supply function input in HTTP request body. The whole request body will be passed to the function as input. However, how body data is parsed depends on the mime type.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "// Content-Type: application/json\n{\"hello\": \"world\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "HTTP/1.1 200 Ok\n// HTTP response body contains value returned from function",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "HTTP/1.1 400 Bad Request",
          "type": "string"
        },
        {
          "title": "404",
          "content": "HTTP/1.1 404 Not Found",
          "type": "string"
        },
        {
          "title": "500",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "string"
        },
        {
          "title": "403",
          "content": "you are not permitted to perform `object/faas/function/invoke` on required resources",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-gateway/src/createOpenfaasGatewayProxy.ts",
    "groupTitle": "FaaS_Function",
    "name": "PostV0OpenfaasFunctionFunctionname"
  },
  {
    "group": "FaaS_Function",
    "type": "post",
    "url": "/v0/openfaas/system/functions",
    "title": "Create/Deploy a function",
    "description": "<p>Create/Deploy a function You need <code>object/faas/function/create</code> permission in order to access this API. You can also deploy FaaS function as the part of Magda deployment as a Helm Chart. Please see <a href=\"https://github.com/magda-io/magda-function-template\">magda-function-template</a></p>",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\n{\n     \"service\": \"nodeinfo\",\n     \"network\": \"func_functions\",\n     \"image\": \"functions/nodeinfo:latest\",\n     \"envProcess\": \"node main.js\",\n     \"envVars\": {\n         \"additionalProp1\": \"string\",\n         \"additionalProp2\": \"string\",\n         \"additionalProp3\": \"string\"\n     },\n     \"constraints\": [\n         \"node.platform.os == linux\"\n     ],\n     \"labels\": {\n         \"foo\": \"bar\"\n     },\n     \"annotations\": {\n         \"topics\": \"awesome-kafka-topic\",\n         \"foo\": \"bar\"\n     },\n     \"secrets\": [\n         \"secret-name-1\"\n     ],\n     \"registryAuth\": \"dXNlcjpwYXNzd29yZA==\",\n     \"limits\": {\n         \"memory\": \"128M\",\n         \"cpu\": \"0.01\"\n     },\n     \"requests\": {\n         \"memory\": \"128M\",\n         \"cpu\": \"0.01\"\n     },\n     \"readOnlyRootFilesystem\": true\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "202",
          "content": "HTTP/1.1 202 Accepted",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "HTTP/1.1 400 Bad Request",
          "type": "string"
        },
        {
          "title": "500",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "string"
        },
        {
          "title": "403",
          "content": "you are not permitted to perform `object/faas/function/create` on required resources",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-gateway/src/createOpenfaasGatewayProxy.ts",
    "groupTitle": "FaaS_Function",
    "name": "PostV0OpenfaasSystemFunctions"
  },
  {
    "group": "FaaS_Function",
    "type": "put",
    "url": "/v0/openfaas/system/functions",
    "title": "Update a function",
    "description": "<p>Update a deployed function You need <code>object/faas/function/update</code> permission in order to access this API.</p>",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\n{\n     \"service\": \"nodeinfo\",\n     \"network\": \"func_functions\",\n     \"image\": \"functions/nodeinfo:latest\",\n     \"envProcess\": \"node main.js\",\n     \"envVars\": {\n         \"additionalProp1\": \"string\",\n         \"additionalProp2\": \"string\",\n         \"additionalProp3\": \"string\"\n     },\n     \"constraints\": [\n         \"node.platform.os == linux\"\n     ],\n     \"labels\": {\n         \"foo\": \"bar\"\n     },\n     \"annotations\": {\n         \"topics\": \"awesome-kafka-topic\",\n         \"foo\": \"bar\"\n     },\n     \"secrets\": [\n         \"secret-name-1\"\n     ],\n     \"registryAuth\": \"dXNlcjpwYXNzd29yZA==\",\n     \"limits\": {\n         \"memory\": \"128M\",\n         \"cpu\": \"0.01\"\n     },\n     \"requests\": {\n         \"memory\": \"128M\",\n         \"cpu\": \"0.01\"\n     },\n     \"readOnlyRootFilesystem\": true\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "HTTP/1.1 200 Accepted",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "HTTP/1.1 400 Bad Request",
          "type": "string"
        },
        {
          "title": "404",
          "content": "HTTP/1.1 404 Not Found",
          "type": "string"
        },
        {
          "title": "500",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "string"
        },
        {
          "title": "403",
          "content": "you are not permitted to perform `object/faas/function/update` on required resources",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-gateway/src/createOpenfaasGatewayProxy.ts",
    "groupTitle": "FaaS_Function",
    "name": "PutV0OpenfaasSystemFunctions"
  },
  {
    "group": "Indexer",
    "type": "delete",
    "url": "/v0/indexer/dataset/{datasetId}",
    "title": "delete a dataset from the index",
    "description": "<p>Delete a dataset from the search engine index. This API will also refresh the dataset index to make sure the changes available for search. Require &quot;object/dataset/*/delete&quot; permission to the dataset in order to access this API.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "A",
            "description": "<p>Json object indicate the deletion result</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"deleted\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-indexer/src/main/scala/au/csiro/data61/magda/indexer/external/registry/DatasetApi.scala",
    "groupTitle": "Indexer",
    "name": "DeleteV0IndexerDatasetDatasetid",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Indexer",
    "type": "get",
    "url": "/v0/indexer/reindex/in-progress",
    "title": "Check reindex progress",
    "description": "<p>Reveals whether the indexer is currently reindexing. Returns a simple text &quot;true&quot; or &quot;false&quot;. requires permission to operation uri <code>api/indexer/reindex/in-progress</code></p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Response",
            "description": "<p><code>true</code> or <code>false</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-indexer/src/main/scala/au/csiro/data61/magda/indexer/crawler/CrawlerApi.scala",
    "groupTitle": "Indexer",
    "name": "GetV0IndexerReindexInProgress",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Indexer",
    "type": "post",
    "url": "http://indexer/v0/registry-hook",
    "title": "Hook endpoint (internal)",
    "description": "<p>Registry webhook endpoint - accepts webhook payloads from the registry. This generally means datasets from the registry as they're updated. This shouldn't be called manually, it's purely for registry use.</p>",
    "success": {
      "fields": {
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "Response",
            "description": "<p>(blank)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-indexer/src/main/scala/au/csiro/data61/magda/indexer/external/registry/WebhookApi.scala",
    "groupTitle": "Indexer",
    "name": "PostHttpIndexerV0RegistryHook",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Indexer",
    "type": "post",
    "url": "/v0/indexer/reindex",
    "title": "Trigger reindex",
    "description": "<p>Triggers a new reindex, if possible. This means that all datasets and organisations in the registry will be reingested into the ElasticSearch index, and any not present in the registry will be deleted from ElasticSearch.</p> <p>If this is already in progress, returns 409.</p> <p>Requires permission to operation uri <code>api/indexer/reindex</code></p>",
    "success": {
      "fields": {
        "Success 202": [
          {
            "group": "Success 202",
            "type": "String",
            "optional": false,
            "field": "Response",
            "description": "<p>(blank)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 409": [
          {
            "group": "Error 409",
            "type": "String",
            "optional": false,
            "field": "Response",
            "description": "<p>&quot;Reindex in progress&quot;</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-indexer/src/main/scala/au/csiro/data61/magda/indexer/crawler/CrawlerApi.scala",
    "groupTitle": "Indexer",
    "name": "PostV0IndexerReindex"
  },
  {
    "group": "Indexer",
    "type": "put",
    "url": "/v0/indexer/dataset/{datasetId}",
    "title": "reindex a dataset by ID",
    "description": "<p>Ask indexer to re-pull dataset data from registry and index into search engine index. You only need to call this API when you want the changes of the datasets to go into search engine index immediately without any delay of webhook system. This API will also refresh the dataset index to make sure the changes available for search. Require &quot;object/dataset/*/update&quot; permission to the dataset in order to access this API.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "A",
            "description": "<p>Json object indicate the deletion result</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"successes\": 1,\n  \"failures\": 0,\n  \"warns\": 0,\n  \"failureReasons\": [],\n  \"warnReasons\": []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-indexer/src/main/scala/au/csiro/data61/magda/indexer/external/registry/DatasetApi.scala",
    "groupTitle": "Indexer",
    "name": "PutV0IndexerDatasetDatasetid",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Minions",
    "type": "get",
    "url": "/v0/minions/crawlerProgress",
    "title": "Get the minion recrawl progress",
    "description": "<p>Get the minion recrawl progress</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the minion recrawl progress</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  isSuccess: true,\n  progress: {\n     isCrawling: true,\n     crawlingPageToken: \"101\",\n     crawledRecordNumber: 100\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-minion-framework/src/setupRecrawlEndpoint.ts",
    "groupTitle": "Minions",
    "name": "GetV0MinionsCrawlerprogress",
    "error": {
      "fields": {
        "Error 500 JSON Response Body": [
          {
            "group": "Error 500 JSON Response Body",
            "type": "Boolean",
            "optional": false,
            "field": "isSuccess",
            "description": "<p>Whether or not the operation is successfully done.</p>"
          },
          {
            "group": "Error 500 JSON Response Body",
            "type": "Boolean",
            "optional": true,
            "field": "isNewCrawler",
            "description": "<p>indicate Whether it's a new crawler process or existing crawling process is still no-going.</p>"
          },
          {
            "group": "Error 500 JSON Response Body",
            "type": "String",
            "optional": false,
            "field": "errorMessage",
            "description": "<p>Free text error message. Only available when <code>isSuccess</code>=<code>false</code></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n    isSuccess: false,\n    errorMessage: \"Unknown Error\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "group": "Minions",
    "type": "post",
    "url": "/v0/minions/recrawl",
    "title": "Make the minion recrawl the registry",
    "description": "<p>Make the minion recrawl the registry</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the minion recrawl status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  isSuccess: true,\n  isNewCrawler: true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-minion-framework/src/setupRecrawlEndpoint.ts",
    "groupTitle": "Minions",
    "name": "PostV0MinionsRecrawl",
    "error": {
      "fields": {
        "Error 500 JSON Response Body": [
          {
            "group": "Error 500 JSON Response Body",
            "type": "Boolean",
            "optional": false,
            "field": "isSuccess",
            "description": "<p>Whether or not the operation is successfully done.</p>"
          },
          {
            "group": "Error 500 JSON Response Body",
            "type": "Boolean",
            "optional": true,
            "field": "isNewCrawler",
            "description": "<p>indicate Whether it's a new crawler process or existing crawling process is still no-going.</p>"
          },
          {
            "group": "Error 500 JSON Response Body",
            "type": "String",
            "optional": false,
            "field": "errorMessage",
            "description": "<p>Free text error message. Only available when <code>isSuccess</code>=<code>false</code></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n    isSuccess: false,\n    errorMessage: \"Unknown Error\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "group": "Registry_Aspects",
    "type": "get",
    "url": "/v0/registry/aspects",
    "title": "Get a list of all aspects",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>The aspect definitions.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "\n[\n  {\n    \"id\": \"string\",\n    \"name\": \"string\",\n    \"jsonSchema\": {}\n  }\n  ...\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/AspectsServiceRO.scala",
    "groupTitle": "Registry_Aspects",
    "name": "GetV0RegistryAspects",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Aspects",
    "type": "get",
    "url": "/v0/registry/aspects/{id}",
    "title": "Get an aspect by ID",
    "description": "<p>Get an aspect by ID</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the aspect to be fetched.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>The details of the aspect.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "\n{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"jsonSchema\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/AspectsServiceRO.scala",
    "groupTitle": "Registry_Aspects",
    "name": "GetV0RegistryAspectsId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Aspects",
    "type": "patch",
    "url": "/v0/registry/aspects/{id}",
    "title": "Modify an aspect by applying a JSON Patch",
    "description": "<p>The patch should follow IETF RFC 6902 (https://tools.ietf.org/html/rfc6902).</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the aspect to be saved.</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "json",
            "optional": false,
            "field": "aspectPatch",
            "description": "<p>The RFC 6902 patch to apply to the aspect.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "[\n   {\n       \"path\": \"string\"\n   }\n]",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>The details of the aspect patched.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "\n{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"jsonSchema\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/AspectsService.scala",
    "groupTitle": "Registry_Aspects",
    "name": "PatchV0RegistryAspectsId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Aspects",
    "type": "post",
    "url": "/v0/registry/aspects",
    "title": "Create a new aspect",
    "description": "<p>Acknowledges a previously-deferred web hook with a given ID. Acknowledging a previously-POSTed web hook will cause the next, if any, to be sent.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "json",
            "optional": false,
            "field": "aspect",
            "description": "<p>The definition of the new aspect.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n   \"id\": \"string\",\n   \"name\": \"string\",\n   \"jsonSchema\": {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>The created aspect</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "\n{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"jsonSchema\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/AspectsService.scala",
    "groupTitle": "Registry_Aspects",
    "name": "PostV0RegistryAspects",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Aspects",
    "type": "put",
    "url": "/v0/registry/aspects/{id}",
    "title": "Modify an aspect by ID",
    "description": "<p>Modifies the aspect with a given ID. If an aspect with the ID does not yet exist, it is created.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the aspect to be saved.</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "json",
            "optional": false,
            "field": "aspect",
            "description": "<p>The aspect to save.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n   \"id\": \"string\",\n   \"name\": \"string\",\n   \"jsonSchema\": {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>The details of the aspect saved.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "\n{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"jsonSchema\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/AspectsService.scala",
    "groupTitle": "Registry_Aspects",
    "name": "PutV0RegistryAspectsId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Aspects",
    "type": "delete",
    "url": "/v0/registry/records/aspectArrayItems/:aspectId",
    "title": "Remove items from records' aspect data",
    "description": "<p>this API goes through the aspect data that is specified by aspectId of a list of registry records and delete items from the array that is located by the jsonPath. If the aspect doesn't exist for a record or the array can't be located with the jsonPath string or the value located with the jsonPath string is <code>null</code>, the operation will be skipped without throwing error. <code>0</code> will returned as eventId for this case. If the json data that is located by the jsonPath string exists and is not an Array or null, an error will be thrown and 400 code will be responded.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "aspectId",
            "description": "<p>the id of the aspect to be updated</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "string[]",
            "optional": false,
            "field": "recordIds",
            "description": "<p>a list of record IDs of records to be patched</p>"
          },
          {
            "group": "body",
            "type": "string",
            "optional": false,
            "field": "jsonPath",
            "description": "<p>the jsonPath string that is used to locate the json array in the record aspect data</p>"
          },
          {
            "group": "body",
            "type": "any[]",
            "optional": false,
            "field": "items",
            "description": "<p>a list of items to be removed from the located array. The type of the items can be either string or number.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  \"recordIds\": [\"dsd-sds-xsds-22\", \"sds-sdds-2334-dds-34\", \"sdds-3439-34334343\"],\n  \"jsonPath\": \"$.preAuthorisedPermissionIds\",\n  \"items\": [\"b133d777-6208-4aa1-8d0b-80bb49b7e5fc\", \"5d33cc4d-d914-468e-9f02-ae74484af716\"]\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          },
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>a list of event id for each of the affected records after the operations</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "[122, 123, 124]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsService.scala",
    "groupTitle": "Registry_Record_Aspects",
    "name": "DeleteV0RegistryRecordsAspectarrayitemsAspectid",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Aspects",
    "type": "delete",
    "url": "/v0/registry/records/{recordId}/aspects/{aspectId}",
    "title": "Delete a record aspect by ID",
    "description": "<p>Deletes a record aspect.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "recordId",
            "description": "<p>ID of the record for which to update an aspect.</p>"
          },
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "aspectId",
            "description": "<p>ID of the aspect to update</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          },
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "x-magda-event-id",
            "description": "<p>This is a <strong>response header</strong> that is <strong>ONLY</strong> available when the operation is completed successfully. If the operation did make changes and triggered an event, the header value will be the eventId. Otherwise (i.e. no change are made), this header value will be &quot;0&quot;.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>operation result</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"deleted\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordAspectsService.scala",
    "groupTitle": "Registry_Record_Aspects",
    "name": "DeleteV0RegistryRecordsRecordidAspectsAspectid",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Aspects",
    "type": "get",
    "url": "/v0/registry/records/{recordId}/aspects",
    "title": "Get a list of a record's aspects",
    "description": "<p>Get a list of a record's aspects</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "recordId",
            "description": "<p>ID of the record</p>"
          }
        ],
        "query": [
          {
            "group": "query",
            "type": "string",
            "optional": false,
            "field": "keyword",
            "description": "<p>Specify the keyword to search in the all aspects' aspectId &amp; data fields. The two fields will be treated as string during the search.</p>"
          },
          {
            "group": "query",
            "type": "boolean",
            "optional": false,
            "field": "aspectIdOnly",
            "description": "<p>When set to true, will respond only an array contains aspect id only. Default to <code>false</code>.</p>"
          },
          {
            "group": "query",
            "type": "number",
            "optional": false,
            "field": "start",
            "description": "<p>The index of the first aspect to retrieve.</p>"
          },
          {
            "group": "query",
            "type": "number",
            "optional": false,
            "field": "limit",
            "description": "<p>The maximum number of aspects to receive.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>a list of the record's aspects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response with Aspect Data",
          "content": "[{\n  \"id\": \"aspect-abc\",\n  \"data\": {\n    \"format\": \"text/csv\",\n    \"mediaType\": \"text/csv\",\n    \"name\": \"qcat-outdoor~AIR_TEMP~9.csv\",\n    \"downloadURL\": \"https://data.csiro.au/dap/ws/v2/collections/17914/data/103023\",\n    \"licence\": \"CSIRO Data Licence\",\n    \"id\": 103023,\n    \"accessURL\": \"https://data.csiro.au/dap/ws/v2/collections/17914/data\"\n  }\n}]",
          "type": "json"
        },
        {
          "title": "Response with Aspect ID only",
          "content": "[\"aspect-id-1\", \"aspect-id-2\", \"aspect-id-3\"]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordAspectsServiceRO.scala",
    "groupTitle": "Registry_Record_Aspects",
    "name": "GetV0RegistryRecordsRecordidAspects",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Aspects",
    "type": "get",
    "url": "/v0/registry/records/{recordId}/aspects/{aspectId}",
    "title": "Get a record aspect by ID",
    "description": "<p>Get an aspects of a record specified by aspect ID</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "recordId",
            "description": "<p>ID of the record for which to fetch an aspect</p>"
          },
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "aspectId",
            "description": "<p>ID of the aspect to fetch</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the aspect detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"format\": \"text/csv\",\n  \"mediaType\": \"text/csv\",\n  \"name\": \"qcat-outdoor~AIR_TEMP~9.csv\",\n  \"downloadURL\": \"https://data.csiro.au/dap/ws/v2/collections/17914/data/103023\",\n  \"licence\": \"CSIRO Data Licence\",\n  \"id\": 103023,\n  \"accessURL\": \"https://data.csiro.au/dap/ws/v2/collections/17914/data\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordAspectsServiceRO.scala",
    "groupTitle": "Registry_Record_Aspects",
    "name": "GetV0RegistryRecordsRecordidAspectsAspectid",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Aspects",
    "type": "get",
    "url": "/v0/registry/records/{recordId}/aspects/count",
    "title": "Get the number of aspects that a record has",
    "description": "<p>Get the number of aspects that a record has</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "recordId",
            "description": "<p>ID of the record to count aspects</p>"
          }
        ],
        "query": [
          {
            "group": "query",
            "type": "string",
            "optional": false,
            "field": "keyword",
            "description": "<p>Specify the keyword to search in the all aspects' aspectId &amp; data fields. The two fields will be treated as string during the search.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the aspect detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"count\": 5\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordAspectsServiceRO.scala",
    "groupTitle": "Registry_Record_Aspects",
    "name": "GetV0RegistryRecordsRecordidAspectsCount",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Aspects",
    "type": "patch",
    "url": "/v0/registry/records/{recordId}/aspects/{aspectId}",
    "title": "Modify a record aspect by applying a JSON Patch",
    "description": "<p>The patch should follow IETF RFC 6902 (https://tools.ietf.org/html/rfc6902).</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "recordId",
            "description": "<p>ID of the record for which to update an aspect.</p>"
          },
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "aspectId",
            "description": "<p>ID of the aspect to update</p>"
          }
        ],
        "aspectPatch": [
          {
            "group": "aspectPatch",
            "type": "json",
            "optional": false,
            "field": "aspectPatch",
            "description": "<p>The RFC 6902 patch to apply to the aspect.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "[\n   {\n      \"path\": \"string\"\n   }\n]",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          },
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "x-magda-event-id",
            "description": "<p>This is a <strong>response header</strong> that is <strong>ONLY</strong> available when the operation is completed successfully. If the operation did make changes and triggered an event, the header value will be the eventId. Otherwise (i.e. no change are made), this header value will be &quot;0&quot;.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>operation result</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"format\": \"text/csv\",\n  \"mediaType\": \"text/csv\",\n  \"name\": \"qcat-outdoor~AIR_TEMP~9.csv\",\n  \"downloadURL\": \"https://data.csiro.au/dap/ws/v2/collections/17914/data/103023\",\n  \"licence\": \"CSIRO Data Licence\",\n  \"id\": 103023,\n  \"accessURL\": \"https://data.csiro.au/dap/ws/v2/collections/17914/data\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordAspectsService.scala",
    "groupTitle": "Registry_Record_Aspects",
    "name": "PatchV0RegistryRecordsRecordidAspectsAspectid",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Aspects",
    "type": "put",
    "url": "/v0/registry/records/aspects/:aspectId",
    "title": "Modify a list of records's aspect with same new data",
    "description": "<p>Modify a list of records's aspect with same new data</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "aspectId",
            "description": "<p>the id of the aspect to be updated</p>"
          }
        ],
        "query": [
          {
            "group": "query",
            "type": "boolean",
            "optional": true,
            "field": "merge",
            "description": "<p>Indicate whether merge the new data into existing aspect data or replace it. Default: <code>false</code></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "string[]",
            "optional": false,
            "field": "recordIds",
            "description": "<p>a list of record IDs of records to be patched</p>"
          },
          {
            "group": "body",
            "type": "object",
            "optional": false,
            "field": "data",
            "description": "<p>the new aspect data. When <code>merge</code> = true, the new data will be merged into existing aspect data (if exists).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  \"recordIds\": [\"dsd-sds-xsds-22\", \"sds-sdds-2334-dds-34\", \"sdds-3439-34334343\"],\n  \"data\": {\n     \"a\" : 1,\n     \"b\" : [1,2]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          },
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>a list of event id for each of the record after applied the new aspect data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "[122, 123, 124]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsService.scala",
    "groupTitle": "Registry_Record_Aspects",
    "name": "PutV0RegistryRecordsAspectsAspectid",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Aspects",
    "type": "put",
    "url": "/v0/registry/records/{recordId}/aspects/{aspectId}",
    "title": "Modify a record aspect by ID",
    "description": "<p>Modifies a record aspect. If the aspect does not yet exist on this record, it is created. Please note: when the record (specified by recordId ) doesn't exist, this API will respond 400 error.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "recordId",
            "description": "<p>ID of the record for which to update an aspect.</p>"
          },
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "aspectId",
            "description": "<p>ID of the aspect to update</p>"
          }
        ],
        "query": [
          {
            "group": "query",
            "type": "boolean",
            "optional": true,
            "field": "merge",
            "description": "<p>Whether merge with existing aspect data or replace it. Default: <code>false</code></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "json",
            "optional": false,
            "field": "aspect",
            "description": "<p>The record aspect to save</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  \"format\": \"text/csv\",\n  \"mediaType\": \"text/csv\",\n  \"name\": \"qcat-outdoor~AIR_TEMP~9.csv\",\n  \"downloadURL\": \"https://data.csiro.au/dap/ws/v2/collections/17914/data/103023\",\n  \"licence\": \"CSIRO Data Licence\",\n  \"id\": 103023,\n  \"accessURL\": \"https://data.csiro.au/dap/ws/v2/collections/17914/data\"\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          },
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "x-magda-event-id",
            "description": "<p>This is a <strong>response header</strong> that is <strong>ONLY</strong> available when the operation is completed successfully. If the operation did make changes and triggered an event, the header value will be the eventId. Otherwise (i.e. no change are made), this header value will be &quot;0&quot;.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the aspect detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"format\": \"text/csv\",\n  \"mediaType\": \"text/csv\",\n  \"name\": \"qcat-outdoor~AIR_TEMP~9.csv\",\n  \"downloadURL\": \"https://data.csiro.au/dap/ws/v2/collections/17914/data/103023\",\n  \"licence\": \"CSIRO Data Licence\",\n  \"id\": 103023,\n  \"accessURL\": \"https://data.csiro.au/dap/ws/v2/collections/17914/data\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordAspectsService.scala",
    "groupTitle": "Registry_Record_Aspects",
    "name": "PutV0RegistryRecordsRecordidAspectsAspectid",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_History",
    "type": "get",
    "url": "/v0/registry/records/{recordId}/history",
    "title": "Get a list of all events affecting this record",
    "description": "<p>Get a list of all aspects of a record</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "recordId",
            "description": "<p>ID of the record to fetch.</p>"
          }
        ],
        "query": [
          {
            "group": "query",
            "type": "string",
            "optional": false,
            "field": "pageToken",
            "description": "<p>A token that identifies the start of a page of results. This token should not be interpreted as having any meaning, but it can be obtained from a previous page of results.</p>"
          },
          {
            "group": "query",
            "type": "boolean",
            "optional": false,
            "field": "reversePageTokenOrder",
            "description": "<p>When pagination via pageToken, by default, records with smaller pageToken (i.e. older records) will be returned first. When this parameter is set to <code>true</code>, higher pageToken records (newer records) will be returned.</p>"
          },
          {
            "group": "query",
            "type": "number",
            "optional": false,
            "field": "start",
            "description": "<p>The index of the first event to retrieve. Specify pageToken instead will result in better performance when access high offset. If this parameter and pageToken are both specified, this parameter is interpreted as the index after the pageToken of the first record to retrieve.</p>"
          },
          {
            "group": "query",
            "type": "number",
            "optional": false,
            "field": "limit",
            "description": "<p>The maximum number of records to receive. The response will include a token that can be passed as the pageToken parameter to a future request to continue receiving results where this query leaves off.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the event list</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n    \"events\": [\n        {\n            \"eventTime\": \"2018-08-29T07:45:48.011Z\",\n            \"eventType\": \"CreateRecord\",\n            \"tenantId\": 0,\n            \"userId\": 0,\n            \"data\": {\n                ...\n            }\n        },\n        ...\n    ],\n    \"hasMore\": true,\n    \"nextPageToken\": \"xxx\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordHistoryService.scala",
    "groupTitle": "Registry_Record_History",
    "name": "GetV0RegistryRecordsRecordidHistory",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_History",
    "type": "get",
    "url": "/v0/registry/records/{recordId}/history/{eventId}",
    "title": "Get the version of a record that existed after a given event was applied",
    "description": "<p>Get the version of a record that existed after a given event was applied</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "recordId",
            "description": "<p>ID of the record to fetch.</p>"
          },
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "eventId",
            "description": "<p>The ID of the last event to be applied to the record. The event with this ID need not actually apply to the record, in which case that last event prior to this even that does apply will be used.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the record detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n    \"data\": {\n        \"aspect\": {\n            \"id\": \"dga\",\n            \"name\": \"data.gov.au\",\n            \"type\": \"ckan-organization\",\n            \"url\": \"https://data.gov.au/api/3/action/organization_show?id=760c24b1-3c3d-4ccb-8196-41530fcdebd5\"\n        },\n        \"aspectId\": \"source\",\n        \"recordId\": \"org-dga-760c24b1-3c3d-4ccb-8196-41530fcdebd5\",\n        \"tenantId\": 0\n    },\n    \"eventTime\": \"2011-12-10T15:40:55.987+11:00\",\n    \"eventType\": \"CreateRecordAspect\",\n    \"id\": 11,\n    \"tenantId\": 0,\n    \"userId\": 0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordHistoryService.scala",
    "groupTitle": "Registry_Record_History",
    "name": "GetV0RegistryRecordsRecordidHistoryEventid",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Service",
    "type": "delete",
    "url": "/v0/registry/records",
    "title": "Trim by source tag",
    "description": "<p>Trims records with the provided source that DON’T have the supplied source tag</p>",
    "parameter": {
      "fields": {
        "query": [
          {
            "group": "query",
            "type": "string",
            "optional": false,
            "field": "sourceTagToPreserve",
            "description": "<p>Source tag of the records to PRESERVE.</p>"
          },
          {
            "group": "query",
            "type": "string",
            "optional": false,
            "field": "sourceId",
            "description": "<p>Source id of the records to delete.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response-200",
            "description": "<p>the trim result</p>"
          }
        ],
        "Success 202": [
          {
            "group": "Success 202",
            "type": "string",
            "optional": false,
            "field": "Response",
            "description": "<p>Deletion is taking a long time (normal for sources with many records) but it has worked</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response-200:",
          "content": "{\n  \"count\": 0\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "type": "string",
            "optional": false,
            "field": "Response",
            "description": "<p>The records could not be deleted, possibly because they are used by other records.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsService.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "DeleteV0RegistryRecords"
  },
  {
    "group": "Registry_Record_Service",
    "type": "delete",
    "url": "/v0/registry/records/{recordId}",
    "title": "Delete a record",
    "description": "<p>Delete a record</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "recordId",
            "description": "<p>ID of the record to delete.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "x-magda-event-id",
            "description": "<p>This is a <strong>response header</strong> that is <strong>ONLY</strong> available when the operation is completed successfully. If the operation did make changes and triggered an event, the header value will be the eventId. Otherwise (i.e. no change are made), this header value will be &quot;0&quot;.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the record deletion result</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"deleted\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsService.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "DeleteV0RegistryRecordsRecordid",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Service",
    "type": "get",
    "url": "/v0/registry/records",
    "title": "Get a list of all records",
    "description": "<p>Get a list of all records</p>",
    "parameter": {
      "fields": {
        "query": [
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "q",
            "description": "<p>Full text search querytext. You can supply keywords or phrases for full text search against all possible fields of all aspect data.</p> <p>The full text search querytext leverages <a href=\"https://www.postgresql.org/docs/13/textsearch-controls.html#TEXTSEARCH-PARSING-QUERIES\">websearch_to_tsquery</a> to parse user querytext into a valid text search query. The following syntax is supported:</p> <ul> <li>unquoted text: text not inside quote marks will be converted to terms separated by &amp; operators, as if processed by plainto_tsquery.</li> <li>&quot;quoted text&quot;: text inside quote marks will be converted to terms separated by &lt;-&gt; operators, as if processed by phraseto_tsquery.</li> <li>OR: the word “or” will be converted to the | operator.</li> <li>-: a dash will be converted to the ! operator.</li> </ul> <p>Other punctuation is ignored. tsquery operators, weight labels, or prefix-match labels in its input will not be recognized.</p> <p>For simple usage, you can simply supply keywords that you want the search result (i.e. record) matched.</p> <p>The full text search function will cover all field values in all aspect data, plus record id and aspect id.</p> <p>Please note: the record name field on records table will not be covered for the performance reason.</p>"
          },
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "aspect",
            "description": "<p>The aspects for which to retrieve data, specified as multiple occurrences of this query parameter. Only records that have all of these aspects will be included in the response.</p>"
          },
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "optionalAspect",
            "description": "<p>The optional aspects for which to retrieve data, specified as multiple occurrences of this query parameter. These aspects will be included in a record if available, but a record will be included even if it is missing these aspects.</p>"
          },
          {
            "group": "query",
            "type": "string",
            "optional": false,
            "field": "pageToken",
            "description": "<p>A token that identifies the start of a page of results. This token should not be interpreted as having any meaning, but it can be obtained from a previous page of results.</p>"
          },
          {
            "group": "query",
            "type": "boolean",
            "optional": false,
            "field": "reversePageTokenOrder",
            "description": "<p>When pagination via pageToken, by default, records with smaller pageToken (i.e. older records) will be returned first. When this parameter is set to <code>true</code>, higher pageToken records (newer records) will be returned.</p>"
          },
          {
            "group": "query",
            "type": "number",
            "optional": false,
            "field": "start",
            "description": "<p>The index of the first record to retrieve. When possible, specify pageToken instead as it will result in better performance. If this parameter and pageToken are both specified, this parameter is interpreted as the index after the pageToken of the first record to retrieve.</p>"
          },
          {
            "group": "query",
            "type": "number",
            "optional": false,
            "field": "limit",
            "description": "<p>The maximum number of records to receive. The response will include a token that can be passed as the pageToken parameter to a future request to continue receiving results where this query leaves off.</p>"
          },
          {
            "group": "query",
            "type": "boolean",
            "optional": false,
            "field": "dereference",
            "description": "<p>true to automatically dereference links to other records; false to leave them as links. Dereferencing a link means including the record itself where the link would be. Dereferencing only happens one level deep, regardless of the value of this parameter.</p>"
          },
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "aspectQuery",
            "description": "<p>Filter the records returned by a value within the aspect JSON.</p> <p>Expressed as string concatenation of:</p> <ul> <li><code>aspectId.path.to.field</code></li> <li><code>operator</code></li> <li><code>value</code></li> </ul> <p>Except <code>operator</code>, all parts must be encoded as <code>application/x-www-form-urlencoded</code> MIME format before encoded as query string parameter value.</p> <p>A sample query string encoding implementation is available <a href=\"https://gist.github.com/t83714/db1725a347c07413c16803a77da13003\">here</a>.</p> <p>If more than one queries is passed through the <code>aspectQuery</code> parameters, they will be grouped with <code>AND</code> logic.</p> <p>Support the following operators in aspectQuery or <code>aspectOrQuery</code>:</p> <ul> <li><code>:</code> equal</li> <li><code>:!</code>  not equal</li> <li><code>:?</code>  matches a pattern, case insensitive. Use Postgresql <a href=\"https://www.postgresql.org/docs/9.6/functions-matching.html#FUNCTIONS-LIKE\">ILIKE</a> operator. <ul> <li>e.g. <code>:?%rating%</code> will match the field contains keyword <code>rating</code></li> <li>e.g. <code>:?rating%</code> will match the field starts with keyword <code>rating</code></li> </ul> </li> <li><code>:!?</code> does not match a pattern, case insensitive. negative version of <code>:?</code>.</li> <li><code>:~</code>  matches POSIX regular expression, case insensitive. Use Postgresql <a href=\"https://www.postgresql.org/docs/9.6/functions-matching.html#FUNCTIONS-POSIX-REGEXP\">~*</a> operator</li> <li><code>:!~</code> does not match POSIX regular expression, case insensitive. negative version of <code>:~</code>.</li> <li><code>:&gt;</code>  greater than</li> <li><code>:&gt;=</code> greater than or equal to</li> <li><code>:&lt;</code>  less than</li> <li><code>:&lt;=</code> less than or equal to</li> <li><code>:&lt;|</code> the field is an array value and contains the value</li> <li><code>:!&lt;|</code> the field is not an array value or not contains the value</li> </ul> <p>Example URL with aspectQuery <code>dcat-dataset-strings.title:?%rating%</code> (Search keyword <code>rating</code> in <code>dcat-dataset-strings</code> aspect <code>title</code> field)</p> <p><code>/v0/records?limit=100&amp;optionalAspect=source&amp;aspect=dcat-dataset-strings&amp;aspectQuery=dcat-dataset-strings.title:?%2525rating%2525</code></p> <p>Please note: when both <code>aspectQuery</code> and <code>aspectOrQuery</code> present, query conditions generated from <code>aspectQuery</code> and <code>aspectOrQuery</code> will be joined with <code>AND</code></p> <p>e.g. For the following <code>aspectQuery</code> &amp; <code>aspectOrQuery</code> queries are specified:</p> <ul> <li><code>aspectQuery</code>: <ul> <li>q1</li> <li>q2</li> </ul> </li> <li><code>aspectOrQuery</code>: <ul> <li>q3</li> <li>q4</li> </ul> </li> </ul> <p>The generated query conditions will be <code>((q1 AND q2) AND (q3 OR q4))</code> <br/><br/></p> <p>e.g. For the following <code>aspectQuery</code> &amp; <code>aspectOrQuery</code> queries are specified:</p> <ul> <li><code>aspectQuery</code>: <ul> <li>q1</li> <li>q2</li> </ul> </li> <li><code>aspectOrQuery</code>: <ul> <li>q3</li> </ul> </li> </ul> <p>The generated query conditions will be <code>((q1 AND q2) AND q3 )</code>. This is equivalent to set <code>aspectQuery</code> only as <code>q1</code>, <code>q2</code> and <code>q3</code>. <br/><br/><br/></p> <p>NOTE: This is an early stage API and may change greatly in the future.</p>"
          },
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "aspectOrQuery",
            "description": "<p>Filter the records returned by a value within the aspect JSON.</p> <p>Expressed as string concatenation of:</p> <ul> <li><code>aspectId.path.to.field</code></li> <li><code>operator</code></li> <li><code>value</code> Except <code>operator</code>, all parts must be encoded as <code>application/x-www-form-urlencoded</code> MIME format.</li> </ul> <p>If more than one queries is passed through <code>aspectOrQuery</code> parameters, they will be grouped with <code>OR</code> logic.</p> <p><code>aspectOrQuery</code> supports the same operator list as <code>aspectQuery</code>.</p> <p>NOTE: This is an early stage API and may change greatly in the future</p>"
          },
          {
            "group": "query",
            "type": "string",
            "optional": false,
            "field": "orderBy",
            "description": "<p>Specify the field to sort the result. Aspect field can be supported in a format like aspectId.path.to.field.</p> <p>If orderBy reference an aspects that is not included by either <code>aspect</code> or <code>optionalAspect</code> parameters, it will be added to the <code>optionalAspect</code> list.</p> <p>Please Note: When <code>pageToken</code> parameter is specified, <code>orderBy</code> is not available. You can set <code>reversePageTokenOrder</code> = <code>true</code> to reverse the pagination order though.</p>"
          },
          {
            "group": "query",
            "type": "string",
            "optional": false,
            "field": "orderByDir",
            "description": "<p>Specify the order by direction. Either <code>asc</code> or <code>desc</code>. <code>desc</code> order is the default.</p>"
          },
          {
            "group": "query",
            "type": "boolean",
            "optional": false,
            "field": "orderNullFirst",
            "description": "<p>Specify whether nulls appear before (<code>true</code>) or after (<code>false</code>) non-null values in the sort ordering. Default to <code>false</code>.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the record detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n     \"hasMore\": true,\n     \"nextPageToken\": \"2344\",\n     \"records\": [\n         {\n             \"id\": \"string\",\n             \"name\": \"string\",\n             \"aspects\": {},\n             \"sourceTag\": \"string\"\n         }\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsServiceRO.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "GetV0RegistryRecords",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Service",
    "type": "get",
    "url": "/v0/registry/records/count",
    "title": "Get the count of records matching the parameters",
    "description": "<p>Get the count of records matching the parameters. If no parameters are specified, the count will be approximate for performance reasons.</p>",
    "parameter": {
      "fields": {
        "query": [
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "q",
            "description": "<p>Full text search querytext. You can supply keywords or phrases for full text search against all possible fields of all aspect data.</p> <p>The full text search querytext leverages <a href=\"https://www.postgresql.org/docs/13/textsearch-controls.html#TEXTSEARCH-PARSING-QUERIES\">websearch_to_tsquery</a> to parse user querytext into a valid text search query. The following syntax is supported:</p> <ul> <li>unquoted text: text not inside quote marks will be converted to terms separated by &amp; operators, as if processed by plainto_tsquery.</li> <li>&quot;quoted text&quot;: text inside quote marks will be converted to terms separated by &lt;-&gt; operators, as if processed by phraseto_tsquery.</li> <li>OR: the word “or” will be converted to the | operator.</li> <li>-: a dash will be converted to the ! operator.</li> </ul> <p>Other punctuation is ignored. tsquery operators, weight labels, or prefix-match labels in its input will not be recognized.</p> <p>For simple usage, you can simply supply keywords that you want the search result (i.e. record) matched.</p> <p>The full text search function will cover all field values in all aspect data, plus record id and aspect id.</p> <p>Please note: the record name field on records table will not be covered for the performance reason.</p>"
          },
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "aspect",
            "description": "<p>The aspects for which to retrieve data, specified as multiple occurrences of this query parameter. Only records that have all of these aspects will be included in the response.</p>"
          },
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "aspectQuery",
            "description": "<p>Filter the records returned by a value within the aspect JSON.</p> <p>Expressed as string concatenation of:</p> <ul> <li><code>aspectId.path.to.field</code></li> <li><code>operator</code></li> <li><code>value</code> Except <code>operator</code>, all parts must be encoded as <code>application/x-www-form-urlencoded</code> MIME format before encoded as query string parameter value.</li> </ul> <p>A sample query string encoding implementation is available <a href=\"https://gist.github.com/t83714/db1725a347c07413c16803a77da13003\">here</a>.</p> <p>If more than one queries is passed through the <code>aspectQuery</code> parameters, they will be grouped with <code>AND</code> logic.</p> <p>Support the following operators in aspectQuery or <code>aspectOrQuery</code>:</p> <ul> <li><code>:</code> equal</li> <li><code>:!</code>  not equal</li> <li><code>:?</code>  matches a pattern, case insensitive. Use Postgresql <a href=\"https://www.postgresql.org/docs/9.6/functions-matching.html#FUNCTIONS-LIKE\">ILIKE</a> operator. <ul> <li>e.g. <code>:?%rating%</code> will match the field contains keyword <code>rating</code></li> <li>e.g. <code>:?rating%</code> will match the field starts with keyword <code>rating</code></li> </ul> </li> <li><code>:!?</code> does not match a pattern, case insensitive. Use Postgresql <a href=\"https://www.postgresql.org/docs/9.6/functions-matching.html#FUNCTIONS-LIKE\">NOT ILIKE</a> operator</li> <li><code>:~</code>  matches POSIX regular expression, case insensitive. Use Postgresql <a href=\"https://www.postgresql.org/docs/9.6/functions-matching.html#FUNCTIONS-POSIX-REGEXP\">~*</a> operator</li> <li><code>:!~</code> does not match POSIX regular expression, case insensitive. Use Postgresql <a href=\"https://www.postgresql.org/docs/9.6/functions-matching.html#FUNCTIONS-POSIX-REGEXP\">!~*</a> operator</li> <li><code>:&gt;</code>  greater than</li> <li><code>:&gt;=</code> greater than or equal to</li> <li><code>:&lt;</code>  less than</li> <li><code>:&lt;=</code> less than or equal to</li> <li><code>:&lt;|</code> the field is an array value and contains the value</li> <li><code>:!&lt;|</code> the field is not an array value or not contains the value</li> </ul> <p>Example URL with aspectQuery <code>dcat-dataset-strings.title:?%rating%</code> (Search keyword <code>rating</code> in <code>dcat-dataset-strings</code> aspect <code>title</code> field)</p> <p><code>/v0/records?limit=100&amp;optionalAspect=source&amp;aspect=dcat-dataset-strings&amp;aspectQuery=dcat-dataset-strings.title:?%2525rating%2525</code></p> <p>Please note: when both <code>aspectQuery</code> and <code>aspectOrQuery</code> present, query conditions generated from <code>aspectQuery</code> and <code>aspectOrQuery</code> will be joined with <code>AND</code></p> <p>e.g. For the following <code>aspectQuery</code> &amp; <code>aspectOrQuery</code> queries are specified:</p> <ul> <li><code>aspectQuery</code>: <ul> <li>q1</li> <li>q2</li> </ul> </li> <li><code>aspectOrQuery</code>: <ul> <li>q3</li> <li>q4</li> </ul> </li> </ul> <p>The generated query conditions will be <code>((q1 AND q2) AND (q3 OR q4))</code> <br/><br/></p> <p>e.g. For the following <code>aspectQuery</code> &amp; <code>aspectOrQuery</code> queries are specified:</p> <ul> <li><code>aspectQuery</code>: <ul> <li>q1</li> <li>q2</li> </ul> </li> <li><code>aspectOrQuery</code>: <ul> <li>q3</li> </ul> </li> </ul> <p>The generated query conditions will be <code>((q1 AND q2) AND q3 )</code>. This is equivalent to set <code>aspectQuery</code> only as <code>q1</code>, <code>q2</code> and <code>q3</code>. <br/><br/><br/> NOTE: This is an early stage API and may change greatly in the future.</p>"
          },
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "aspectOrQuery",
            "description": "<p>Filter the records returned by a value within the aspect JSON.</p> <p>Expressed as string concatenation of:</p> <ul> <li><code>aspectId.path.to.field</code></li> <li><code>operator</code></li> <li><code>value</code> Except <code>operator</code>, all parts must be encoded as <code>application/x-www-form-urlencoded</code> MIME format.</li> </ul> <p>If more than one queries is passed through <code>aspectOrQuery</code> parameters, they will be grouped with <code>OR</code> logic.</p> <p><code>aspectOrQuery</code> supports the same operator list as <code>aspectQuery</code>.</p> <p>NOTE: This is an early stage API and may change greatly in the future</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the record count</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"count\": 0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsServiceRO.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "GetV0RegistryRecordsCount",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Service",
    "type": "get",
    "url": "/v0/registry/records/{id}",
    "title": "Get a record by ID",
    "description": "<p>Gets a complete record, including data for all aspects.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the record to be fetched.</p>"
          }
        ],
        "query": [
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "aspect",
            "description": "<p>The aspects for which to retrieve data, specified as multiple occurrences of this query parameter. Only records that have all of these aspects will be included in the response.</p>"
          },
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "optionalAspect",
            "description": "<p>The optional aspects for which to retrieve data, specified as multiple occurrences of this query parameter. These aspects will be included in a record if available, but a record will be included even if it is missing these aspects.</p>"
          },
          {
            "group": "query",
            "type": "boolean",
            "optional": false,
            "field": "dereference",
            "description": "<p>true to automatically dereference links to other records; false to leave them as links. Dereferencing a link means including the record itself where the link would be. Dereferencing only happens one level deep, regardless of the value of this parameter.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the record detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n    \"id\": \"string\",\n    \"name\": \"string\",\n    \"aspects\": {\n     \"aspect1\": {},\n     \"aspect2\": {}\n    },\n    \"sourceTag\": \"string\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsServiceRO.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "GetV0RegistryRecordsId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Service",
    "type": "get",
    "url": "/v0/registry/records/inFull/{id}",
    "title": "Get a record with all attached aspects data by the record ID",
    "description": "<p>Gets a record by ID including all attached aspect data.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the record to be fetched.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the record summary detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"aspects\": {\n     \"aspect1\": {},\n     \"aspect2\": {}\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsServiceRO.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "GetV0RegistryRecordsInfullId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "0": "p",
    "1": "r",
    "2": "i",
    "3": "v",
    "4": "a",
    "5": "t",
    "6": "e",
    "group": "Registry_Record_Service",
    "type": "get",
    "url": "/v0/registry/records/pagetokens",
    "title": "Get a list tokens for paging through the records",
    "description": "<p>Get a list tokens for paging through the records</p>",
    "parameter": {
      "fields": {
        "query": [
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "aspect",
            "description": "<p>The aspects for which to retrieve data, specified as multiple occurrences of this query parameter. Only records that have all of these aspects will be included in the response.</p>"
          },
          {
            "group": "query",
            "type": "number",
            "optional": false,
            "field": "limit",
            "description": "<p>The size of each page to get tokens for.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>a list of page token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "[\n   \"string\"\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsServiceRO.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "GetV0RegistryRecordsPagetokens",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Service",
    "type": "get",
    "url": "/v0/registry/records/summary",
    "title": "Get a list of all records as summaries",
    "description": "<p>Get a list of all records as summaries</p>",
    "parameter": {
      "fields": {
        "query": [
          {
            "group": "query",
            "type": "string[]",
            "optional": false,
            "field": "q",
            "description": "<p>Full text search querytext. You can supply keywords or phrases for full text search against all possible fields of all aspect data.</p> <p>The full text search querytext leverages <a href=\"https://www.postgresql.org/docs/13/textsearch-controls.html#TEXTSEARCH-PARSING-QUERIES\">websearch_to_tsquery</a> to parse user querytext into a valid text search query. The following syntax is supported:</p> <ul> <li>unquoted text: text not inside quote marks will be converted to terms separated by &amp; operators, as if processed by plainto_tsquery.</li> <li>&quot;quoted text&quot;: text inside quote marks will be converted to terms separated by &lt;-&gt; operators, as if processed by phraseto_tsquery.</li> <li>OR: the word “or” will be converted to the | operator.</li> <li>-: a dash will be converted to the ! operator.</li> </ul> <p>Other punctuation is ignored. tsquery operators, weight labels, or prefix-match labels in its input will not be recognized.</p> <p>For simple usage, you can simply supply keywords that you want the search result (i.e. record) matched.</p> <p>The full text search function will cover all field values in all aspect data, plus record id and aspect id.</p> <p>Please note: the record name field on records table will not be covered for the performance reason.</p>"
          },
          {
            "group": "query",
            "type": "string",
            "optional": false,
            "field": "pageToken",
            "description": "<p>A token that identifies the start of a page of results. This token should not be interpreted as having any meaning, but it can be obtained from a previous page of results.</p>"
          },
          {
            "group": "query",
            "type": "boolean",
            "optional": false,
            "field": "reversePageTokenOrder",
            "description": "<p>When pagination via pageToken, by default, records with smaller pageToken (i.e. older records) will be returned first. When this parameter is set to <code>true</code>, higher pageToken records (newer records) will be returned.</p>"
          },
          {
            "group": "query",
            "type": "number",
            "optional": false,
            "field": "start",
            "description": "<p>The index of the first record to retrieve. When possible, specify pageToken instead as it will result in better performance. If this parameter and pageToken are both specified, this parameter is interpreted as the index after the pageToken of the first record to retrieve.</p>"
          },
          {
            "group": "query",
            "type": "number",
            "optional": false,
            "field": "limit",
            "description": "<p>The maximum number of records to receive. The response will include a token that can be passed as the pageToken parameter to a future request to continue receiving results where this query leaves off.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the record summary</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "[\n      {\n          \"id\": \"string\",\n          \"name\": \"string\",\n          \"aspects\": [\n            \"string\",\n            \"string\"\n          ]\n      }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsServiceRO.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "GetV0RegistryRecordsSummary",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Service",
    "type": "get",
    "url": "/v0/registry/records/summary/{id}",
    "title": "Get a summary record by ID",
    "description": "<p>Gets a summary record, including all the aspect ids for which this record has data.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the record to be fetched.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the record summary detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"aspects\": [\n    \"aspect1\",\n    \"aspect2\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsServiceRO.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "GetV0RegistryRecordsSummaryId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Service",
    "type": "patch",
    "url": "/v0/registry/records",
    "title": "Modify a list of records by applying the same JSON Patch",
    "description": "<p>The patch should follow IETF RFC 6902 (https://tools.ietf.org/html/rfc6902).</p>",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "string[]",
            "optional": false,
            "field": "recordIds",
            "description": "<p>a list of record IDs of records to be patched</p>"
          },
          {
            "group": "body",
            "type": "object[]",
            "optional": false,
            "field": "jsonPatch",
            "description": "<p>The RFC 6902 patch to apply to the aspect.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n  \"recordIds\": [\"dsd-sds-xsds-22\", \"sds-sdds-2334-dds-34\", \"sdds-3439-34334343\"],\n  \"jsonPatch\": [\n     // update record's name field\n     {\n       \"op\": \"replace\",\n       \"path\": \"/name\",\n       \"value\": \"a new record name\"\n     },\n     // update the record's `publishing` aspect `state` field\n     {\n       \"op\": \"replace\",\n       \"path\": \"/aspects/publishing/state\",\n       \"value\": \"published\"\n     },\n     // remove the record's `dataset-draft` aspect\n     {\n       \"op\": \"remove\",\n       \"path\": \"/aspects/dataset-draft\"\n     },\n     // add a \"title\" field to the record's `dcat-dataset-strings` aspect\n     {\n       \"op\": \"add\",\n       \"path\": \"/aspects/dcat-dataset-strings/title\",\n       \"value\": \"test dataset\"\n     }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          },
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>a list of event id for each of the record after applied the json pathes</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "[122, 123, 124]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsService.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "PatchV0RegistryRecords",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Service",
    "type": "patch",
    "url": "/v0/registry/records/{id}",
    "title": "Modify a record by applying a JSON Patch",
    "description": "<p>The patch should follow IETF RFC 6902 (https://tools.ietf.org/html/rfc6902).</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the record to be patched.</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "json",
            "optional": false,
            "field": "recordPatch",
            "description": "<p>The RFC 6902 patch to apply to the aspect.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "[\n   // update record's name field\n   {\n     \"op\": \"replace\",\n     \"path\": \"/name\",\n     \"value\": \"a new record name\"\n   },\n   // update the record's `publishing` aspect `state` field\n   {\n     \"op\": \"replace\",\n     \"path\": \"/aspects/publishing/state\",\n     \"value\": \"published\"\n   },\n   // remove the record's `dataset-draft` aspect\n   {\n     \"op\": \"remove\",\n     \"path\": \"/aspects/dataset-draft\"\n   },\n   // add a \"title\" field to the record's `dcat-dataset-strings` aspect\n   {\n     \"op\": \"add\",\n     \"path\": \"/aspects/dcat-dataset-strings/title\",\n     \"value\": \"test dataset\"\n   }\n]",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          },
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "x-magda-event-id",
            "description": "<p>This is a <strong>response header</strong> that is <strong>ONLY</strong> available when the operation is completed successfully. If the operation did make changes and triggered an event, the header value will be the eventId. Otherwise (i.e. no change are made), this header value will be &quot;0&quot;.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the record detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"jsonSchema\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsService.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "PatchV0RegistryRecordsId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Record_Service",
    "type": "post",
    "url": "/v0/registry/records",
    "title": "Create a new record",
    "description": "<p>Create a new record</p>",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "json",
            "optional": false,
            "field": "record",
            "description": "<p>The definition of the new record.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n   \"id\": \"string\",\n   \"name\": \"string\",\n   \"aspects\": {},\n   \"sourceTag\": \"string\"\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          },
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "x-magda-event-id",
            "description": "<p>This is a <strong>response header</strong> that is <strong>ONLY</strong> available when the operation is completed successfully. If the operation did make changes and triggered an event, the header value will be the eventId. Otherwise (i.e. no change are made), this header value will be &quot;0&quot;.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the record created</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n    \"id\": \"string\",\n    \"name\": \"string\",\n    \"aspects\": {},\n    \"sourceTag\": \"string\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "type": "string",
            "optional": false,
            "field": "Response",
            "description": "<p>could not create</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsService.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "PostV0RegistryRecords"
  },
  {
    "group": "Registry_Record_Service",
    "type": "put",
    "url": "/v0/registry/records/{id}",
    "title": "Modify a record by ID",
    "description": "<p>Modifies a record. Aspects included in the request are created or updated, but missing aspects are not removed.</p>",
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the record to be fetched.</p>"
          }
        ],
        "query": [
          {
            "group": "query",
            "type": "boolean",
            "optional": true,
            "field": "merge",
            "description": "<p>Whether merge with existing aspect data or replace it. Default: <code>false</code></p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "json",
            "optional": false,
            "field": "record",
            "description": "<p>The record to save.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n   \"id\": \"string\",\n   \"name\": \"string\",\n   \"aspects\": {},\n   \"sourceTag\": \"string\"\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id</p>"
          },
          {
            "group": "Header",
            "type": "number",
            "optional": false,
            "field": "X-Magda-Tenant-Id",
            "description": "<p>Magda internal tenant id</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "x-magda-event-id",
            "description": "<p>This is a <strong>response header</strong> that is <strong>ONLY</strong> available when the operation is completed successfully. If the operation did make changes and triggered an event, the header value will be the eventId. Otherwise (i.e. no change are made), this header value will be &quot;0&quot;.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the record detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n    \"id\": \"string\",\n    \"name\": \"string\",\n    \"aspects\": {},\n    \"sourceTag\": \"string\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/RecordsService.scala",
    "groupTitle": "Registry_Record_Service",
    "name": "PutV0RegistryRecordsId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Webhooks",
    "type": "delete",
    "url": "/v0/registry/hooks/{id}",
    "title": "Delete a web hook",
    "description": "<p>Delete a web hook</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id (JWT Token)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the web hook to delete.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200 JSON Response Body": [
          {
            "group": "Success 200 JSON Response Body",
            "type": "Boolean",
            "optional": false,
            "field": "deleted",
            "description": "<p>indicates deletion result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"deleted\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400 Text Response Body": [
          {
            "group": "Error 400 Text Response Body",
            "type": "text",
            "optional": false,
            "field": "Response",
            "description": "<p>could not delete</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/HooksService.scala",
    "groupTitle": "Registry_Webhooks",
    "name": "DeleteV0RegistryHooksId"
  },
  {
    "group": "Registry_Webhooks",
    "type": "get",
    "url": "/v0/registry/hooks",
    "title": "Get a list of all web hooks",
    "description": "<p>Get a list of all web hooks</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id (JWT Token)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>a list of webhook records</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "[\n {\n   \"id\": \"string\",\n   \"name\": \"string\",\n   \"active\": true,\n   \"lastEvent\": 1232312,\n   \"url\": \"string\",\n   \"eventTypes\": [\n      \"CreateRecord\"\n   ],\n   \"isWaitingForResponse\": false,\n   \"config\": {\n     \"aspects\": [\n       \"string\"\n     ],\n     \"optionalAspects\": [\n       \"string\"\n     ],\n     \"includeEvents\": false,\n     \"includeRecords\": true,\n     \"includeAspectDefinitions\": false,\n     \"dereference\": true\n   },\n   \"enabled\": true,\n   \"lastRetryTime\": \"2018-08-29T07:04:15.711Z\",\n   \"retryCount\": 0,\n   \"isRunning\": true,\n   \"isProcessing\": true\n }\n ...\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/HooksService.scala",
    "groupTitle": "Registry_Webhooks",
    "name": "GetV0RegistryHooks",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Webhooks",
    "type": "get",
    "url": "/v0/registry/hooks/{id}",
    "title": "Get a web hook by ID",
    "description": "<p>Get a web hook by ID</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id (JWT Token)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the web hook to be fetched.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Response",
            "description": "<p>the webhook record</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"active\": true,\n  \"lastEvent\": 1232312,\n  \"url\": \"string\",\n  \"eventTypes\": [\n     \"CreateRecord\"\n  ],\n  \"isWaitingForResponse\": false,\n  \"config\": {\n    \"aspects\": [\n      \"string\"\n    ],\n    \"optionalAspects\": [\n      \"string\"\n    ],\n    \"includeEvents\": false,\n    \"includeRecords\": true,\n    \"includeAspectDefinitions\": false,\n    \"dereference\": true\n  },\n  \"enabled\": true,\n  \"lastRetryTime\": \"2018-08-29T07:04:15.711Z\",\n  \"retryCount\": 0,\n  \"isRunning\": true,\n  \"isProcessing\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/HooksService.scala",
    "groupTitle": "Registry_Webhooks",
    "name": "GetV0RegistryHooksId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Webhooks",
    "type": "post",
    "url": "http://some-remote-host/webhook-notification-recipient-endpoint",
    "title": "Webhook Notification Recipient Endpoint",
    "description": "<p>Once a remote host register an endpoint <code>url</code> as webhook via Registry <code>Create a new web hook</code> API (see the API doc in this section), registry will send notifications as HTTP POST request when any new events are generated in the system. This section specify the expected notifcation request payload from registry and possible responses from the <code>Webhook Notification Recipient</code>.</p>",
    "parameter": {
      "fields": {
        "Request Body JSON": [
          {
            "group": "Request Body JSON",
            "type": "String",
            "allowedValues": [
              "\"records.changed\""
            ],
            "optional": false,
            "field": "action",
            "description": "<p>The webhook action. Currently, will always be fixed string &quot;records.changed&quot;.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Number",
            "optional": false,
            "field": "lastEventId",
            "description": "<p>the id of last event included in this notification.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Object[]",
            "optional": true,
            "field": "events",
            "description": "<p>A array of raw events. Only available when webhook config <code>includeEvents</code> field is set to <code>true</code> when create webhook.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Number",
            "optional": false,
            "field": "events.id",
            "description": "<p>The id of the event.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "events.eventTime",
            "description": "<p>The time stamp of the event. e.g. <code>2018-01-16T09:01:40.776Z</code></p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "allowedValues": [
              "\"CreateRecord\"",
              "\"CreateAspectDefinition\"",
              "\"CreateRecordAspect\"",
              "\"PatchRecord\"",
              "\"PatchAspectDefinition\"",
              "\"PatchRecordAspect\"",
              "\"DeleteRecord\"",
              "\"DeleteAspectDefinition\"",
              "\"DeleteRecordAspect\""
            ],
            "optional": false,
            "field": "events.eventType",
            "description": "<p>The type of the event.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": true,
            "field": "events.userId",
            "description": "<p>The id of the user whose action triggered the event.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Object",
            "optional": false,
            "field": "events.data",
            "description": "<p>The event data. The type of event data depends on event type. Generally, if it's a &quot;Create&quot; type event, the data will be the data of the record or aspect. If it's a &quot;Patch&quot; (i.e. Update) type event, the data will be <a href=\"http://jsonpatch.com/\">jsonpatch</a> format to specify the changes. If it's a &quot;Delete&quot; type event, the data will be id of the record (or aspect) to be impacted.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Number",
            "optional": false,
            "field": "events.tenantId",
            "description": "<p>The tenant id of the event. Unless multi-tenant feature is turned on, the value of this field will always be <code>0</code>.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Object[]",
            "optional": true,
            "field": "records",
            "description": "<p>A array of relevant records. Only available when webhook config <code>includeRecords</code> field is set to <code>true</code> when create webhook.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "records.id",
            "description": "<p>The id of the record.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "records.name",
            "description": "<p>The name of the record.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Object",
            "optional": false,
            "field": "records.aspects",
            "description": "<p>An object contains the record's aspects data. The keys of the object will be IDs of aspects.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "records.sourceTag",
            "description": "<p>A tag representing the action by the source of this record. (e.g. an id for a individual crawl of a data portal).</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "records.tenantId",
            "description": "<p>The tenant id of the event. Unless multi-tenant feature is turned on, the value of this field will always be <code>0</code>.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Object[]",
            "optional": true,
            "field": "aspectDefinitions",
            "description": "<p>A array of relevant aspect definitions. Only available when webhook config <code>includeAspectDefinitions</code> field is set to <code>true</code> when create webhook.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "aspectDefinitions.id",
            "description": "<p>The ID of the aspect.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "aspectDefinitions.name",
            "description": "<p>The name of the aspect.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Object",
            "optional": false,
            "field": "aspectDefinitions.jsonSchema",
            "description": "<p>JSON schema that used to validate aspect data.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "deferredResponseUrl",
            "description": "<p>An URL that can be used by <code>Webhook Notification Recipient</code> to acknowledge the completion of notification processing at later time. If the <code>Webhook Notification Recipient</code> decides to do so, he needs to respond <code>201</code> status code and JSON data <code>{status: &quot;Working&quot;, deferResponse: true}</code> to defer the response. Also see <code>Acknowledge a previously-deferred web hook</code> API in this section.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Webhook Notification Payload Example",
          "content": "{\n  \"action\": \"records.changed\",\n  \"lastEventId\": 1234443,\n  \"events\": [{\n    \"data\": {\n      \"aspectId\": \"ckan-resource\",\n      \"patch\": [{\n        \"op\": \"remove\",\n        \"path\": \"/webstore_last_updated\"\n      },\n      {\n        \"op\": \"remove\",\n        \"path\": \"/webstore_url\"\n      }],\n      \"recordId\": \"dist-dga-0ca78178-7482-486f-ae85-9cd97c7c97c9\"\n    },\n    \"eventTime\": \"2018-06-16T04:08:57.044Z\",\n    \"eventType\": \"PatchRecordAspect\",\n    \"id\": 8940964,\n    \"tenantId\": 0\n  }],\n  \"records\": [{\n    \"id\": \"dist-dga-0ca78178-7482-486f-ae85-9cd97c7c97c9\",\n    \"name\": \"a test dataset\",\n    \"aspects\": {\n      \"aspect-one\": {...},\n      \"aspect-two\": {...}\n    },\n    \"sourceTag\": \"sds-sdssd-sdsddssd\",\n    \"tenantId\": 0\n  }],\n  \"deferredResponseUrl\": \"http://xxx\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 201 JSON Response Body": [
          {
            "group": "Success 201 JSON Response Body",
            "type": "String",
            "allowedValues": [
              "\"Working\"",
              "\"Received\""
            ],
            "optional": false,
            "field": "status",
            "description": "<p>A status string indicates the notification processing result. When <code>status</code>=<code>Working</code>, <code>deferResponse</code> must set to <code>true</code> --- indicates that <code>Webhook Notification Recipient</code> want to defer the reponse of the notification processing. Otherwise, the <code>Webhook Notification Recipient</code> should respond <code>status</code>=<code>Received</code>, <code>deferResponse</code>= <code>false</code>. Once the <code>Webhook Notification Recipient</code> finish the notification process, he will need to call <code>Acknowledge a previously-deferred web hook</code> API (see in this section) in order to receive next notification.</p>"
          },
          {
            "group": "Success 201 JSON Response Body",
            "type": "Boolean",
            "optional": false,
            "field": "deferResponse",
            "description": "<p>Indicate whether <code>Webhook Notification Recipient</code> want to defer the reponse of the notification processing.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response Without Defer",
          "content": "{\n  \"status\": \"Received\",\n  \"deferResponse\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 500 JSON Response Body": [
          {
            "group": "Error 500 JSON Response Body",
            "type": "String",
            "allowedValues": [
              "\"Error\""
            ],
            "optional": false,
            "field": "status",
            "description": "<p>A status string indicates the notification processing result. As it's an error response, its value should always be &quot;Error&quot;.</p>"
          },
          {
            "group": "Error 500 JSON Response Body",
            "type": "Boolean",
            "optional": false,
            "field": "deferResponse",
            "description": "<p>Indicate whether <code>Webhook Notification Recipient</code> want to defer the reponse of the notification processing. As it's an error response, its value should always be <code>false</code>.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error Response",
          "content": "{\n  \"status\": \"Error\",\n  \"deferResponse\": false\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/HooksService.scala",
    "groupTitle": "Registry_Webhooks",
    "name": "PostHttpSomeRemoteHostWebhookNotificationRecipientEndpoint"
  },
  {
    "group": "Registry_Webhooks",
    "type": "post",
    "url": "/v0/registry/hooks",
    "title": "Create a new web hook",
    "description": "<p>Create a new web hook. Please note: newly created webhook will be set to receive notification after most recent events at the time when the webhook is created, rather than from the first event. Thus, the <code>lastEvent</code> field in the response will unlikely be the first event ID.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id (JWT Token)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Request Body JSON": [
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>The ID of the webhook to be created. The ID string must be unique across the system. If no ID is provided, an UUID will be auto-created.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the webhook to be created.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": false,
            "field": "active",
            "description": "<p>Whether set the webhook to be an active one. Please note: registry will try periodically wake all inactive webhook. If you want to stop the webhook from working forever, please set the <code>enabled</code> field to <code>false</code></p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": false,
            "field": "enabled",
            "description": "<p>Whether enable the webhook. A disabled webhook will never run.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>specify a HTTP url where registry should send notifications to.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Object",
            "optional": false,
            "field": "config",
            "description": "<p>A webhook config object. Fields see below:</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": true,
            "field": "config.includeEvents",
            "description": "<p>Whether include raw events in the webhook notification payload. See sample webhook notification payload below.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": true,
            "field": "config.includeRecords",
            "description": "<p>Whether include relevant records in the webhook notification payload. See sample webhook notification payload below.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": true,
            "field": "config.includeAspectDefinitions",
            "description": "<p>Whether include relevant aspect definitions in the webhook notification payload. See sample webhook notification payload below.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": true,
            "field": "config.dereference",
            "description": "<p>When <code>includeRecords</code> = <code>true</code>, set <code>dereference</code>=<code>true</code> will make registry automatically dereference links to other records when attach relevent records to webhook notification payload.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String[]",
            "optional": true,
            "field": "config.aspects",
            "description": "<p>When <code>includeRecords</code> = <code>true</code>, registry will only include records whose aspects have been impacted by the event according to the aspects list provided here in the webhook notification payload.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String[]",
            "optional": true,
            "field": "config.optionalAspects",
            "description": "<p>When <code>includeRecords</code> = <code>true</code>, registry will also include additional (optional) aspect data in the relevant record data in the webhook notification payload.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String[]",
            "optional": false,
            "field": "eventTypes",
            "description": "<p>specify a list of event types that the webhook's interested in. Possible values are:</p>   <ul>     <li>\"CreateRecord\"</li>     <li>\"CreateAspectDefinition\"</li>     <li>\"CreateRecordAspect\"</li>     <li>\"PatchRecord\"</li>     <li>\"PatchAspectDefinition\"</li>     <li>\"PatchRecordAspect\"</li>     <li>\"DeleteRecord\"</li>     <li>\"DeleteAspectDefinition\"</li>     <li>\"DeleteRecordAspect\"</li>   </ul>   If you are not interested in the raw events in the webhook notification payload (e.g. you set `webhook.config.includeEvents`=`false` to turn it off), you can supply empty array [] here."
          }
        ]
      },
      "examples": [
        {
          "title": "Create WebHook Request Body Example",
          "content": "{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"active\": true,\n  \"url\": \"string\",\n  \"eventTypes\": [\n    \"PatchRecordAspect\"\n  ],\n  \"config\": {\n    \"aspects\": [\n      \"string\"\n    ],\n    \"optionalAspects\": [\n      \"string\"\n    ],\n    \"includeEvents\": false,\n    \"includeRecords\": true,\n    \"includeAspectDefinitions\": false,\n    \"dereference\": true\n  },\n  \"enabled\": true\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>the JSON response body will be the created webhook record in JSON format.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Successful Create WebHook Request Response",
          "content": "{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"active\": true,\n  \"lastEvent\": 1232312,\n  \"url\": \"string\",\n  \"eventTypes\": [\n     \"CreateRecord\"\n  ],\n  \"isWaitingForResponse\": false,\n  \"config\": {\n    \"aspects\": [\n      \"string\"\n    ],\n    \"optionalAspects\": [\n      \"string\"\n    ],\n    \"includeEvents\": false,\n    \"includeRecords\": true,\n    \"includeAspectDefinitions\": false,\n    \"dereference\": true\n  },\n  \"enabled\": true,\n  \"lastRetryTime\": \"2018-08-29T07:04:15.711Z\",\n  \"retryCount\": 0,\n  \"isRunning\": true,\n  \"isProcessing\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/HooksService.scala",
    "groupTitle": "Registry_Webhooks",
    "name": "PostV0RegistryHooks",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Webhooks",
    "type": "post",
    "url": "/v0/registry/hooks/{id}/ack",
    "title": "Acknowledge a previously-deferred web hook",
    "description": "<p>Acknowledges a previously-deferred web hook with a given ID. Acknowledging a previously-POSTed web hook notificaiton will cause the next, if any, to be sent. <code>Webhook Notification Recipient</code> only need to request this endpoint when he previously deferred the response for a web hook notificaiton.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id (JWT Token)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of the web hook to be acknowledged.</p>"
          }
        ],
        "Request Body JSON": [
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": false,
            "field": "succeeded",
            "description": "<p>Whether the web hook notification was processed successfully and the <code>Webhook Notification Recipient</code> is ready for further notifications. <code>false</code> indicates the web hook notification was processed unsuccessfully, the same notification will be repeated.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Number",
            "optional": true,
            "field": "lastEventIdReceived",
            "description": "<p>The ID of the last event received by the <code>Webhook Notification Recipient</code>. This should be the value of the <code>lastEventId</code> property of the web hook notification payload that is being acknowledged.  This value is ignored if <code>succeeded</code> is <code>false</code>.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": true,
            "field": "active",
            "description": "<p>Should the status of webhook be changed to <code>active</code> or <code>inactive</code>. <code>Webhook Notification Recipient</code> normally only want to set this field when the previous processing was failed and want registry pause the notification delivery for a while. Please note: an inactive web hook will be waken up after certain amount of time (By default: 1 hour). This can be configured by registry <code>webhooks.retryInterval</code> option. When the parameter is <code>true</code>, the registry will: 1&gt; set webhook to active (if not active already) 2&gt; clear all running statics (e.g. <code>retrycount</code>) However, registry will not attempt to enable the webhook if it's disabled (<code>enable</code>=false) in database previously. When <code>succeeded</code>=<code>true</code>, we will assume the value of <code>active</code> is true` when it's not specified.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Successful Acknowledgement Request Body Example",
          "content": "{\n  \"succeeded\": true,\n  \"lastEventIdReceived\": 123222\n}",
          "type": "json"
        },
        {
          "title": "Unsuccessfully Acknowledgement Request Body Example",
          "content": "{\n  \"succeeded\": false,\n  \"active\": false // -- optionally pause the further notifcation delivery\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200 JSON Response Body": [
          {
            "group": "Success 200 JSON Response Body",
            "type": "number",
            "optional": false,
            "field": "lastEventIdReceived",
            "description": "<p>the id of last event received.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Success Response",
          "content": "{\n  \"lastEventIdReceived\": 123423\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/HooksService.scala",
    "groupTitle": "Registry_Webhooks",
    "name": "PostV0RegistryHooksIdAck",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Registry_Webhooks",
    "type": "put",
    "url": "/v0/registry/hooks/{id}",
    "title": "Modify a web hook by ID",
    "description": "<p>Modifies the web hook with a given ID. If a web hook with the ID does not yet exist, it is created.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Magda-Session",
            "description": "<p>Magda internal session id (JWT Token)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "path": [
          {
            "group": "path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the web hook to be fetched.</p>"
          }
        ],
        "Request Body JSON": [
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>The ID of the webhook to be created. The ID string must be unique across the system. If no ID is provided, an UUID will be auto-created.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the webhook to be created.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": false,
            "field": "active",
            "description": "<p>Whether set the webhook to be an active one. Please note: registry will try periodically wake all inactive webhook. If you want to stop the webhook from working forever, please set the <code>enabled</code> field to <code>false</code></p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": false,
            "field": "enabled",
            "description": "<p>Whether enable the webhook. A disabled webhook will never run.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>specify a HTTP url where registry should send notifications to.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Object",
            "optional": false,
            "field": "config",
            "description": "<p>A webhook config object. Fields see below:</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": true,
            "field": "config.includeEvents",
            "description": "<p>Whether include raw events in the webhook notification payload. See sample webhook notification payload below.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": true,
            "field": "config.includeRecords",
            "description": "<p>Whether include relevant records in the webhook notification payload. See sample webhook notification payload below.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": true,
            "field": "config.includeAspectDefinitions",
            "description": "<p>Whether include relevant aspect definitions in the webhook notification payload. See sample webhook notification payload below.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "Boolean",
            "optional": true,
            "field": "config.dereference",
            "description": "<p>When <code>includeRecords</code> = <code>true</code>, set <code>dereference</code>=<code>true</code> will make registry automatically dereference links to other records when attach relevent records to webhook notification payload.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String[]",
            "optional": true,
            "field": "config.aspects",
            "description": "<p>When <code>includeRecords</code> = <code>true</code>, registry will only include records whose aspects have been impacted by the event according to the aspects list provided here in the webhook notification payload.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String[]",
            "optional": true,
            "field": "config.optionalAspects",
            "description": "<p>When <code>includeRecords</code> = <code>true</code>, registry will also include additional (optional) aspect data in the relevant record data in the webhook notification payload.</p>"
          },
          {
            "group": "Request Body JSON",
            "type": "String[]",
            "optional": false,
            "field": "eventTypes",
            "description": "<p>specify a list of event types that the webhook's interested in. Possible values are:</p>   <ul>     <li>\"CreateRecord\"</li>     <li>\"CreateAspectDefinition\"</li>     <li>\"CreateRecordAspect\"</li>     <li>\"PatchRecord\"</li>     <li>\"PatchAspectDefinition\"</li>     <li>\"PatchRecordAspect\"</li>     <li>\"DeleteRecord\"</li>     <li>\"DeleteAspectDefinition\"</li>     <li>\"DeleteRecordAspect\"</li>   </ul>   If you are not interested in the raw events in the webhook notification payload (e.g. you set `webhook.config.includeEvents`=`false` to turn it off), you can supply empty array [] here."
          }
        ]
      },
      "examples": [
        {
          "title": "Modify WebHook Request Body Example",
          "content": "{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"active\": true,\n  \"url\": \"string\",\n  \"eventTypes\": [\n    \"PatchRecordAspect\"\n  ],\n  \"config\": {\n    \"aspects\": [\n      \"string\"\n    ],\n    \"optionalAspects\": [\n      \"string\"\n    ],\n    \"includeEvents\": false,\n    \"includeRecords\": true,\n    \"includeAspectDefinitions\": false,\n    \"dereference\": true\n  },\n  \"enabled\": true\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>the JSON response body will be the modified webhook record in JSON format</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Successful Modify WebHook Request Response",
          "content": "{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"active\": true,\n  \"lastEvent\": 1232312,\n  \"url\": \"string\",\n  \"eventTypes\": [\n     \"CreateRecord\"\n  ],\n  \"isWaitingForResponse\": false,\n  \"config\": {\n    \"aspects\": [\n      \"string\"\n    ],\n    \"optionalAspects\": [\n      \"string\"\n    ],\n    \"includeEvents\": false,\n    \"includeRecords\": true,\n    \"includeAspectDefinitions\": false,\n    \"dereference\": true\n  },\n  \"enabled\": true,\n  \"lastRetryTime\": \"2018-08-29T07:04:15.711Z\",\n  \"retryCount\": 0,\n  \"isRunning\": true,\n  \"isProcessing\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-registry-api/src/main/scala/au/csiro/data61/magda/registry/HooksService.scala",
    "groupTitle": "Registry_Webhooks",
    "name": "PutV0RegistryHooksId",
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "ResponseBody",
            "description": "<p>Respone body will contain further information on the error in free text format.</p>"
          }
        ]
      }
    }
  },
  {
    "group": "Search",
    "type": "get",
    "url": "/v0/search/autoComplete",
    "title": "Generate a suggestion list of a dataset field",
    "description": "<p>Returns a suggestion list based on text content of a specified dataset field</p>",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "field",
            "description": "<p>which field will be used to generate the suggestion list; e.g. accessNotes.notes</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "inputString",
            "description": "<p>full text input</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>number of suggestion items to return; If larger than 100, will be capped at 100</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "suggestion[]",
            "description": "<p>a List of suggestion item.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"inputString\": \"asdd\",\n    \"suggestions\": [\n        \"asdd sddsds\",\n        \"asdd ssd sddssd\",\n        \"asdd sdds\",\n        ...\n   ]\n}",
          "type": "any"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-search-api/src/main/scala/au/csiro/data61/magda/api/SearchApi.scala",
    "groupTitle": "Search API",
    "groupDescription": "<p>Search API lets users discover datasets and information about their source organisations.</p>",
    "name": "GetV0SearchAutocomplete"
  },
  {
    "group": "Search",
    "type": "get",
    "url": "/v0/search/datasets",
    "title": "Search Datasets",
    "description": "<p>Returns a list of results.</p>",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "query",
            "description": "<p>full text search query</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "start",
            "defaultValue": "0",
            "description": "<p>index of first result to return</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>number of results to return</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "facetSize",
            "defaultValue": "10",
            "description": "<p>number of facets to return</p>"
          },
          {
            "group": "Query",
            "type": "string[]",
            "optional": true,
            "field": "publisher",
            "description": "<p>filter search query by names of organisations</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "dateFrom",
            "description": "<p>filter datasets by start date of dataset coverage</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "dateTo",
            "description": "<p>filter datasets by end date of dataset coverage</p>"
          },
          {
            "group": "Query",
            "type": "string[]",
            "optional": true,
            "field": "region",
            "description": "<p>filter datasets by regions</p>"
          },
          {
            "group": "Query",
            "type": "string[]",
            "optional": true,
            "field": "format",
            "description": "<p>filter datasets by formats</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "query",
            "description": "<p>Will reflect query specified.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "hitCount",
            "description": "<p>number of total results.</p>"
          },
          {
            "group": "Success 200",
            "type": "Dataset[]",
            "optional": false,
            "field": "dataSets",
            "description": "<p>Result datasets.</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "temporal",
            "description": "<p>Reflects match data coverage dates.</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "temporal.start",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "temporal.start.date",
            "description": "<p>Returns the start date of the earliest matched result in ISO8601 format.</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "temporal.end",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "temporal.end.date",
            "description": "<p>Returns the end date of the latest matched result in ISO8601 format.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "strategy",
            "description": "<p>search strategy used</p>"
          },
          {
            "group": "Success 200",
            "type": "Facets",
            "optional": false,
            "field": "facets",
            "description": "<p>Facets of results. See response of Get Facet Options for more details.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"hitCount\": 948,\n    \"dataSets\": [\n        {\n            \"quality\": 0.6,\n            \"catalog\": \"CSIRO\",\n            \"identifier\": \"...\",\n            \"spatial\": {\n                \"text\": \"Australia\"\n            },\n            \"description\": \"...\",\n            \"indexed\": \"2018-07-13T05:29:03.534Z\",\n            \"landingPage\": \"https://data.gov.au/dataset/...\",\n            \"modified\": \"2017-06-13T05:31:57Z\",\n            \"issued\": \"2017-01-23T22:04:30Z\",\n            \"contactPoint\": { \"identifier\": \"someone@government.gov.au\" },\n            \"languages\": [ \"English\" ],\n            \"temporal\": {\n                \"start\": {\n                    \"text\": \"2016-01-01\"\n                }\n            },\n            \"distributions\": [\n                {\n                    \"format\": \"ESRI REST\",\n                    \"downloadURL\": \"...\",\n                    \"identifier\": \"...\",\n                    \"description\": \"...\",\n                    \"modified\": \"2017-01-24T...\",\n                    \"license\": {...},\n                    \"issued\": \"...\",\n                    \"title\": \"...\"\n                },\n                ...\n            ],\n            publisher\": {\n                \"acronym\": \"..\",\n                \"name\": \"...\",\n                \"identifier\": \"org-...\",\n                \"description\": \"...\",\n                \"imageUrl\": \"...\"\n            },\n            \"keywords\": [ \"Cycling\", ... ],\n            \"title\": \"...\",\n            \"themes\": []\n            ...\n        },\n        ...\n   ],\n   \"query\": {\n       ...\n   },\n   \"temporal\": {\n       ...\n   },\n   \"strategy\": \"...\",\n   ,\n   \"facets\": [\n       ...\n   ]\n}",
          "type": "any"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-search-api/src/main/scala/au/csiro/data61/magda/api/SearchApi.scala",
    "groupTitle": "Search API",
    "groupDescription": "<p>Search API lets users discover datasets and information about their source organisations.</p>",
    "name": "GetV0SearchDatasets"
  },
  {
    "group": "Search",
    "type": "get",
    "url": "/v0/search/datasets/facets",
    "title": "Search Datasets Return Facets",
    "description": "<p>Returns the facets part of dataset search. For more details, see Search Datasets and Get Facet Options.</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "See Search Datasets and Get Facet Options.",
          "type": "any"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-search-api/src/main/scala/au/csiro/data61/magda/api/SearchApi.scala",
    "groupTitle": "Search API",
    "groupDescription": "<p>Search API lets users discover datasets and information about their source organisations.</p>",
    "name": "GetV0SearchDatasetsFacets"
  },
  {
    "group": "Search",
    "type": "get",
    "url": "/v0/search/facets/:facetId/options",
    "title": "Get Facet Options",
    "description": "<p>Returns a list facet options by facet id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"Publisher\"",
              "\"Format\""
            ],
            "optional": false,
            "field": "facetId",
            "description": "<p>id of facet</p>"
          }
        ],
        "Query": [
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "facetQuery",
            "description": "<p>full text search query to search within facets</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "start",
            "defaultValue": "0",
            "description": "<p>index of first result to return</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>number of results to return</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "generalQuery",
            "description": "<p>full text search query to search within datasets</p>"
          },
          {
            "group": "Query",
            "type": "string[]",
            "optional": true,
            "field": "publisher",
            "description": "<p>filter search query by names of organisations</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "dateFrom",
            "description": "<p>filter datasets by start date of dataset coverage</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "dateTo",
            "description": "<p>filter datasets by end date of dataset coverage</p>"
          },
          {
            "group": "Query",
            "type": "string[]",
            "optional": true,
            "field": "region",
            "description": "<p>filter datasets by regions</p>"
          },
          {
            "group": "Query",
            "type": "string[]",
            "optional": true,
            "field": "format",
            "description": "<p>filter datasets by formats</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "hitCount",
            "description": "<p>number of total results.</p>"
          },
          {
            "group": "Success 200",
            "type": "FacetOption[]",
            "optional": false,
            "field": "options",
            "description": "<p>Result facet options.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "options.identifier",
            "description": "<p>facet option id.</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "options.value",
            "description": "<p>facet option label</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "options.hitCount",
            "description": "<p>number of dataset hits</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "options.matched",
            "description": "<p>flag to say whether it matched or not?</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"hitCount\": 948,\n    \"options\": [\n        {\n            \"identifier\": \"...\",\n            \"value\": \"...\",\n            \"hitCount\": 0,\n            \"matched\": false\n        },\n        ...\n   ]\n}",
          "type": "any"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-search-api/src/main/scala/au/csiro/data61/magda/api/SearchApi.scala",
    "groupTitle": "Search API",
    "groupDescription": "<p>Search API lets users discover datasets and information about their source organisations.</p>",
    "name": "GetV0SearchFacetsFacetidOptions"
  },
  {
    "group": "Search",
    "type": "get",
    "url": "/v0/search/organisations",
    "title": "Search Organisations",
    "description": "<p>Returns a list of results.</p>",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "query",
            "description": "<p>full text search query</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "start",
            "defaultValue": "0",
            "description": "<p>index of first result to return</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>number of results to return</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "hitCount",
            "description": "<p>number of total results.</p>"
          },
          {
            "group": "Success 200",
            "type": "Organisation[]",
            "optional": false,
            "field": "organisations[]",
            "description": "<p>Result organisations.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"hitCount\": 948,\n    \"organisations\": [\n        {\n            \"acronym\": \"...\",\n            \"name\": \"...\",\n            \"email\": \"...@...\",\n            \"identifier\": \"...\",\n            \"addrState\": \"...\",\n            \"datasetCount\": 2,\n            \"addrSuburb\": \"...\",\n            \"addrStreet\": \"...\",\n            \"addrPostCode\": \"...\",\n            \"phone\": \"...\",\n            \"addrCountry\": \"Australia\"\n        },\n        ...\n   ]\n}",
          "type": "any"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-search-api/src/main/scala/au/csiro/data61/magda/api/SearchApi.scala",
    "groupTitle": "Search API",
    "groupDescription": "<p>Search API lets users discover datasets and information about their source organisations.</p>",
    "name": "GetV0SearchOrganisations"
  },
  {
    "group": "Search",
    "type": "get",
    "url": "/v0/search/region-types",
    "title": "Get Region Types",
    "description": "<p>Returns a list of region types</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "comments",
            "description": "<p>Notes for programmers.</p>"
          },
          {
            "group": "Success 200",
            "type": "RegionWMSMap[]",
            "optional": false,
            "field": "regionWmsMap",
            "description": "<p>A mapping of string to WMS layer metadata.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"comments\": \"...\",\n    \"regionWmsMap\": {\n        \"STE\": {\n            \"layerName\": \"FID_STE_2011_AUST\",\n            \"server\": \"https://vector-tiles.terria.io/FID_STE_2011_AUST/{z}/{x}/{y}.pbf\",\n            \"regionProp\": \"STE_CODE11\",\n            ...\n        },\n        ...\n    }\n}",
          "type": "any"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-search-api/src/main/scala/au/csiro/data61/magda/api/SearchApi.scala",
    "groupTitle": "Search API",
    "groupDescription": "<p>Search API lets users discover datasets and information about their source organisations.</p>",
    "name": "GetV0SearchRegionTypes"
  },
  {
    "group": "Search",
    "type": "get",
    "url": "/v0/search/regions",
    "title": "Get Regions",
    "description": "<p>Returns a list of regions</p>",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "regionId",
            "defaultValue": "None",
            "description": "<p>filter by regionId field</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "type",
            "defaultValue": "None",
            "description": "<p>filter by regionType field</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "lv1Id",
            "defaultValue": "None",
            "description": "<p>filter by level 1 region Id</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "lv2Id",
            "defaultValue": "None",
            "description": "<p>filter by level 2 region Id</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "lv3Id",
            "defaultValue": "None",
            "description": "<p>filter by level 3 region Id</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "lv4Id",
            "defaultValue": "None",
            "description": "<p>filter by level 4 region Id</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "lv5Id",
            "defaultValue": "None",
            "description": "<p>filter by level 5 region Id</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "start",
            "defaultValue": "0",
            "description": "<p>index of first item to return</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>number of items to return</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "hitCount",
            "description": "<p>number of total results.</p>"
          },
          {
            "group": "Success 200",
            "type": "Region[]",
            "optional": false,
            "field": "regions",
            "description": "<p>Region items.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"hitCount\": 0,\n    \"regions\": []\n}",
          "type": "any"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-search-api/src/main/scala/au/csiro/data61/magda/api/SearchApi.scala",
    "groupTitle": "Search API",
    "groupDescription": "<p>Search API lets users discover datasets and information about their source organisations.</p>",
    "name": "GetV0SearchRegions"
  },
  {
    "group": "Sitemaps",
    "type": "get",
    "url": "/sitemap/dataset/afterToken/{pageToken}.xml",
    "title": "Sitemaps index entry for datasets",
    "description": "<p>The sitemaps entrypoint <code>/sitemap.xml</code> contains links to all index entries for datasets (paginated by the <code>pageToken</code> parameter). Each index entry contains a list of dataset page links. You can either visit the dataset page directly (A text based SEO friendly view will be shown if the <code>User-Agent</code> request header is <a href=\"https://github.com/magda-io/magda/blob/main/magda-web-server/src/shouldRenderCrawlerView.ts#L20\">recognised as search engine bot</a>). Or extract the dataset ID from the dataset page link and access the detailed metadata in JSON format via the <a href=\"#api-Registry_Record_Service-GetV0RegistryRecordsId\">registry get a record by ID API</a>.</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n  <urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:news=\"http://www.google.com/schemas/sitemap-news/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\" xmlns:video=\"http://www.google.com/schemas/sitemap-video/1.1\">\n      <url>\n          <loc>https://example.com/dataset/ds-a3d075b9-70d7-40b3-a693-70db2a415765</loc>\n          <changefreq>weekly</changefreq>\n      </url>\n  </urlset>",
          "type": "xml"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-web-server/src/buildSitemapRouter.ts",
    "groupTitle": "Sitemaps",
    "name": "GetSitemapDatasetAftertokenPagetokenXml"
  },
  {
    "group": "Sitemaps",
    "type": "get",
    "url": "/sitemap/main.xml",
    "title": "Sitemaps index entry for the home page",
    "description": "<p>Sitemaps index entry for the home page</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n  <urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:news=\"http://www.google.com/schemas/sitemap-news/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\" xmlns:video=\"http://www.google.com/schemas/sitemap-video/1.1\">\n      <url>\n          <loc>https://example.com/</loc>\n          <changefreq>daily</changefreq>\n      </url>\n  </urlset>",
          "type": "xml"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-web-server/src/buildSitemapRouter.ts",
    "groupTitle": "Sitemaps",
    "name": "GetSitemapMainXml"
  },
  {
    "group": "Sitemaps",
    "type": "get",
    "url": "/sitemap.xml",
    "title": "Sitemaps entrypoint",
    "description": "<p>A <a href=\"https://www.sitemaps.org/protocol.html\">sitemaps protocol interface</a> that is prepared for external search engines to harvest datasets from Magda. The sitemap index is produced based on the live data in the metadata store database. By default, the sitemap index will be cached for 86400 seconds (24 hours). This setting can be adjusted via <code>sitemapCacheSeconds</code> of <a href=\"https://github.com/magda-io/magda/tree/main/deploy/helm/internal-charts/web-server\">web-server</a> module helm chart. Please note: 1&gt; due to the cache and the search engine indexing delay, the total number of datasets in the sitemap index may be different from the dataset total count from the search API. 2&gt; This sitemaps endpoint is recorded on the default /robots.txt endpoint that follows the <a href=\"https://en.wikipedia.org/wiki/Robots_exclusion_standard#About_the_standard\">Robots Exclusion Standard</a>. 3&gt; Only public datasets are included in the sitemaps. In fact, the sitemaps index is generated with anonymous user access.</p>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n  <sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n      <sitemap>\n          <loc>https://example.com/sitemap/main.xml</loc>\n      </sitemap>\n      <sitemap>\n          <loc>https://example.com/sitemap/dataset/afterToken/0.xml</loc>\n      </sitemap>\n   </sitemapindex>",
          "type": "xml"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-web-server/src/buildSitemapRouter.ts",
    "groupTitle": "Sitemaps",
    "name": "GetSitemapXml"
  },
  {
    "group": "Storage",
    "type": "delete",
    "url": "/v0/storage/{bucket}/{filePath}",
    "title": "Request to delete an object at {bucket} with path {filePath}",
    "description": "<p>Deletes an object. This is a hard delete, and cannot be undone. Please note: Besides users have <code>storage/object/delete</code> permission, a user also has access to a file when:</p> <ul> <li>the file is associated with a record</li> <li>the user has <code>object/record/delete</code> permission to an existing record.</li> </ul>",
    "parameter": {
      "fields": {
        "Request path": [
          {
            "group": "Request path",
            "type": "string",
            "optional": false,
            "field": "bucket",
            "description": "<p>The name of the bucket where the object resides</p>"
          },
          {
            "group": "Request path",
            "type": "string",
            "optional": false,
            "field": "filePath",
            "description": "<p>The name of the object to be deleted</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    // when `false`, indicate the storage object doesn't exist. Thus, no need for deletion.\n    \"deleted\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "500",
          "content": "{\n    \"message\": \"Encountered error while deleting file. This has been logged and we are looking into this.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-storage-api/src/createApiRouter.ts",
    "groupTitle": "Storage API",
    "name": "DeleteV0StorageBucketFilepath"
  },
  {
    "group": "Storage",
    "type": "get",
    "url": "/v0/storage/{bucket}/{path}",
    "title": "Request to download an object in {bucket} at path {path}",
    "description": "<p>Downloads an object Please note: Besides users have <code>storage/object/read</code> permission, a user also has access to a file when:</p> <ul> <li>the file is associated with a record</li> <li>the user has <code>object/record/read</code> permission to an existing record.</li> </ul>",
    "parameter": {
      "fields": {
        "Request path": [
          {
            "group": "Request path",
            "type": "string",
            "optional": false,
            "field": "bucket",
            "description": "<p>The name of the bucket under which the requested object is</p>"
          },
          {
            "group": "Request path",
            "type": "string",
            "optional": false,
            "field": "path",
            "description": "<p>The name of the object being requested</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "<Contents of a file>",
          "type": "binary"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "404",
          "content": "\"No such object with path {path} in bucket {bucket}\"",
          "type": "text"
        },
        {
          "title": "500",
          "content": "\"Unknown error\"",
          "type": "text"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-storage-api/src/createApiRouter.ts",
    "groupTitle": "Storage API",
    "name": "GetV0StorageBucketPath"
  },
  {
    "group": "Storage",
    "type": "post",
    "url": "/v0/storage/upload/{bucket}/{path}",
    "title": "Request to upload a file to {bucket}, in the directory {path}",
    "description": "<p>Uploads a object (file) as &quot;form post&quot; Please note: Besides users have <code>storage/object/upload</code> permission, a user also has access to a file when:</p> <ul> <li>the file is associated with a record</li> <li>the user has <code>object/record/update</code> or <code>object/record/create</code> permission to an existing record.</li> </ul>",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "File[]",
            "optional": false,
            "field": "a",
            "description": "<p>list of file attachment. Please note: we only allow one file to be uploaded for one API call</p>"
          }
        ],
        "Request path": [
          {
            "group": "Request path",
            "type": "string",
            "optional": false,
            "field": "bucket",
            "description": "<p>The name of the bucket to which to upload to</p>"
          },
          {
            "group": "Request path",
            "type": "string",
            "optional": false,
            "field": "path",
            "description": "<p>The path in the bucket to put the file in</p>"
          }
        ],
        "Request query": [
          {
            "group": "Request query",
            "type": "string",
            "optional": false,
            "field": "recordId",
            "description": "<p>A record id to associate this file with - a user will only be allowed to access this file if they're also allowed to access the associated record. Should be url encoded.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200 Successfully uploaded 2 files.",
          "content": "{\n     \"etag\": \"cafbab71cd98120b777799598f0d4808-1\",\n     \"versionId\": \"xxx-xxx-323x-xx-xx33\"\n}",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "500",
          "content": "Internal server error.",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-storage-api/src/createApiRouter.ts",
    "groupTitle": "Storage API",
    "name": "PostV0StorageUploadBucketPath"
  },
  {
    "group": "Storage",
    "type": "put",
    "url": "/v0/storage/{bucket}/{filePath}?{recordId}",
    "title": "Request to upload an object to {bucket} with name {filePath}",
    "description": "<p>Uploads an object. Please note: Besides users have <code>storage/object/upload</code> permission, a user also has access to a file when:</p> <ul> <li>the file is associated with a record</li> <li>the user has <code>object/record/update</code> or <code>object/record/create</code> permission to an existing record.</li> </ul>",
    "parameter": {
      "fields": {
        "Request path": [
          {
            "group": "Request path",
            "type": "string",
            "optional": false,
            "field": "bucket",
            "description": "<p>The name of the bucket to which to upload to</p>"
          },
          {
            "group": "Request path",
            "type": "string",
            "optional": false,
            "field": "filePath",
            "description": "<p>The path of the file to delete</p>"
          }
        ],
        "Request query": [
          {
            "group": "Request query",
            "type": "string",
            "optional": false,
            "field": "recordId",
            "description": "<p>A record id to associate this file with - a user will only be allowed to access this file if they're also allowed to access the associated record. Should be url encoded.</p>"
          },
          {
            "group": "Request query",
            "type": "string",
            "optional": true,
            "field": "orgUnitId",
            "description": "<p>(Optional) The id of the orgUnit that the bucket belongs to.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n    \"message\":\"File uploaded successfully\",\n    \"etag\":\"edd88378a7900bf663a5fa386386b585-1\",\n    \"versionId\": \"xxxxxxxx\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "{\n    \"message\":\"No content.\",\n}",
          "type": "json"
        },
        {
          "title": "500",
          "content": "{\n    \"message\":\"Encountered error while uploading file. This has been logged and we are looking into this.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-storage-api/src/createApiRouter.ts",
    "groupTitle": "Storage API",
    "name": "PutV0StorageBucketFilepathRecordid"
  },
  {
    "group": "Storage",
    "type": "PUT",
    "url": "/v0/storage/buckets/{bucketid}",
    "title": "Request to create a new bucket",
    "description": "<p>Creates a new bucket with a specified name.</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "bucketid",
            "description": "<p>The name of the bucket to be created</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "string",
            "optional": true,
            "field": "orgUnitId",
            "description": "<p>(Optional) The id of the orgUnit that the bucket belongs to.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"orgUnitId\": \"1e8aca17-2615-4cdf-91ec-f877cf9e6bdc\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "201",
          "content": "{\n    \"message\":\"Bucket my-bucket created successfully in unspecified-region 🎉\"\n}",
          "type": "json"
        },
        {
          "title": "201",
          "content": "{\n    \"message\": \"Bucket my-bucket already exists 👍\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "500",
          "content": "{\n    \"message\": \"Bucket creation failed. This has been logged and we are looking into this.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-storage-api/src/createApiRouter.ts",
    "groupTitle": "Storage API",
    "name": "PutV0StorageBucketsBucketid"
  },
  {
    "group": "Tenants",
    "type": "get",
    "url": "/v0/tenant/tenants",
    "title": "Get the list of all tenants",
    "description": "<p>Get the list of all tenants You need have <code>object/tenant/read</code> permission to access this API.</p> <blockquote> <p>Please note: multi-tenancy are still an experimental feature. API might changes largely over the time.</p> </blockquote>",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "[{\n   \"domainname\": \"example.com\",\n   \"id\": \"6\",\n   \"enabled\": true\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-tenant-api/src/createTenantsRouter.ts",
    "groupTitle": "Tenants",
    "name": "GetV0TenantTenants"
  },
  {
    "group": "Tenants",
    "type": "post",
    "url": "/v0/tenant/tenants",
    "title": "Create a new tenant",
    "description": "<p>Create a new tenant You need have <code>object/tenant/create</code> permission to access this API.</p> <blockquote> <p>Please note: multi-tenancy are still an experimental feature. API might changes largely over the time.</p> </blockquote>",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "domainname",
            "description": "<p>the domain name serves the tenant.</p>"
          },
          {
            "group": "Body",
            "type": "boolean",
            "optional": true,
            "field": "enabled",
            "description": "<p>Default to <code>true</code>.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "(Body) {json}:",
          "content": "{\n  \"domainname\": \"example.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n   \"domainname\": \"example.com\",\n   \"id\": \"6\",\n   \"enabled\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "401/500",
          "content": "{\n  \"isError\": true,\n  \"errorCode\": 401, //--- or 500 depends on error type\n  \"errorMessage\": \"Not authorized\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/runner/work/magda/magda/magda-tenant-api/src/createTenantsRouter.ts",
    "groupTitle": "Tenants",
    "name": "PostV0TenantTenants"
  }
] });
