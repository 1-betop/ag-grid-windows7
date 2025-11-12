================
AG-GRID-WINDOWS7
================

.. highlight:: bash


該分支一直在拉取上游 commit 但是未經驗證, 最後一個驗證並構建的版本見分支 ``FOR-WINDOWS7-dist-community`` (September 13, 2025 at 2:49 PM)


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

