================
AG-GRID-WINDOWS7
================

.. highlight:: bash


開發
======

全局安裝 ``node20`` 以及 ``yarn`` 以及編譯 css

::

    pnpm env use --global 20
    pnpm install yarn -g
    yarn
    yarn tsx ./scripts/build-css.ts --package ag-grid-community



構建
======

::

    yarn nx run-many --t build -c staging --exclude ag-grid-docs --exclude all



利用
======

像這樣:

.. code-block:: json

    {
        "dependencies": {
            "ag-grid-community": "github:1-betop/ag-grid-windows7#FOR-WINDOWS7-dist-community",
            "ag-grid-vue3": "34.2.0",
            "vue": "^3.5.21",
        },
        "pnpm": {
            "overrides": {
                "ag-grid-community": "$ag-grid-community",
                "vue": "$vue"
            }
        }
    }

