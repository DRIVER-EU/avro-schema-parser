# avro-schema-parser

Flatten AVRO schema's which reference other schema's, so the Kafka schema registry will accept them.

The Kafka schema registry only supports schema files with one schema at the root, even though the AVRO specifications allows you to specify multiple schema's in one JSON file. This makes sense, since otherwise you would need to specify the specific schema in the multi-schema file that you are going to use to encode/decode messages. However, in case you already have a multi-schema file, this utility will try to inline your schema's.

The first time it encounters a reference to another schema, it will inline it, the next time it will reference it.

To test if your schema is valid, you can use the official avro-tools from the [releases website](http://avro.apache.org/releases.html).

```
cls && java -jar avro-tools-1.8.2.jar compile schema driver.eu.alert.avsc tmp
```

This package was tested by running the tool on the `data/cap.avsc` schema, and posting the resulting json schema file to the Confluence schema-registry using another small utility, [postj](https://github.com/DRIVER-EU/postj), which you can install via `npm i -g postj`. Please note that the Landoop schema-registry-ui v0.9.3 may say that the schema is invalid, as is the case here, while posting it will still work.

## Caveat

Several cases have not been tested, and will probably not work:
- In case you have an ENUM that is used multiple times.
- When working with the MAP or FIXED schema type.
