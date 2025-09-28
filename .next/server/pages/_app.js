/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ \"react-redux\");\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var redux_persist_integration_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! redux-persist/integration/react */ \"redux-persist/integration/react\");\n/* harmony import */ var redux_persist_integration_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(redux_persist_integration_react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var redux_persist__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! redux-persist */ \"redux-persist\");\n/* harmony import */ var redux_persist__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(redux_persist__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../store/store */ \"./store/store.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_6__);\n\n\n\n\n\n\n\nlet persistor = (0,redux_persist__WEBPACK_IMPORTED_MODULE_3__.persistStore)(_store_store__WEBPACK_IMPORTED_MODULE_5__.store);\nfunction MyApp({ Component, pageProps }) {\n    (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(()=>{\n        // Inicializar banco de dados quando a aplicação carrega\n        const initDatabase = async ()=>{\n            try {\n                const response = await fetch(\"/api/init-database\", {\n                    method: \"POST\"\n                });\n                const result = await response.json();\n                if (result.success) {\n                    console.log(\"✅ Banco de dados inicializado com sucesso\");\n                } else {\n                    console.error(\"❌ Erro ao inicializar banco:\", result.error);\n                }\n            } catch (error) {\n                console.error(\"❌ Erro ao conectar com a API de inicializa\\xe7\\xe3o:\", error);\n            }\n        };\n        initDatabase();\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_redux__WEBPACK_IMPORTED_MODULE_1__.Provider, {\n        store: _store_store__WEBPACK_IMPORTED_MODULE_5__.store,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(redux_persist_integration_react__WEBPACK_IMPORTED_MODULE_2__.PersistGate, {\n            loading: null,\n            persistor: persistor,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/home/project/pages/_app.tsx\",\n                lineNumber: 38,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/home/project/pages/_app.tsx\",\n            lineNumber: 37,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/project/pages/_app.tsx\",\n        lineNumber: 36,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDdUM7QUFDdUI7QUFDakI7QUFDWDtBQUVLO0FBRVI7QUFFL0IsSUFBSUssWUFBWUgsMkRBQVlBLENBQUNFLCtDQUFLQTtBQUVsQyxTQUFTRSxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQy9DTCxnREFBU0EsQ0FBQztRQUNSLHdEQUF3RDtRQUN4RCxNQUFNTSxlQUFlO1lBQ25CLElBQUk7Z0JBQ0YsTUFBTUMsV0FBVyxNQUFNQyxNQUFNLHNCQUFzQjtvQkFDakRDLFFBQVE7Z0JBQ1Y7Z0JBQ0EsTUFBTUMsU0FBUyxNQUFNSCxTQUFTSSxJQUFJO2dCQUNsQyxJQUFJRCxPQUFPRSxPQUFPLEVBQUU7b0JBQ2xCQyxRQUFRQyxHQUFHLENBQUM7Z0JBQ2QsT0FBTztvQkFDTEQsUUFBUUUsS0FBSyxDQUFDLGdDQUFnQ0wsT0FBT0ssS0FBSztnQkFDNUQ7WUFDRixFQUFFLE9BQU9BLE9BQU87Z0JBQ2RGLFFBQVFFLEtBQUssQ0FBQyx3REFBa0RBO1lBQ2xFO1FBQ0Y7UUFFQVQ7SUFDRixHQUFHLEVBQUU7SUFFTCxxQkFDRSw4REFBQ1QsaURBQVFBO1FBQUNJLE9BQU9BLCtDQUFLQTtrQkFDcEIsNEVBQUNILHdFQUFXQTtZQUFDa0IsU0FBUztZQUFNZCxXQUFXQTtzQkFDckMsNEVBQUNFO2dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJaEM7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Bjc2hvcC8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gXCJuZXh0L2FwcFwiO1xuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcbmltcG9ydCB7IFBlcnNpc3RHYXRlIH0gZnJvbSBcInJlZHV4LXBlcnNpc3QvaW50ZWdyYXRpb24vcmVhY3RcIjtcbmltcG9ydCB7IHBlcnNpc3RTdG9yZSB9IGZyb20gXCJyZWR1eC1wZXJzaXN0XCI7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tIFwiLi4vc3RvcmUvc3RvcmVcIjtcblxuaW1wb3J0IFwiLi4vc3R5bGVzL2dsb2JhbHMuY3NzXCI7XG5cbmxldCBwZXJzaXN0b3IgPSBwZXJzaXN0U3RvcmUoc3RvcmUpO1xuXG5mdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gSW5pY2lhbGl6YXIgYmFuY28gZGUgZGFkb3MgcXVhbmRvIGEgYXBsaWNhw6fDo28gY2FycmVnYVxuICAgIGNvbnN0IGluaXREYXRhYmFzZSA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hcGkvaW5pdC1kYXRhYmFzZScsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ+KchSBCYW5jbyBkZSBkYWRvcyBpbmljaWFsaXphZG8gY29tIHN1Y2Vzc28nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCfinYwgRXJybyBhbyBpbmljaWFsaXphciBiYW5jbzonLCByZXN1bHQuZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCfinYwgRXJybyBhbyBjb25lY3RhciBjb20gYSBBUEkgZGUgaW5pY2lhbGl6YcOnw6NvOicsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaW5pdERhdGFiYXNlKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gKFxuICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxuICAgICAgPFBlcnNpc3RHYXRlIGxvYWRpbmc9e251bGx9IHBlcnNpc3Rvcj17cGVyc2lzdG9yfT5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9QZXJzaXN0R2F0ZT5cbiAgICA8L1Byb3ZpZGVyPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBNeUFwcDsiXSwibmFtZXMiOlsiUHJvdmlkZXIiLCJQZXJzaXN0R2F0ZSIsInBlcnNpc3RTdG9yZSIsInVzZUVmZmVjdCIsInN0b3JlIiwicGVyc2lzdG9yIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJpbml0RGF0YWJhc2UiLCJyZXNwb25zZSIsImZldGNoIiwibWV0aG9kIiwicmVzdWx0IiwianNvbiIsInN1Y2Nlc3MiLCJjb25zb2xlIiwibG9nIiwiZXJyb3IiLCJsb2FkaW5nIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./store/slices/cartSlice.tsx":
/*!************************************!*\
  !*** ./store/slices/cartSlice.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addToCart: () => (/* binding */ addToCart),\n/* harmony export */   cartSlice: () => (/* binding */ cartSlice),\n/* harmony export */   cleanCart: () => (/* binding */ cleanCart),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   removeFromCart: () => (/* binding */ removeFromCart)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"@reduxjs/toolkit\");\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);\n\nconst initialState = {\n    cart: []\n};\nconst cartSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({\n    name: \"cart\",\n    initialState,\n    reducers: {\n        addToCart: (state, action)=>{\n            if (!state.cart.some((i)=>i.id === action.payload.id)) {\n                state.cart.push(action.payload);\n            }\n        },\n        removeFromCart: (state, action)=>{\n            const newItem = state.cart.filter((i)=>{\n                return i.id !== action.payload;\n            });\n            state.cart = newItem;\n        },\n        cleanCart: (state)=>{\n            state.cart = [];\n        }\n    }\n});\nconst { addToCart, removeFromCart, cleanCart } = cartSlice.actions;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cartSlice.reducer);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdG9yZS9zbGljZXMvY2FydFNsaWNlLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQThEO0FBcUI5RCxNQUFNQyxlQUF5QjtJQUM3QkMsTUFBTSxFQUFFO0FBQ1Y7QUFFTyxNQUFNQyxZQUFZSCw2REFBV0EsQ0FBQztJQUNuQ0ksTUFBTTtJQUNOSDtJQUNBSSxVQUFVO1FBQ1JDLFdBQVcsQ0FBQ0MsT0FBT0M7WUFDakIsSUFBSSxDQUFDRCxNQUFNTCxJQUFJLENBQUNPLElBQUksQ0FBQyxDQUFDQyxJQUFNQSxFQUFFQyxFQUFFLEtBQUtILE9BQU9JLE9BQU8sQ0FBQ0QsRUFBRSxHQUFHO2dCQUN2REosTUFBTUwsSUFBSSxDQUFDVyxJQUFJLENBQUNMLE9BQU9JLE9BQU87WUFDaEM7UUFDRjtRQUNBRSxnQkFBZ0IsQ0FBQ1AsT0FBT0M7WUFDdEIsTUFBTU8sVUFBVVIsTUFBTUwsSUFBSSxDQUFDYyxNQUFNLENBQUMsQ0FBQ047Z0JBQ2pDLE9BQU9BLEVBQUVDLEVBQUUsS0FBS0gsT0FBT0ksT0FBTztZQUNoQztZQUNBTCxNQUFNTCxJQUFJLEdBQUdhO1FBQ2Y7UUFDQUUsV0FBVyxDQUFDVjtZQUNWQSxNQUFNTCxJQUFJLEdBQUcsRUFBRTtRQUNqQjtJQUNGO0FBQ0YsR0FBRztBQUVJLE1BQU0sRUFBRUksU0FBUyxFQUFFUSxjQUFjLEVBQUVHLFNBQVMsRUFBRSxHQUFHZCxVQUFVZSxPQUFPLENBQUM7QUFDMUUsaUVBQWVmLFVBQVVnQixPQUFPLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wY3Nob3AvLi9zdG9yZS9zbGljZXMvY2FydFNsaWNlLnRzeD8yMzY4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNsaWNlLCBQYXlsb2FkQWN0aW9uIH0gZnJvbSBcIkByZWR1eGpzL3Rvb2xraXRcIjtcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbW9kZWxvOiBzdHJpbmc7XG4gIGNhdGVnb3JpYTogc3RyaW5nO1xuICBmYWJyaWNhbnRlOiBzdHJpbmc7XG4gIGlkOiBzdHJpbmc7XG4gIGltZzogc3RyaW5nO1xuICBpbWcyOiBzdHJpbmc7XG4gIGdhcmFudGlhOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgcGF0aE5hbWU6IHN0cmluZztcbiAgcFByYXpvOiBudW1iZXI7XG4gIHNwZWNzOiBvYmplY3RbXTtcbiAgcHJvbW86IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBjYXJ0VHlwZSB7XG4gIGNhcnQ6IFByb3BzW107XG59XG5cbmNvbnN0IGluaXRpYWxTdGF0ZTogY2FydFR5cGUgPSB7XG4gIGNhcnQ6IFtdLFxufTtcblxuZXhwb3J0IGNvbnN0IGNhcnRTbGljZSA9IGNyZWF0ZVNsaWNlKHtcbiAgbmFtZTogXCJjYXJ0XCIsXG4gIGluaXRpYWxTdGF0ZSxcbiAgcmVkdWNlcnM6IHtcbiAgICBhZGRUb0NhcnQ6IChzdGF0ZSwgYWN0aW9uOiBQYXlsb2FkQWN0aW9uPFByb3BzPikgPT4ge1xuICAgICAgaWYgKCFzdGF0ZS5jYXJ0LnNvbWUoKGkpID0+IGkuaWQgPT09IGFjdGlvbi5wYXlsb2FkLmlkKSkge1xuICAgICAgICBzdGF0ZS5jYXJ0LnB1c2goYWN0aW9uLnBheWxvYWQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlRnJvbUNhcnQ6IChzdGF0ZSwgYWN0aW9uOiBQYXlsb2FkQWN0aW9uPHN0cmluZz4pID0+IHtcbiAgICAgIGNvbnN0IG5ld0l0ZW0gPSBzdGF0ZS5jYXJ0LmZpbHRlcigoaSkgPT4ge1xuICAgICAgICByZXR1cm4gaS5pZCAhPT0gYWN0aW9uLnBheWxvYWQ7XG4gICAgICB9KTtcbiAgICAgIHN0YXRlLmNhcnQgPSBuZXdJdGVtO1xuICAgIH0sXG4gICAgY2xlYW5DYXJ0OiAoc3RhdGUpID0+IHtcbiAgICAgIHN0YXRlLmNhcnQgPSBbXTtcbiAgICB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBjb25zdCB7IGFkZFRvQ2FydCwgcmVtb3ZlRnJvbUNhcnQsIGNsZWFuQ2FydCB9ID0gY2FydFNsaWNlLmFjdGlvbnM7XG5leHBvcnQgZGVmYXVsdCBjYXJ0U2xpY2UucmVkdWNlcjtcbiJdLCJuYW1lcyI6WyJjcmVhdGVTbGljZSIsImluaXRpYWxTdGF0ZSIsImNhcnQiLCJjYXJ0U2xpY2UiLCJuYW1lIiwicmVkdWNlcnMiLCJhZGRUb0NhcnQiLCJzdGF0ZSIsImFjdGlvbiIsInNvbWUiLCJpIiwiaWQiLCJwYXlsb2FkIiwicHVzaCIsInJlbW92ZUZyb21DYXJ0IiwibmV3SXRlbSIsImZpbHRlciIsImNsZWFuQ2FydCIsImFjdGlvbnMiLCJyZWR1Y2VyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./store/slices/cartSlice.tsx\n");

/***/ }),

/***/ "./store/slices/newSlice.tsx":
/*!***********************************!*\
  !*** ./store/slices/newSlice.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   cleanSlice: () => (/* binding */ cleanSlice),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   deleteItem: () => (/* binding */ deleteItem),\n/* harmony export */   newSlice: () => (/* binding */ newSlice),\n/* harmony export */   updateTotalPrice: () => (/* binding */ updateTotalPrice)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"@reduxjs/toolkit\");\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);\n\nconst initialState = {\n    obj: []\n};\nconst newSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({\n    name: \"newSlice\",\n    initialState,\n    reducers: {\n        updateTotalPrice: (state, action)=>{\n            if (state.obj.every((i)=>i.id !== action.payload.id)) {\n                state.obj.push(action.payload);\n            } else {\n                const newObj = state.obj.map((i)=>{\n                    if (i.id === action.payload.id) {\n                        return {\n                            ...i,\n                            valorTotal: action.payload.valorTotal\n                        };\n                    } else {\n                        return i;\n                    }\n                });\n                state.obj = newObj;\n            }\n        },\n        deleteItem: (state, action)=>{\n            const newObj = state.obj.filter((i)=>i.id !== action.payload);\n            state.obj = newObj;\n        },\n        cleanSlice: (state)=>{\n            state.obj = [];\n        }\n    }\n});\nconst { updateTotalPrice, cleanSlice, deleteItem } = newSlice.actions;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (newSlice.reducer);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdG9yZS9zbGljZXMvbmV3U2xpY2UudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBOEQ7QUFXOUQsTUFBTUMsZUFBeUI7SUFDN0JDLEtBQUssRUFBRTtBQUNUO0FBRU8sTUFBTUMsV0FBV0gsNkRBQVdBLENBQUM7SUFDbENJLE1BQU07SUFDTkg7SUFDQUksVUFBVTtRQUNSQyxrQkFBa0IsQ0FBQ0MsT0FBT0M7WUFDeEIsSUFBSUQsTUFBTUwsR0FBRyxDQUFDTyxLQUFLLENBQUMsQ0FBQ0MsSUFBTUEsRUFBRUMsRUFBRSxLQUFLSCxPQUFPSSxPQUFPLENBQUNELEVBQUUsR0FBRztnQkFDdERKLE1BQU1MLEdBQUcsQ0FBQ1csSUFBSSxDQUFDTCxPQUFPSSxPQUFPO1lBQy9CLE9BQU87Z0JBQ0wsTUFBTUUsU0FBU1AsTUFBTUwsR0FBRyxDQUFDYSxHQUFHLENBQUMsQ0FBQ0w7b0JBQzVCLElBQUlBLEVBQUVDLEVBQUUsS0FBS0gsT0FBT0ksT0FBTyxDQUFDRCxFQUFFLEVBQUU7d0JBQzlCLE9BQU87NEJBQUUsR0FBR0QsQ0FBQzs0QkFBRU0sWUFBWVIsT0FBT0ksT0FBTyxDQUFDSSxVQUFVO3dCQUFDO29CQUN2RCxPQUFPO3dCQUNMLE9BQU9OO29CQUNUO2dCQUNGO2dCQUNBSCxNQUFNTCxHQUFHLEdBQUdZO1lBQ2Q7UUFDRjtRQUNBRyxZQUFZLENBQUNWLE9BQU9DO1lBQ2xCLE1BQU1NLFNBQVNQLE1BQU1MLEdBQUcsQ0FBQ2dCLE1BQU0sQ0FBQyxDQUFDUixJQUFNQSxFQUFFQyxFQUFFLEtBQUtILE9BQU9JLE9BQU87WUFDOURMLE1BQU1MLEdBQUcsR0FBR1k7UUFDZDtRQUNBSyxZQUFZLENBQUNaO1lBQ1hBLE1BQU1MLEdBQUcsR0FBRyxFQUFFO1FBQ2hCO0lBQ0Y7QUFDRixHQUFHO0FBRUksTUFBTSxFQUFFSSxnQkFBZ0IsRUFBRWEsVUFBVSxFQUFFRixVQUFVLEVBQUUsR0FBR2QsU0FBU2lCLE9BQU8sQ0FBQztBQUM3RSxpRUFBZWpCLFNBQVNrQixPQUFPLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wY3Nob3AvLi9zdG9yZS9zbGljZXMvbmV3U2xpY2UudHN4PzZiMWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2xpY2UsIFBheWxvYWRBY3Rpb24gfSBmcm9tIFwiQHJlZHV4anMvdG9vbGtpdFwiO1xuXG5pbnRlcmZhY2UgdXBkYXRlUHJvcHMge1xuICB2YWxvclRvdGFsOiBudW1iZXI7XG4gIGlkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBuZXdQcm9wcyB7XG4gIG9iajogdXBkYXRlUHJvcHNbXTtcbn1cblxuY29uc3QgaW5pdGlhbFN0YXRlOiBuZXdQcm9wcyA9IHtcbiAgb2JqOiBbXSxcbn07XG5cbmV4cG9ydCBjb25zdCBuZXdTbGljZSA9IGNyZWF0ZVNsaWNlKHtcbiAgbmFtZTogXCJuZXdTbGljZVwiLFxuICBpbml0aWFsU3RhdGUsXG4gIHJlZHVjZXJzOiB7XG4gICAgdXBkYXRlVG90YWxQcmljZTogKHN0YXRlLCBhY3Rpb246IFBheWxvYWRBY3Rpb248dXBkYXRlUHJvcHM+KSA9PiB7XG4gICAgICBpZiAoc3RhdGUub2JqLmV2ZXJ5KChpKSA9PiBpLmlkICE9PSBhY3Rpb24ucGF5bG9hZC5pZCkpIHtcbiAgICAgICAgc3RhdGUub2JqLnB1c2goYWN0aW9uLnBheWxvYWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbmV3T2JqID0gc3RhdGUub2JqLm1hcCgoaSkgPT4ge1xuICAgICAgICAgIGlmIChpLmlkID09PSBhY3Rpb24ucGF5bG9hZC5pZCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uaSwgdmFsb3JUb3RhbDogYWN0aW9uLnBheWxvYWQudmFsb3JUb3RhbCB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzdGF0ZS5vYmogPSBuZXdPYmo7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVJdGVtOiAoc3RhdGUsIGFjdGlvbjogUGF5bG9hZEFjdGlvbjxzdHJpbmc+KSA9PiB7XG4gICAgICBjb25zdCBuZXdPYmogPSBzdGF0ZS5vYmouZmlsdGVyKChpKSA9PiBpLmlkICE9PSBhY3Rpb24ucGF5bG9hZCk7XG4gICAgICBzdGF0ZS5vYmogPSBuZXdPYmo7XG4gICAgfSxcbiAgICBjbGVhblNsaWNlOiAoc3RhdGUpID0+IHtcbiAgICAgIHN0YXRlLm9iaiA9IFtdO1xuICAgIH0sXG4gIH0sXG59KTtcblxuZXhwb3J0IGNvbnN0IHsgdXBkYXRlVG90YWxQcmljZSwgY2xlYW5TbGljZSwgZGVsZXRlSXRlbSB9ID0gbmV3U2xpY2UuYWN0aW9ucztcbmV4cG9ydCBkZWZhdWx0IG5ld1NsaWNlLnJlZHVjZXI7XG4iXSwibmFtZXMiOlsiY3JlYXRlU2xpY2UiLCJpbml0aWFsU3RhdGUiLCJvYmoiLCJuZXdTbGljZSIsIm5hbWUiLCJyZWR1Y2VycyIsInVwZGF0ZVRvdGFsUHJpY2UiLCJzdGF0ZSIsImFjdGlvbiIsImV2ZXJ5IiwiaSIsImlkIiwicGF5bG9hZCIsInB1c2giLCJuZXdPYmoiLCJtYXAiLCJ2YWxvclRvdGFsIiwiZGVsZXRlSXRlbSIsImZpbHRlciIsImNsZWFuU2xpY2UiLCJhY3Rpb25zIiwicmVkdWNlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./store/slices/newSlice.tsx\n");

/***/ }),

/***/ "./store/store.tsx":
/*!*************************!*\
  !*** ./store/store.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   store: () => (/* binding */ store)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"@reduxjs/toolkit\");\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var redux_persist_lib_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! redux-persist/lib/storage */ \"redux-persist/lib/storage\");\n/* harmony import */ var redux_persist_lib_storage__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(redux_persist_lib_storage__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! redux */ \"redux\");\n/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var redux_persist__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! redux-persist */ \"redux-persist\");\n/* harmony import */ var redux_persist__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(redux_persist__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! redux-thunk */ \"redux-thunk\");\n/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(redux_thunk__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _slices_cartSlice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./slices/cartSlice */ \"./store/slices/cartSlice.tsx\");\n/* harmony import */ var _slices_newSlice__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./slices/newSlice */ \"./store/slices/newSlice.tsx\");\n\n\n\n\n\n\n\nconst reducers = (0,redux__WEBPACK_IMPORTED_MODULE_2__.combineReducers)({\n    cartStore: _slices_cartSlice__WEBPACK_IMPORTED_MODULE_5__[\"default\"],\n    newSlice: _slices_newSlice__WEBPACK_IMPORTED_MODULE_6__[\"default\"]\n});\nconst persistConfig = {\n    key: \"root\",\n    storage: (redux_persist_lib_storage__WEBPACK_IMPORTED_MODULE_1___default())\n};\nconst persistedReducer = (0,redux_persist__WEBPACK_IMPORTED_MODULE_3__.persistReducer)(persistConfig, reducers);\nconst store = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.configureStore)({\n    reducer: persistedReducer,\n    devTools: \"development\" !== \"production\",\n    middleware: [\n        (redux_thunk__WEBPACK_IMPORTED_MODULE_4___default())\n    ]\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdG9yZS9zdG9yZS50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFrRDtBQUNGO0FBQ1I7QUFDTztBQUNmO0FBRVc7QUFDRjtBQUV6QyxNQUFNTyxXQUFXTCxzREFBZUEsQ0FBQztJQUMvQk0sV0FBV0gseURBQVNBO0lBQ3BCQyxVQUFVQSx3REFBUUE7QUFDcEI7QUFFQSxNQUFNRyxnQkFBZ0I7SUFDcEJDLEtBQUs7SUFDTFQsT0FBT0Esb0VBQUFBO0FBQ1Q7QUFFQSxNQUFNVSxtQkFBbUJSLDZEQUFjQSxDQUFDTSxlQUFlRjtBQUNoRCxNQUFNSyxRQUFRWixnRUFBY0EsQ0FBQztJQUNsQ2EsU0FBU0Y7SUFDVEcsVUFBVUMsYUFBb0IsS0FBSztJQUNuQ0csWUFBWTtRQUFDZCxvREFBS0E7S0FBQztBQUNyQixHQUFHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGNzaG9wLy4vc3RvcmUvc3RvcmUudHN4PzU3ZWIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29uZmlndXJlU3RvcmUgfSBmcm9tIFwiQHJlZHV4anMvdG9vbGtpdFwiO1xuaW1wb3J0IHN0b3JhZ2UgZnJvbSBcInJlZHV4LXBlcnNpc3QvbGliL3N0b3JhZ2VcIjtcbmltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xuaW1wb3J0IHsgcGVyc2lzdFJlZHVjZXIgfSBmcm9tIFwicmVkdXgtcGVyc2lzdFwiO1xuaW1wb3J0IHRodW5rIGZyb20gXCJyZWR1eC10aHVua1wiO1xuXG5pbXBvcnQgY2FydFNsaWNlIGZyb20gXCIuL3NsaWNlcy9jYXJ0U2xpY2VcIjtcbmltcG9ydCBuZXdTbGljZSBmcm9tIFwiLi9zbGljZXMvbmV3U2xpY2VcIjtcblxuY29uc3QgcmVkdWNlcnMgPSBjb21iaW5lUmVkdWNlcnMoe1xuICBjYXJ0U3RvcmU6IGNhcnRTbGljZSxcbiAgbmV3U2xpY2U6IG5ld1NsaWNlLFxufSk7XG5cbmNvbnN0IHBlcnNpc3RDb25maWcgPSB7XG4gIGtleTogXCJyb290XCIsXG4gIHN0b3JhZ2UsXG59O1xuXG5jb25zdCBwZXJzaXN0ZWRSZWR1Y2VyID0gcGVyc2lzdFJlZHVjZXIocGVyc2lzdENvbmZpZywgcmVkdWNlcnMpO1xuZXhwb3J0IGNvbnN0IHN0b3JlID0gY29uZmlndXJlU3RvcmUoe1xuICByZWR1Y2VyOiBwZXJzaXN0ZWRSZWR1Y2VyLFxuICBkZXZUb29sczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiLFxuICBtaWRkbGV3YXJlOiBbdGh1bmtdLFxufSk7XG5cbmV4cG9ydCB0eXBlIFJvb3RTdGF0ZSA9IFJldHVyblR5cGU8dHlwZW9mIHN0b3JlLmdldFN0YXRlPjtcbmV4cG9ydCB0eXBlIEFwcERpc3BhdGNoID0gdHlwZW9mIHN0b3JlLmRpc3BhdGNoO1xuIl0sIm5hbWVzIjpbImNvbmZpZ3VyZVN0b3JlIiwic3RvcmFnZSIsImNvbWJpbmVSZWR1Y2VycyIsInBlcnNpc3RSZWR1Y2VyIiwidGh1bmsiLCJjYXJ0U2xpY2UiLCJuZXdTbGljZSIsInJlZHVjZXJzIiwiY2FydFN0b3JlIiwicGVyc2lzdENvbmZpZyIsImtleSIsInBlcnNpc3RlZFJlZHVjZXIiLCJzdG9yZSIsInJlZHVjZXIiLCJkZXZUb29scyIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsIm1pZGRsZXdhcmUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./store/store.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@reduxjs/toolkit":
/*!***********************************!*\
  !*** external "@reduxjs/toolkit" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@reduxjs/toolkit");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-redux":
/*!******************************!*\
  !*** external "react-redux" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-redux");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "redux":
/*!************************!*\
  !*** external "redux" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("redux");

/***/ }),

/***/ "redux-persist":
/*!********************************!*\
  !*** external "redux-persist" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("redux-persist");

/***/ }),

/***/ "redux-persist/integration/react":
/*!**************************************************!*\
  !*** external "redux-persist/integration/react" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("redux-persist/integration/react");

/***/ }),

/***/ "redux-persist/lib/storage":
/*!********************************************!*\
  !*** external "redux-persist/lib/storage" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("redux-persist/lib/storage");

/***/ }),

/***/ "redux-thunk":
/*!******************************!*\
  !*** external "redux-thunk" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("redux-thunk");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();