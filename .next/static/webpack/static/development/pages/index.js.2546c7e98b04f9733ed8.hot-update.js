webpackHotUpdate("static/development/pages/index.js",{

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-jsx/style */ "./node_modules/styled-jsx/style.js");
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _styles_main__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles/main */ "./pages/styles/main.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/router */ "./node_modules/next/dist/client/router.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_modal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-modal */ "./node_modules/react-modal/lib/index.js");
/* harmony import */ var react_modal__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_modal__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! next/document */ "./node_modules/next/document.js");
/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_document__WEBPACK_IMPORTED_MODULE_7__);

var _jsxFileName = "/Users/shyam/Personal/github/moretrees/pages/index.js";







var customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

var navigateTo = function navigateTo(page, params) {
  next_router__WEBPACK_IMPORTED_MODULE_5___default.a.push({
    pathname: "/".concat(page) // query: { name: 'Zeit' },

  });
};

var toggleModal = function toggleModal(modalStatus, modalSetter) {
  modalSetter(!modalStatus);
};

function MainPage() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(false),
      _useState2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
      isModalOpen = _useState2[0],
      setModal = _useState2[1];

  return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash) + " " + "header",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, "MoreTrees"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash) + " " + "userEntry",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    onClick: function onClick() {
      return toggleModal(isModalOpen, setModal);
    },
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }, "Login"), "/", react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, "Register"))), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react_modal__WEBPACK_IMPORTED_MODULE_6___default.a, {
    isOpen: isModalOpen,
    onAfterOpen: function onAfterOpen() {},
    onRequestClose: function onRequestClose() {
      return setModal(false);
    },
    style: customStyles,
    contentLabel: "Example Modal",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("button", {
    onClick: function onClick() {
      return toggleModal(isModalOpen, setModal);
    },
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    },
    __self: this
  }, "close"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }, "I am a modal"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("form", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("input", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("button", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, "tab navigation"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("button", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  }, "stays"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("button", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }, "inside"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("button", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
    },
    __self: this
  }, "the modal"))), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash) + " " + "donateVol",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("button", {
    onClick: function onClick() {
      return navigateTo('donate');
    },
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash) + " " + "donate",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 65
    },
    __self: this
  }, "Donate"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("button", {
    onClick: function onClick() {
      return navigateTo('volunteer');
    },
    className: "jsx-".concat(_styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash) + " " + "donate",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, "Volunteer")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default.a, {
    id: _styles_main__WEBPACK_IMPORTED_MODULE_3__["default"].__hash,
    __self: this
  }, _styles_main__WEBPACK_IMPORTED_MODULE_3__["default"]));
}

/* harmony default export */ __webpack_exports__["default"] = (MainPage);

/***/ })

})
//# sourceMappingURL=index.js.2546c7e98b04f9733ed8.hot-update.js.map