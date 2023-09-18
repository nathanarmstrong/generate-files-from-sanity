# generate-files-from-sanity

Generate-files-from-sanity works with the following file structur.

```bash
├── apps
│   ├── cms
│   │   └── schemas
│   │       ├── blocks ( blocks are the blocks of a page )
│   │       ├── components ( components are the parts that make up the block )
│   │       ├── objects ( objects are repeatables that are used in components )
│   │       └── index.js
│   └── web
│       ├── ...
│       └── src
│           └── app
│               ├── _components
│               ├── _types
│               ├── pages
│               └── _utils
├── packages
│   ├── ...
│   └── generate-files-from-sanity( generate-types )
└── ...
```

Test to see if the files will be generated from sanity schema.

This create files in ` ./test/...` directory

```
npm run test
```
