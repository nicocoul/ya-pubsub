Ya PubSub is a [topic-based](http://en.wikipedia.org/wiki/Publish–subscribe_pattern#Message_filtering) [publish/subscribe](http://en.wikipedia.org/wiki/Publish/subscribe) library for Node js.

Works well with [ya-rfc](https://www.npmjs.com/package/ya-rfc).

### Key Features
* asynchronous
* embeddable
* designed for micro-services


### Basic Example

PubSub over tcp:
```javascript
{{{examples.pubSubTcp}}}
```
PubSub over websockets
```javascript
{{{examples.pubSubWs}}}
```
PubSub locally (same process)
```javascript
{{{examples.pubSubLocal}}}
```

### Topic Filtering


## Versioning

Yaps-node uses [Semantic Versioning](http://semver.org/) for predictable versioning.

## Alternatives

These are a few alternative projects that also implement topic based publish subscribe in JavaScript.

* https://raw.githubusercontent.com/mroderick/PubSubJS/
* http://www.joezimjs.com/projects/publish-subscribe-jquery-plugin/
* http://amplifyjs.com/api/pubsub/
* http://radio.uxder.com/ — oriented towards 'channels', free of dependencies
* https://github.com/pmelander/Subtopic - supports vanilla, underscore, jQuery and is even available in NuGet