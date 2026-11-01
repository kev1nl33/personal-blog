var Sf = { exports: {} }, Cu = {};
var Dr;
function fm() {
  if (Dr) return Cu;
  Dr = 1;
  var g = /* @__PURE__ */ Symbol.for("react.transitional.element"), A = /* @__PURE__ */ Symbol.for("react.fragment");
  function D(f, N, Q) {
    var J = null;
    if (Q !== void 0 && (J = "" + Q), N.key !== void 0 && (J = "" + N.key), "key" in N) {
      Q = {};
      for (var Z in N)
        Z !== "key" && (Q[Z] = N[Z]);
    } else Q = N;
    return N = Q.ref, {
      $$typeof: g,
      type: f,
      key: J,
      ref: N !== void 0 ? N : null,
      props: Q
    };
  }
  return Cu.Fragment = A, Cu.jsx = D, Cu.jsxs = D, Cu;
}
var Ur;
function om() {
  return Ur || (Ur = 1, Sf.exports = fm()), Sf.exports;
}
var Hl = om(), pf = { exports: {} }, K = {};
var _r;
function sm() {
  if (_r) return K;
  _r = 1;
  var g = /* @__PURE__ */ Symbol.for("react.transitional.element"), A = /* @__PURE__ */ Symbol.for("react.portal"), D = /* @__PURE__ */ Symbol.for("react.fragment"), f = /* @__PURE__ */ Symbol.for("react.strict_mode"), N = /* @__PURE__ */ Symbol.for("react.profiler"), Q = /* @__PURE__ */ Symbol.for("react.consumer"), J = /* @__PURE__ */ Symbol.for("react.context"), Z = /* @__PURE__ */ Symbol.for("react.forward_ref"), x = /* @__PURE__ */ Symbol.for("react.suspense"), T = /* @__PURE__ */ Symbol.for("react.memo"), M = /* @__PURE__ */ Symbol.for("react.lazy"), _ = /* @__PURE__ */ Symbol.for("react.activity"), L = Symbol.iterator;
  function hl(r) {
    return r === null || typeof r != "object" ? null : (r = L && r[L] || r["@@iterator"], typeof r == "function" ? r : null);
  }
  var cl = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, P = Object.assign, zl = {};
  function ul(r, z, R) {
    this.props = r, this.context = z, this.refs = zl, this.updater = R || cl;
  }
  ul.prototype.isReactComponent = {}, ul.prototype.setState = function(r, z) {
    if (typeof r != "object" && typeof r != "function" && r != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, r, z, "setState");
  }, ul.prototype.forceUpdate = function(r) {
    this.updater.enqueueForceUpdate(this, r, "forceUpdate");
  };
  function gl() {
  }
  gl.prototype = ul.prototype;
  function El(r, z, R) {
    this.props = r, this.context = z, this.refs = zl, this.updater = R || cl;
  }
  var k = El.prototype = new gl();
  k.constructor = El, P(k, ul.prototype), k.isPureReactComponent = !0;
  var Yl = Array.isArray;
  function O() {
  }
  var w = { H: null, A: null, T: null, S: null }, vl = Object.prototype.hasOwnProperty;
  function lt(r, z, R) {
    var C = R.ref;
    return {
      $$typeof: g,
      type: r,
      key: z,
      ref: C !== void 0 ? C : null,
      props: R
    };
  }
  function qt(r, z) {
    return lt(r.type, z, r.props);
  }
  function $l(r) {
    return typeof r == "object" && r !== null && r.$$typeof === g;
  }
  function Xl(r) {
    var z = { "=": "=0", ":": "=2" };
    return "$" + r.replace(/[=:]/g, function(R) {
      return z[R];
    });
  }
  var St = /\/+/g;
  function pt(r, z) {
    return typeof r == "object" && r !== null && r.key != null ? Xl("" + r.key) : z.toString(36);
  }
  function tt(r) {
    switch (r.status) {
      case "fulfilled":
        return r.value;
      case "rejected":
        throw r.reason;
      default:
        switch (typeof r.status == "string" ? r.then(O, O) : (r.status = "pending", r.then(
          function(z) {
            r.status === "pending" && (r.status = "fulfilled", r.value = z);
          },
          function(z) {
            r.status === "pending" && (r.status = "rejected", r.reason = z);
          }
        )), r.status) {
          case "fulfilled":
            return r.value;
          case "rejected":
            throw r.reason;
        }
    }
    throw r;
  }
  function S(r, z, R, C, X) {
    var $ = typeof r;
    ($ === "undefined" || $ === "boolean") && (r = null);
    var I = !1;
    if (r === null) I = !0;
    else
      switch ($) {
        case "bigint":
        case "string":
        case "number":
          I = !0;
          break;
        case "object":
          switch (r.$$typeof) {
            case g:
            case A:
              I = !0;
              break;
            case M:
              return I = r._init, S(
                I(r._payload),
                z,
                R,
                C,
                X
              );
          }
      }
    if (I)
      return X = X(r), I = C === "" ? "." + pt(r, 0) : C, Yl(X) ? (R = "", I != null && (R = I.replace(St, "$&/") + "/"), S(X, z, R, "", function(ce) {
        return ce;
      })) : X != null && ($l(X) && (X = qt(
        X,
        R + (X.key == null || r && r.key === X.key ? "" : ("" + X.key).replace(
          St,
          "$&/"
        ) + "/") + I
      )), z.push(X)), 1;
    I = 0;
    var jl = C === "" ? "." : C + ":";
    if (Yl(r))
      for (var Ml = 0; Ml < r.length; Ml++)
        C = r[Ml], $ = jl + pt(C, Ml), I += S(
          C,
          z,
          R,
          $,
          X
        );
    else if (Ml = hl(r), typeof Ml == "function")
      for (r = Ml.call(r), Ml = 0; !(C = r.next()).done; )
        C = C.value, $ = jl + pt(C, Ml++), I += S(
          C,
          z,
          R,
          $,
          X
        );
    else if ($ === "object") {
      if (typeof r.then == "function")
        return S(
          tt(r),
          z,
          R,
          C,
          X
        );
      throw z = String(r), Error(
        "Objects are not valid as a React child (found: " + (z === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : z) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return I;
  }
  function U(r, z, R) {
    if (r == null) return r;
    var C = [], X = 0;
    return S(r, C, "", "", function($) {
      return z.call(R, $, X++);
    }), C;
  }
  function q(r) {
    if (r._status === -1) {
      var z = r._result;
      z = z(), z.then(
        function(R) {
          (r._status === 0 || r._status === -1) && (r._status = 1, r._result = R);
        },
        function(R) {
          (r._status === 0 || r._status === -1) && (r._status = 2, r._result = R);
        }
      ), r._status === -1 && (r._status = 0, r._result = z);
    }
    if (r._status === 1) return r._result.default;
    throw r._result;
  }
  var nl = typeof reportError == "function" ? reportError : function(r) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var z = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof r == "object" && r !== null && typeof r.message == "string" ? String(r.message) : String(r),
        error: r
      });
      if (!window.dispatchEvent(z)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", r);
      return;
    }
    console.error(r);
  }, sl = {
    map: U,
    forEach: function(r, z, R) {
      U(
        r,
        function() {
          z.apply(this, arguments);
        },
        R
      );
    },
    count: function(r) {
      var z = 0;
      return U(r, function() {
        z++;
      }), z;
    },
    toArray: function(r) {
      return U(r, function(z) {
        return z;
      }) || [];
    },
    only: function(r) {
      if (!$l(r))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return r;
    }
  };
  return K.Activity = _, K.Children = sl, K.Component = ul, K.Fragment = D, K.Profiler = N, K.PureComponent = El, K.StrictMode = f, K.Suspense = x, K.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w, K.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(r) {
      return w.H.useMemoCache(r);
    }
  }, K.cache = function(r) {
    return function() {
      return r.apply(null, arguments);
    };
  }, K.cacheSignal = function() {
    return null;
  }, K.cloneElement = function(r, z, R) {
    if (r == null)
      throw Error(
        "The argument must be a React element, but you passed " + r + "."
      );
    var C = P({}, r.props), X = r.key;
    if (z != null)
      for ($ in z.key !== void 0 && (X = "" + z.key), z)
        !vl.call(z, $) || $ === "key" || $ === "__self" || $ === "__source" || $ === "ref" && z.ref === void 0 || (C[$] = z[$]);
    var $ = arguments.length - 2;
    if ($ === 1) C.children = R;
    else if (1 < $) {
      for (var I = Array($), jl = 0; jl < $; jl++)
        I[jl] = arguments[jl + 2];
      C.children = I;
    }
    return lt(r.type, X, C);
  }, K.createContext = function(r) {
    return r = {
      $$typeof: J,
      _currentValue: r,
      _currentValue2: r,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, r.Provider = r, r.Consumer = {
      $$typeof: Q,
      _context: r
    }, r;
  }, K.createElement = function(r, z, R) {
    var C, X = {}, $ = null;
    if (z != null)
      for (C in z.key !== void 0 && ($ = "" + z.key), z)
        vl.call(z, C) && C !== "key" && C !== "__self" && C !== "__source" && (X[C] = z[C]);
    var I = arguments.length - 2;
    if (I === 1) X.children = R;
    else if (1 < I) {
      for (var jl = Array(I), Ml = 0; Ml < I; Ml++)
        jl[Ml] = arguments[Ml + 2];
      X.children = jl;
    }
    if (r && r.defaultProps)
      for (C in I = r.defaultProps, I)
        X[C] === void 0 && (X[C] = I[C]);
    return lt(r, $, X);
  }, K.createRef = function() {
    return { current: null };
  }, K.forwardRef = function(r) {
    return { $$typeof: Z, render: r };
  }, K.isValidElement = $l, K.lazy = function(r) {
    return {
      $$typeof: M,
      _payload: { _status: -1, _result: r },
      _init: q
    };
  }, K.memo = function(r, z) {
    return {
      $$typeof: T,
      type: r,
      compare: z === void 0 ? null : z
    };
  }, K.startTransition = function(r) {
    var z = w.T, R = {};
    w.T = R;
    try {
      var C = r(), X = w.S;
      X !== null && X(R, C), typeof C == "object" && C !== null && typeof C.then == "function" && C.then(O, nl);
    } catch ($) {
      nl($);
    } finally {
      z !== null && R.types !== null && (z.types = R.types), w.T = z;
    }
  }, K.unstable_useCacheRefresh = function() {
    return w.H.useCacheRefresh();
  }, K.use = function(r) {
    return w.H.use(r);
  }, K.useActionState = function(r, z, R) {
    return w.H.useActionState(r, z, R);
  }, K.useCallback = function(r, z) {
    return w.H.useCallback(r, z);
  }, K.useContext = function(r) {
    return w.H.useContext(r);
  }, K.useDebugValue = function() {
  }, K.useDeferredValue = function(r, z) {
    return w.H.useDeferredValue(r, z);
  }, K.useEffect = function(r, z) {
    return w.H.useEffect(r, z);
  }, K.useEffectEvent = function(r) {
    return w.H.useEffectEvent(r);
  }, K.useId = function() {
    return w.H.useId();
  }, K.useImperativeHandle = function(r, z, R) {
    return w.H.useImperativeHandle(r, z, R);
  }, K.useInsertionEffect = function(r, z) {
    return w.H.useInsertionEffect(r, z);
  }, K.useLayoutEffect = function(r, z) {
    return w.H.useLayoutEffect(r, z);
  }, K.useMemo = function(r, z) {
    return w.H.useMemo(r, z);
  }, K.useOptimistic = function(r, z) {
    return w.H.useOptimistic(r, z);
  }, K.useReducer = function(r, z, R) {
    return w.H.useReducer(r, z, R);
  }, K.useRef = function(r) {
    return w.H.useRef(r);
  }, K.useState = function(r) {
    return w.H.useState(r);
  }, K.useSyncExternalStore = function(r, z, R) {
    return w.H.useSyncExternalStore(
      r,
      z,
      R
    );
  }, K.useTransition = function() {
    return w.H.useTransition();
  }, K.version = "19.2.0", K;
}
var Rr;
function Uf() {
  return Rr || (Rr = 1, pf.exports = sm()), pf.exports;
}
var Rt = Uf(), bf = { exports: {} }, Hu = {}, Tf = { exports: {} }, zf = {};
var Or;
function rm() {
  return Or || (Or = 1, (function(g) {
    function A(S, U) {
      var q = S.length;
      S.push(U);
      l: for (; 0 < q; ) {
        var nl = q - 1 >>> 1, sl = S[nl];
        if (0 < N(sl, U))
          S[nl] = U, S[q] = sl, q = nl;
        else break l;
      }
    }
    function D(S) {
      return S.length === 0 ? null : S[0];
    }
    function f(S) {
      if (S.length === 0) return null;
      var U = S[0], q = S.pop();
      if (q !== U) {
        S[0] = q;
        l: for (var nl = 0, sl = S.length, r = sl >>> 1; nl < r; ) {
          var z = 2 * (nl + 1) - 1, R = S[z], C = z + 1, X = S[C];
          if (0 > N(R, q))
            C < sl && 0 > N(X, R) ? (S[nl] = X, S[C] = q, nl = C) : (S[nl] = R, S[z] = q, nl = z);
          else if (C < sl && 0 > N(X, q))
            S[nl] = X, S[C] = q, nl = C;
          else break l;
        }
      }
      return U;
    }
    function N(S, U) {
      var q = S.sortIndex - U.sortIndex;
      return q !== 0 ? q : S.id - U.id;
    }
    if (g.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var Q = performance;
      g.unstable_now = function() {
        return Q.now();
      };
    } else {
      var J = Date, Z = J.now();
      g.unstable_now = function() {
        return J.now() - Z;
      };
    }
    var x = [], T = [], M = 1, _ = null, L = 3, hl = !1, cl = !1, P = !1, zl = !1, ul = typeof setTimeout == "function" ? setTimeout : null, gl = typeof clearTimeout == "function" ? clearTimeout : null, El = typeof setImmediate < "u" ? setImmediate : null;
    function k(S) {
      for (var U = D(T); U !== null; ) {
        if (U.callback === null) f(T);
        else if (U.startTime <= S)
          f(T), U.sortIndex = U.expirationTime, A(x, U);
        else break;
        U = D(T);
      }
    }
    function Yl(S) {
      if (P = !1, k(S), !cl)
        if (D(x) !== null)
          cl = !0, O || (O = !0, Xl());
        else {
          var U = D(T);
          U !== null && tt(Yl, U.startTime - S);
        }
    }
    var O = !1, w = -1, vl = 5, lt = -1;
    function qt() {
      return zl ? !0 : !(g.unstable_now() - lt < vl);
    }
    function $l() {
      if (zl = !1, O) {
        var S = g.unstable_now();
        lt = S;
        var U = !0;
        try {
          l: {
            cl = !1, P && (P = !1, gl(w), w = -1), hl = !0;
            var q = L;
            try {
              t: {
                for (k(S), _ = D(x); _ !== null && !(_.expirationTime > S && qt()); ) {
                  var nl = _.callback;
                  if (typeof nl == "function") {
                    _.callback = null, L = _.priorityLevel;
                    var sl = nl(
                      _.expirationTime <= S
                    );
                    if (S = g.unstable_now(), typeof sl == "function") {
                      _.callback = sl, k(S), U = !0;
                      break t;
                    }
                    _ === D(x) && f(x), k(S);
                  } else f(x);
                  _ = D(x);
                }
                if (_ !== null) U = !0;
                else {
                  var r = D(T);
                  r !== null && tt(
                    Yl,
                    r.startTime - S
                  ), U = !1;
                }
              }
              break l;
            } finally {
              _ = null, L = q, hl = !1;
            }
            U = void 0;
          }
        } finally {
          U ? Xl() : O = !1;
        }
      }
    }
    var Xl;
    if (typeof El == "function")
      Xl = function() {
        El($l);
      };
    else if (typeof MessageChannel < "u") {
      var St = new MessageChannel(), pt = St.port2;
      St.port1.onmessage = $l, Xl = function() {
        pt.postMessage(null);
      };
    } else
      Xl = function() {
        ul($l, 0);
      };
    function tt(S, U) {
      w = ul(function() {
        S(g.unstable_now());
      }, U);
    }
    g.unstable_IdlePriority = 5, g.unstable_ImmediatePriority = 1, g.unstable_LowPriority = 4, g.unstable_NormalPriority = 3, g.unstable_Profiling = null, g.unstable_UserBlockingPriority = 2, g.unstable_cancelCallback = function(S) {
      S.callback = null;
    }, g.unstable_forceFrameRate = function(S) {
      0 > S || 125 < S ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : vl = 0 < S ? Math.floor(1e3 / S) : 5;
    }, g.unstable_getCurrentPriorityLevel = function() {
      return L;
    }, g.unstable_next = function(S) {
      switch (L) {
        case 1:
        case 2:
        case 3:
          var U = 3;
          break;
        default:
          U = L;
      }
      var q = L;
      L = U;
      try {
        return S();
      } finally {
        L = q;
      }
    }, g.unstable_requestPaint = function() {
      zl = !0;
    }, g.unstable_runWithPriority = function(S, U) {
      switch (S) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          S = 3;
      }
      var q = L;
      L = S;
      try {
        return U();
      } finally {
        L = q;
      }
    }, g.unstable_scheduleCallback = function(S, U, q) {
      var nl = g.unstable_now();
      switch (typeof q == "object" && q !== null ? (q = q.delay, q = typeof q == "number" && 0 < q ? nl + q : nl) : q = nl, S) {
        case 1:
          var sl = -1;
          break;
        case 2:
          sl = 250;
          break;
        case 5:
          sl = 1073741823;
          break;
        case 4:
          sl = 1e4;
          break;
        default:
          sl = 5e3;
      }
      return sl = q + sl, S = {
        id: M++,
        callback: U,
        priorityLevel: S,
        startTime: q,
        expirationTime: sl,
        sortIndex: -1
      }, q > nl ? (S.sortIndex = q, A(T, S), D(x) === null && S === D(T) && (P ? (gl(w), w = -1) : P = !0, tt(Yl, q - nl))) : (S.sortIndex = sl, A(x, S), cl || hl || (cl = !0, O || (O = !0, Xl()))), S;
    }, g.unstable_shouldYield = qt, g.unstable_wrapCallback = function(S) {
      var U = L;
      return function() {
        var q = L;
        L = U;
        try {
          return S.apply(this, arguments);
        } finally {
          L = q;
        }
      };
    };
  })(zf)), zf;
}
var Nr;
function hm() {
  return Nr || (Nr = 1, Tf.exports = rm()), Tf.exports;
}
var Ef = { exports: {} }, Fl = {};
var Cr;
function dm() {
  if (Cr) return Fl;
  Cr = 1;
  var g = Uf();
  function A(x) {
    var T = "https://react.dev/errors/" + x;
    if (1 < arguments.length) {
      T += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var M = 2; M < arguments.length; M++)
        T += "&args[]=" + encodeURIComponent(arguments[M]);
    }
    return "Minified React error #" + x + "; visit " + T + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function D() {
  }
  var f = {
    d: {
      f: D,
      r: function() {
        throw Error(A(522));
      },
      D,
      C: D,
      L: D,
      m: D,
      X: D,
      S: D,
      M: D
    },
    p: 0,
    findDOMNode: null
  }, N = /* @__PURE__ */ Symbol.for("react.portal");
  function Q(x, T, M) {
    var _ = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: N,
      key: _ == null ? null : "" + _,
      children: x,
      containerInfo: T,
      implementation: M
    };
  }
  var J = g.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function Z(x, T) {
    if (x === "font") return "";
    if (typeof T == "string")
      return T === "use-credentials" ? T : "";
  }
  return Fl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = f, Fl.createPortal = function(x, T) {
    var M = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!T || T.nodeType !== 1 && T.nodeType !== 9 && T.nodeType !== 11)
      throw Error(A(299));
    return Q(x, T, null, M);
  }, Fl.flushSync = function(x) {
    var T = J.T, M = f.p;
    try {
      if (J.T = null, f.p = 2, x) return x();
    } finally {
      J.T = T, f.p = M, f.d.f();
    }
  }, Fl.preconnect = function(x, T) {
    typeof x == "string" && (T ? (T = T.crossOrigin, T = typeof T == "string" ? T === "use-credentials" ? T : "" : void 0) : T = null, f.d.C(x, T));
  }, Fl.prefetchDNS = function(x) {
    typeof x == "string" && f.d.D(x);
  }, Fl.preinit = function(x, T) {
    if (typeof x == "string" && T && typeof T.as == "string") {
      var M = T.as, _ = Z(M, T.crossOrigin), L = typeof T.integrity == "string" ? T.integrity : void 0, hl = typeof T.fetchPriority == "string" ? T.fetchPriority : void 0;
      M === "style" ? f.d.S(
        x,
        typeof T.precedence == "string" ? T.precedence : void 0,
        {
          crossOrigin: _,
          integrity: L,
          fetchPriority: hl
        }
      ) : M === "script" && f.d.X(x, {
        crossOrigin: _,
        integrity: L,
        fetchPriority: hl,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0
      });
    }
  }, Fl.preinitModule = function(x, T) {
    if (typeof x == "string")
      if (typeof T == "object" && T !== null) {
        if (T.as == null || T.as === "script") {
          var M = Z(
            T.as,
            T.crossOrigin
          );
          f.d.M(x, {
            crossOrigin: M,
            integrity: typeof T.integrity == "string" ? T.integrity : void 0,
            nonce: typeof T.nonce == "string" ? T.nonce : void 0
          });
        }
      } else T == null && f.d.M(x);
  }, Fl.preload = function(x, T) {
    if (typeof x == "string" && typeof T == "object" && T !== null && typeof T.as == "string") {
      var M = T.as, _ = Z(M, T.crossOrigin);
      f.d.L(x, M, {
        crossOrigin: _,
        integrity: typeof T.integrity == "string" ? T.integrity : void 0,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0,
        type: typeof T.type == "string" ? T.type : void 0,
        fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0,
        referrerPolicy: typeof T.referrerPolicy == "string" ? T.referrerPolicy : void 0,
        imageSrcSet: typeof T.imageSrcSet == "string" ? T.imageSrcSet : void 0,
        imageSizes: typeof T.imageSizes == "string" ? T.imageSizes : void 0,
        media: typeof T.media == "string" ? T.media : void 0
      });
    }
  }, Fl.preloadModule = function(x, T) {
    if (typeof x == "string")
      if (T) {
        var M = Z(T.as, T.crossOrigin);
        f.d.m(x, {
          as: typeof T.as == "string" && T.as !== "script" ? T.as : void 0,
          crossOrigin: M,
          integrity: typeof T.integrity == "string" ? T.integrity : void 0
        });
      } else f.d.m(x);
  }, Fl.requestFormReset = function(x) {
    f.d.r(x);
  }, Fl.unstable_batchedUpdates = function(x, T) {
    return x(T);
  }, Fl.useFormState = function(x, T, M) {
    return J.H.useFormState(x, T, M);
  }, Fl.useFormStatus = function() {
    return J.H.useHostTransitionStatus();
  }, Fl.version = "19.2.0", Fl;
}
var Hr;
function mm() {
  if (Hr) return Ef.exports;
  Hr = 1;
  function g() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(g);
      } catch (A) {
        console.error(A);
      }
  }
  return g(), Ef.exports = dm(), Ef.exports;
}
var qr;
function gm() {
  if (qr) return Hu;
  qr = 1;
  var g = hm(), A = Uf(), D = mm();
  function f(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        t += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function N(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function Q(l) {
    var t = l, e = l;
    if (l.alternate) for (; t.return; ) t = t.return;
    else {
      l = t;
      do
        t = l, (t.flags & 4098) !== 0 && (e = t.return), l = t.return;
      while (l);
    }
    return t.tag === 3 ? e : null;
  }
  function J(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Z(l) {
    if (l.tag === 31) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function x(l) {
    if (Q(l) !== l)
      throw Error(f(188));
  }
  function T(l) {
    var t = l.alternate;
    if (!t) {
      if (t = Q(l), t === null) throw Error(f(188));
      return t !== l ? null : l;
    }
    for (var e = l, a = t; ; ) {
      var u = e.return;
      if (u === null) break;
      var n = u.alternate;
      if (n === null) {
        if (a = u.return, a !== null) {
          e = a;
          continue;
        }
        break;
      }
      if (u.child === n.child) {
        for (n = u.child; n; ) {
          if (n === e) return x(u), l;
          if (n === a) return x(u), t;
          n = n.sibling;
        }
        throw Error(f(188));
      }
      if (e.return !== a.return) e = u, a = n;
      else {
        for (var i = !1, c = u.child; c; ) {
          if (c === e) {
            i = !0, e = u, a = n;
            break;
          }
          if (c === a) {
            i = !0, a = u, e = n;
            break;
          }
          c = c.sibling;
        }
        if (!i) {
          for (c = n.child; c; ) {
            if (c === e) {
              i = !0, e = n, a = u;
              break;
            }
            if (c === a) {
              i = !0, a = n, e = u;
              break;
            }
            c = c.sibling;
          }
          if (!i) throw Error(f(189));
        }
      }
      if (e.alternate !== a) throw Error(f(190));
    }
    if (e.tag !== 3) throw Error(f(188));
    return e.stateNode.current === e ? l : t;
  }
  function M(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = M(l), t !== null) return t;
      l = l.sibling;
    }
    return null;
  }
  var _ = Object.assign, L = /* @__PURE__ */ Symbol.for("react.element"), hl = /* @__PURE__ */ Symbol.for("react.transitional.element"), cl = /* @__PURE__ */ Symbol.for("react.portal"), P = /* @__PURE__ */ Symbol.for("react.fragment"), zl = /* @__PURE__ */ Symbol.for("react.strict_mode"), ul = /* @__PURE__ */ Symbol.for("react.profiler"), gl = /* @__PURE__ */ Symbol.for("react.consumer"), El = /* @__PURE__ */ Symbol.for("react.context"), k = /* @__PURE__ */ Symbol.for("react.forward_ref"), Yl = /* @__PURE__ */ Symbol.for("react.suspense"), O = /* @__PURE__ */ Symbol.for("react.suspense_list"), w = /* @__PURE__ */ Symbol.for("react.memo"), vl = /* @__PURE__ */ Symbol.for("react.lazy"), lt = /* @__PURE__ */ Symbol.for("react.activity"), qt = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), $l = Symbol.iterator;
  function Xl(l) {
    return l === null || typeof l != "object" ? null : (l = $l && l[$l] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var St = /* @__PURE__ */ Symbol.for("react.client.reference");
  function pt(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === St ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case P:
        return "Fragment";
      case ul:
        return "Profiler";
      case zl:
        return "StrictMode";
      case Yl:
        return "Suspense";
      case O:
        return "SuspenseList";
      case lt:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case cl:
          return "Portal";
        case El:
          return l.displayName || "Context";
        case gl:
          return (l._context.displayName || "Context") + ".Consumer";
        case k:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case w:
          return t = l.displayName || null, t !== null ? t : pt(l.type) || "Memo";
        case vl:
          t = l._payload, l = l._init;
          try {
            return pt(l(t));
          } catch {
          }
      }
    return null;
  }
  var tt = Array.isArray, S = A.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, U = D.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, q = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, nl = [], sl = -1;
  function r(l) {
    return { current: l };
  }
  function z(l) {
    0 > sl || (l.current = nl[sl], nl[sl] = null, sl--);
  }
  function R(l, t) {
    sl++, nl[sl] = l.current, l.current = t;
  }
  var C = r(null), X = r(null), $ = r(null), I = r(null);
  function jl(l, t) {
    switch (R($, t), R(X, l), R(C, null), t.nodeType) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? Fs(l) : 0;
        break;
      default:
        if (l = t.tagName, t = t.namespaceURI)
          t = Fs(t), l = $s(t, l);
        else
          switch (l) {
            case "svg":
              l = 1;
              break;
            case "math":
              l = 2;
              break;
            default:
              l = 0;
          }
    }
    z(C), R(C, l);
  }
  function Ml() {
    z(C), z(X), z($);
  }
  function ce(l) {
    l.memoizedState !== null && R(I, l);
    var t = C.current, e = $s(t, l.type);
    t !== e && (R(X, l), R(C, e));
  }
  function He(l) {
    X.current === l && (z(C), z(X)), I.current === l && (z(I), _u._currentValue = q);
  }
  var j, yl;
  function V(l) {
    if (j === void 0)
      try {
        throw Error();
      } catch (e) {
        var t = e.stack.trim().match(/\n( *(at )?)/);
        j = t && t[1] || "", yl = -1 < e.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + j + l + yl;
  }
  var Ol = !1;
  function Ot(l, t) {
    if (!l || Ol) return "";
    Ol = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var E = function() {
                throw Error();
              };
              if (Object.defineProperty(E.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(E, []);
                } catch (y) {
                  var v = y;
                }
                Reflect.construct(l, [], E);
              } else {
                try {
                  E.call();
                } catch (y) {
                  v = y;
                }
                l.call(E.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (y) {
                v = y;
              }
              (E = l()) && typeof E.catch == "function" && E.catch(function() {
              });
            }
          } catch (y) {
            if (y && v && typeof y.stack == "string")
              return [y.stack, v.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var u = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      u && u.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var n = a.DetermineComponentFrameRoot(), i = n[0], c = n[1];
      if (i && c) {
        var o = i.split(`
`), m = c.split(`
`);
        for (u = a = 0; a < o.length && !o[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; u < m.length && !m[u].includes(
          "DetermineComponentFrameRoot"
        ); )
          u++;
        if (a === o.length || u === m.length)
          for (a = o.length - 1, u = m.length - 1; 1 <= a && 0 <= u && o[a] !== m[u]; )
            u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (o[a] !== m[u]) {
            if (a !== 1 || u !== 1)
              do
                if (a--, u--, 0 > u || o[a] !== m[u]) {
                  var p = `
` + o[a].replace(" at new ", " at ");
                  return l.displayName && p.includes("<anonymous>") && (p = p.replace("<anonymous>", l.displayName)), p;
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      Ol = !1, Error.prepareStackTrace = e;
    }
    return (e = l ? l.displayName || l.name : "") ? V(e) : "";
  }
  function fe(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return V(l.type);
      case 16:
        return V("Lazy");
      case 13:
        return l.child !== t && t !== null ? V("Suspense Fallback") : V("Suspense");
      case 19:
        return V("SuspenseList");
      case 0:
      case 15:
        return Ot(l.type, !1);
      case 11:
        return Ot(l.type.render, !1);
      case 1:
        return Ot(l.type, !0);
      case 31:
        return V("Activity");
      default:
        return "";
    }
  }
  function qe(l) {
    try {
      var t = "", e = null;
      do
        t += fe(l, e), e = l, l = l.return;
      while (l);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var Ul = Object.prototype.hasOwnProperty, jt = g.unstable_scheduleCallback, Bt = g.unstable_cancelCallback, ti = g.unstable_shouldYield, ei = g.unstable_requestPaint, Il = g.unstable_now, ai = g.unstable_getCurrentPriorityLevel, Bu = g.unstable_ImmediatePriority, Xa = g.unstable_UserBlockingPriority, ta = g.unstable_NormalPriority, ui = g.unstable_LowPriority, _f = g.unstable_IdlePriority, Zr = g.log, Vr = g.unstable_setDisableYieldValue, ja = null, ot = null;
  function oe(l) {
    if (typeof Zr == "function" && Vr(l), ot && typeof ot.setStrictMode == "function")
      try {
        ot.setStrictMode(ja, l);
      } catch {
      }
  }
  var st = Math.clz32 ? Math.clz32 : kr, Kr = Math.log, Jr = Math.LN2;
  function kr(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (Kr(l) / Jr | 0) | 0;
  }
  var Lu = 256, Gu = 262144, Yu = 4194304;
  function Be(l) {
    var t = l & 42;
    if (t !== 0) return t;
    switch (l & -l) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return l & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return l & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return l & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return l;
    }
  }
  function Xu(l, t, e) {
    var a = l.pendingLanes;
    if (a === 0) return 0;
    var u = 0, n = l.suspendedLanes, i = l.pingedLanes;
    l = l.warmLanes;
    var c = a & 134217727;
    return c !== 0 ? (a = c & ~n, a !== 0 ? u = Be(a) : (i &= c, i !== 0 ? u = Be(i) : e || (e = c & ~l, e !== 0 && (u = Be(e))))) : (c = a & ~n, c !== 0 ? u = Be(c) : i !== 0 ? u = Be(i) : e || (e = a & ~l, e !== 0 && (u = Be(e)))), u === 0 ? 0 : t !== 0 && t !== u && (t & n) === 0 && (n = u & -u, e = t & -t, n >= e || n === 32 && (e & 4194048) !== 0) ? t : u;
  }
  function wa(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function Wr(l, t) {
    switch (l) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Rf() {
    var l = Yu;
    return Yu <<= 1, (Yu & 62914560) === 0 && (Yu = 4194304), l;
  }
  function ni(l) {
    for (var t = [], e = 0; 31 > e; e++) t.push(l);
    return t;
  }
  function Qa(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function Fr(l, t, e, a, u, n) {
    var i = l.pendingLanes;
    l.pendingLanes = e, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= e, l.entangledLanes &= e, l.errorRecoveryDisabledLanes &= e, l.shellSuspendCounter = 0;
    var c = l.entanglements, o = l.expirationTimes, m = l.hiddenUpdates;
    for (e = i & ~e; 0 < e; ) {
      var p = 31 - st(e), E = 1 << p;
      c[p] = 0, o[p] = -1;
      var v = m[p];
      if (v !== null)
        for (m[p] = null, p = 0; p < v.length; p++) {
          var y = v[p];
          y !== null && (y.lane &= -536870913);
        }
      e &= ~E;
    }
    a !== 0 && Of(l, a, 0), n !== 0 && u === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(i & ~t));
  }
  function Of(l, t, e) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var a = 31 - st(t);
    l.entangledLanes |= t, l.entanglements[a] = l.entanglements[a] | 1073741824 | e & 261930;
  }
  function Nf(l, t) {
    var e = l.entangledLanes |= t;
    for (l = l.entanglements; e; ) {
      var a = 31 - st(e), u = 1 << a;
      u & t | l[a] & t && (l[a] |= t), e &= ~u;
    }
  }
  function Cf(l, t) {
    var e = t & -t;
    return e = (e & 42) !== 0 ? 1 : ii(e), (e & (l.suspendedLanes | t)) !== 0 ? 0 : e;
  }
  function ii(l) {
    switch (l) {
      case 2:
        l = 1;
        break;
      case 8:
        l = 4;
        break;
      case 32:
        l = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        l = 128;
        break;
      case 268435456:
        l = 134217728;
        break;
      default:
        l = 0;
    }
    return l;
  }
  function ci(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Hf() {
    var l = U.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : br(l.type));
  }
  function qf(l, t) {
    var e = U.p;
    try {
      return U.p = l, t();
    } finally {
      U.p = e;
    }
  }
  var se = Math.random().toString(36).slice(2), Vl = "__reactFiber$" + se, et = "__reactProps$" + se, ea = "__reactContainer$" + se, fi = "__reactEvents$" + se, $r = "__reactListeners$" + se, Ir = "__reactHandles$" + se, Bf = "__reactResources$" + se, Za = "__reactMarker$" + se;
  function oi(l) {
    delete l[Vl], delete l[et], delete l[fi], delete l[$r], delete l[Ir];
  }
  function aa(l) {
    var t = l[Vl];
    if (t) return t;
    for (var e = l.parentNode; e; ) {
      if (t = e[ea] || e[Vl]) {
        if (e = t.alternate, t.child !== null || e !== null && e.child !== null)
          for (l = ur(l); l !== null; ) {
            if (e = l[Vl]) return e;
            l = ur(l);
          }
        return t;
      }
      l = e, e = l.parentNode;
    }
    return null;
  }
  function ua(l) {
    if (l = l[Vl] || l[ea]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function Va(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(f(33));
  }
  function na(l) {
    var t = l[Bf];
    return t || (t = l[Bf] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Ql(l) {
    l[Za] = !0;
  }
  var Lf = /* @__PURE__ */ new Set(), Gf = {};
  function Le(l, t) {
    ia(l, t), ia(l + "Capture", t);
  }
  function ia(l, t) {
    for (Gf[l] = t, l = 0; l < t.length; l++)
      Lf.add(t[l]);
  }
  var Pr = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Yf = {}, Xf = {};
  function lh(l) {
    return Ul.call(Xf, l) ? !0 : Ul.call(Yf, l) ? !1 : Pr.test(l) ? Xf[l] = !0 : (Yf[l] = !0, !1);
  }
  function ju(l, t, e) {
    if (lh(t))
      if (e === null) l.removeAttribute(t);
      else {
        switch (typeof e) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, "" + e);
      }
  }
  function wu(l, t, e) {
    if (e === null) l.removeAttribute(t);
    else {
      switch (typeof e) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(t);
          return;
      }
      l.setAttribute(t, "" + e);
    }
  }
  function wt(l, t, e, a) {
    if (a === null) l.removeAttribute(e);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(e);
          return;
      }
      l.setAttributeNS(t, e, "" + a);
    }
  }
  function bt(l) {
    switch (typeof l) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return l;
      case "object":
        return l;
      default:
        return "";
    }
  }
  function jf(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function th(l, t, e) {
    var a = Object.getOwnPropertyDescriptor(
      l.constructor.prototype,
      t
    );
    if (!l.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var u = a.get, n = a.set;
      return Object.defineProperty(l, t, {
        configurable: !0,
        get: function() {
          return u.call(this);
        },
        set: function(i) {
          e = "" + i, n.call(this, i);
        }
      }), Object.defineProperty(l, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return e;
        },
        setValue: function(i) {
          e = "" + i;
        },
        stopTracking: function() {
          l._valueTracker = null, delete l[t];
        }
      };
    }
  }
  function si(l) {
    if (!l._valueTracker) {
      var t = jf(l) ? "checked" : "value";
      l._valueTracker = th(
        l,
        t,
        "" + l[t]
      );
    }
  }
  function wf(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var e = t.getValue(), a = "";
    return l && (a = jf(l) ? l.checked ? "true" : "false" : l.value), l = a, l !== e ? (t.setValue(l), !0) : !1;
  }
  function Qu(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  var eh = /[\n"\\]/g;
  function Tt(l) {
    return l.replace(
      eh,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function ri(l, t, e, a, u, n, i, c) {
    l.name = "", i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? l.type = i : l.removeAttribute("type"), t != null ? i === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + bt(t)) : l.value !== "" + bt(t) && (l.value = "" + bt(t)) : i !== "submit" && i !== "reset" || l.removeAttribute("value"), t != null ? hi(l, i, bt(t)) : e != null ? hi(l, i, bt(e)) : a != null && l.removeAttribute("value"), u == null && n != null && (l.defaultChecked = !!n), u != null && (l.checked = u && typeof u != "function" && typeof u != "symbol"), c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? l.name = "" + bt(c) : l.removeAttribute("name");
  }
  function Qf(l, t, e, a, u, n, i, c) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n), t != null || e != null) {
      if (!(n !== "submit" && n !== "reset" || t != null)) {
        si(l);
        return;
      }
      e = e != null ? "" + bt(e) : "", t = t != null ? "" + bt(t) : e, c || t === l.value || (l.value = t), l.defaultValue = t;
    }
    a = a ?? u, a = typeof a != "function" && typeof a != "symbol" && !!a, l.checked = c ? l.checked : !!a, l.defaultChecked = !!a, i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (l.name = i), si(l);
  }
  function hi(l, t, e) {
    t === "number" && Qu(l.ownerDocument) === l || l.defaultValue === "" + e || (l.defaultValue = "" + e);
  }
  function ca(l, t, e, a) {
    if (l = l.options, t) {
      t = {};
      for (var u = 0; u < e.length; u++)
        t["$" + e[u]] = !0;
      for (e = 0; e < l.length; e++)
        u = t.hasOwnProperty("$" + l[e].value), l[e].selected !== u && (l[e].selected = u), u && a && (l[e].defaultSelected = !0);
    } else {
      for (e = "" + bt(e), t = null, u = 0; u < l.length; u++) {
        if (l[u].value === e) {
          l[u].selected = !0, a && (l[u].defaultSelected = !0);
          return;
        }
        t !== null || l[u].disabled || (t = l[u]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Zf(l, t, e) {
    if (t != null && (t = "" + bt(t), t !== l.value && (l.value = t), e == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = e != null ? "" + bt(e) : "";
  }
  function Vf(l, t, e, a) {
    if (t == null) {
      if (a != null) {
        if (e != null) throw Error(f(92));
        if (tt(a)) {
          if (1 < a.length) throw Error(f(93));
          a = a[0];
        }
        e = a;
      }
      e == null && (e = ""), t = e;
    }
    e = bt(t), l.defaultValue = e, a = l.textContent, a === e && a !== "" && a !== null && (l.value = a), si(l);
  }
  function fa(l, t) {
    if (t) {
      var e = l.firstChild;
      if (e && e === l.lastChild && e.nodeType === 3) {
        e.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var ah = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Kf(l, t, e) {
    var a = t.indexOf("--") === 0;
    e == null || typeof e == "boolean" || e === "" ? a ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : a ? l.setProperty(t, e) : typeof e != "number" || e === 0 || ah.has(t) ? t === "float" ? l.cssFloat = e : l[t] = ("" + e).trim() : l[t] = e + "px";
  }
  function Jf(l, t, e) {
    if (t != null && typeof t != "object")
      throw Error(f(62));
    if (l = l.style, e != null) {
      for (var a in e)
        !e.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? l.setProperty(a, "") : a === "float" ? l.cssFloat = "" : l[a] = "");
      for (var u in t)
        a = t[u], t.hasOwnProperty(u) && e[u] !== a && Kf(l, u, a);
    } else
      for (var n in t)
        t.hasOwnProperty(n) && Kf(l, n, t[n]);
  }
  function di(l) {
    if (l.indexOf("-") === -1) return !1;
    switch (l) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var uh = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), nh = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Zu(l) {
    return nh.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  function Qt() {
  }
  var mi = null;
  function gi(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var oa = null, sa = null;
  function kf(l) {
    var t = ua(l);
    if (t && (l = t.stateNode)) {
      var e = l[et] || null;
      l: switch (l = t.stateNode, t.type) {
        case "input":
          if (ri(
            l,
            e.value,
            e.defaultValue,
            e.defaultValue,
            e.checked,
            e.defaultChecked,
            e.type,
            e.name
          ), t = e.name, e.type === "radio" && t != null) {
            for (e = l; e.parentNode; ) e = e.parentNode;
            for (e = e.querySelectorAll(
              'input[name="' + Tt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < e.length; t++) {
              var a = e[t];
              if (a !== l && a.form === l.form) {
                var u = a[et] || null;
                if (!u) throw Error(f(90));
                ri(
                  a,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name
                );
              }
            }
            for (t = 0; t < e.length; t++)
              a = e[t], a.form === l.form && wf(a);
          }
          break l;
        case "textarea":
          Zf(l, e.value, e.defaultValue);
          break l;
        case "select":
          t = e.value, t != null && ca(l, !!e.multiple, t, !1);
      }
    }
  }
  var vi = !1;
  function Wf(l, t, e) {
    if (vi) return l(t, e);
    vi = !0;
    try {
      var a = l(t);
      return a;
    } finally {
      if (vi = !1, (oa !== null || sa !== null) && (Nn(), oa && (t = oa, l = sa, sa = oa = null, kf(t), l)))
        for (t = 0; t < l.length; t++) kf(l[t]);
    }
  }
  function Ka(l, t) {
    var e = l.stateNode;
    if (e === null) return null;
    var a = e[et] || null;
    if (a === null) return null;
    e = a[t];
    l: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) || (l = l.type, a = !(l === "button" || l === "input" || l === "select" || l === "textarea")), l = !a;
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (e && typeof e != "function")
      throw Error(
        f(231, t, typeof e)
      );
    return e;
  }
  var Zt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), yi = !1;
  if (Zt)
    try {
      var Ja = {};
      Object.defineProperty(Ja, "passive", {
        get: function() {
          yi = !0;
        }
      }), window.addEventListener("test", Ja, Ja), window.removeEventListener("test", Ja, Ja);
    } catch {
      yi = !1;
    }
  var re = null, Si = null, Vu = null;
  function Ff() {
    if (Vu) return Vu;
    var l, t = Si, e = t.length, a, u = "value" in re ? re.value : re.textContent, n = u.length;
    for (l = 0; l < e && t[l] === u[l]; l++) ;
    var i = e - l;
    for (a = 1; a <= i && t[e - a] === u[n - a]; a++) ;
    return Vu = u.slice(l, 1 < a ? 1 - a : void 0);
  }
  function Ku(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function Ju() {
    return !0;
  }
  function $f() {
    return !1;
  }
  function at(l) {
    function t(e, a, u, n, i) {
      this._reactName = e, this._targetInst = u, this.type = a, this.nativeEvent = n, this.target = i, this.currentTarget = null;
      for (var c in l)
        l.hasOwnProperty(c) && (e = l[c], this[c] = e ? e(n) : n[c]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Ju : $f, this.isPropagationStopped = $f, this;
    }
    return _(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var e = this.nativeEvent;
        e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Ju);
      },
      stopPropagation: function() {
        var e = this.nativeEvent;
        e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Ju);
      },
      persist: function() {
      },
      isPersistent: Ju
    }), t;
  }
  var Ge = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, ku = at(Ge), ka = _({}, Ge, { view: 0, detail: 0 }), ih = at(ka), pi, bi, Wa, Wu = _({}, ka, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: zi,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== Wa && (Wa && l.type === "mousemove" ? (pi = l.screenX - Wa.screenX, bi = l.screenY - Wa.screenY) : bi = pi = 0, Wa = l), pi);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : bi;
    }
  }), If = at(Wu), ch = _({}, Wu, { dataTransfer: 0 }), fh = at(ch), oh = _({}, ka, { relatedTarget: 0 }), Ti = at(oh), sh = _({}, Ge, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), rh = at(sh), hh = _({}, Ge, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), dh = at(hh), mh = _({}, Ge, { data: 0 }), Pf = at(mh), gh = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, vh = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, yh = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Sh(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = yh[l]) ? !!t[l] : !1;
  }
  function zi() {
    return Sh;
  }
  var ph = _({}, ka, {
    key: function(l) {
      if (l.key) {
        var t = gh[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = Ku(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? vh[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: zi,
    charCode: function(l) {
      return l.type === "keypress" ? Ku(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? Ku(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), bh = at(ph), Th = _({}, Wu, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), lo = at(Th), zh = _({}, ka, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: zi
  }), Eh = at(zh), Ah = _({}, Ge, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), xh = at(Ah), Mh = _({}, Wu, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Dh = at(Mh), Uh = _({}, Ge, {
    newState: 0,
    oldState: 0
  }), _h = at(Uh), Rh = [9, 13, 27, 32], Ei = Zt && "CompositionEvent" in window, Fa = null;
  Zt && "documentMode" in document && (Fa = document.documentMode);
  var Oh = Zt && "TextEvent" in window && !Fa, to = Zt && (!Ei || Fa && 8 < Fa && 11 >= Fa), eo = " ", ao = !1;
  function uo(l, t) {
    switch (l) {
      case "keyup":
        return Rh.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function no(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var ra = !1;
  function Nh(l, t) {
    switch (l) {
      case "compositionend":
        return no(t);
      case "keypress":
        return t.which !== 32 ? null : (ao = !0, eo);
      case "textInput":
        return l = t.data, l === eo && ao ? null : l;
      default:
        return null;
    }
  }
  function Ch(l, t) {
    if (ra)
      return l === "compositionend" || !Ei && uo(l, t) ? (l = Ff(), Vu = Si = re = null, ra = !1, l) : null;
    switch (l) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return to && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Hh = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function io(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!Hh[l.type] : t === "textarea";
  }
  function co(l, t, e, a) {
    oa ? sa ? sa.push(a) : sa = [a] : oa = a, t = Yn(t, "onChange"), 0 < t.length && (e = new ku(
      "onChange",
      "change",
      null,
      e,
      a
    ), l.push({ event: e, listeners: t }));
  }
  var $a = null, Ia = null;
  function qh(l) {
    Zs(l, 0);
  }
  function Fu(l) {
    var t = Va(l);
    if (wf(t)) return l;
  }
  function fo(l, t) {
    if (l === "change") return t;
  }
  var oo = !1;
  if (Zt) {
    var Ai;
    if (Zt) {
      var xi = "oninput" in document;
      if (!xi) {
        var so = document.createElement("div");
        so.setAttribute("oninput", "return;"), xi = typeof so.oninput == "function";
      }
      Ai = xi;
    } else Ai = !1;
    oo = Ai && (!document.documentMode || 9 < document.documentMode);
  }
  function ro() {
    $a && ($a.detachEvent("onpropertychange", ho), Ia = $a = null);
  }
  function ho(l) {
    if (l.propertyName === "value" && Fu(Ia)) {
      var t = [];
      co(
        t,
        Ia,
        l,
        gi(l)
      ), Wf(qh, t);
    }
  }
  function Bh(l, t, e) {
    l === "focusin" ? (ro(), $a = t, Ia = e, $a.attachEvent("onpropertychange", ho)) : l === "focusout" && ro();
  }
  function Lh(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Fu(Ia);
  }
  function Gh(l, t) {
    if (l === "click") return Fu(t);
  }
  function Yh(l, t) {
    if (l === "input" || l === "change")
      return Fu(t);
  }
  function Xh(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var rt = typeof Object.is == "function" ? Object.is : Xh;
  function Pa(l, t) {
    if (rt(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var e = Object.keys(l), a = Object.keys(t);
    if (e.length !== a.length) return !1;
    for (a = 0; a < e.length; a++) {
      var u = e[a];
      if (!Ul.call(t, u) || !rt(l[u], t[u]))
        return !1;
    }
    return !0;
  }
  function mo(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function go(l, t) {
    var e = mo(l);
    l = 0;
    for (var a; e; ) {
      if (e.nodeType === 3) {
        if (a = l + e.textContent.length, l <= t && a >= t)
          return { node: e, offset: t - l };
        l = a;
      }
      l: {
        for (; e; ) {
          if (e.nextSibling) {
            e = e.nextSibling;
            break l;
          }
          e = e.parentNode;
        }
        e = void 0;
      }
      e = mo(e);
    }
  }
  function vo(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? vo(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function yo(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = Qu(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var e = typeof t.contentWindow.location.href == "string";
      } catch {
        e = !1;
      }
      if (e) l = t.contentWindow;
      else break;
      t = Qu(l.document);
    }
    return t;
  }
  function Mi(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var jh = Zt && "documentMode" in document && 11 >= document.documentMode, ha = null, Di = null, lu = null, Ui = !1;
  function So(l, t, e) {
    var a = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    Ui || ha == null || ha !== Qu(a) || (a = ha, "selectionStart" in a && Mi(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), lu && Pa(lu, a) || (lu = a, a = Yn(Di, "onSelect"), 0 < a.length && (t = new ku(
      "onSelect",
      "select",
      null,
      t,
      e
    ), l.push({ event: t, listeners: a }), t.target = ha)));
  }
  function Ye(l, t) {
    var e = {};
    return e[l.toLowerCase()] = t.toLowerCase(), e["Webkit" + l] = "webkit" + t, e["Moz" + l] = "moz" + t, e;
  }
  var da = {
    animationend: Ye("Animation", "AnimationEnd"),
    animationiteration: Ye("Animation", "AnimationIteration"),
    animationstart: Ye("Animation", "AnimationStart"),
    transitionrun: Ye("Transition", "TransitionRun"),
    transitionstart: Ye("Transition", "TransitionStart"),
    transitioncancel: Ye("Transition", "TransitionCancel"),
    transitionend: Ye("Transition", "TransitionEnd")
  }, _i = {}, po = {};
  Zt && (po = document.createElement("div").style, "AnimationEvent" in window || (delete da.animationend.animation, delete da.animationiteration.animation, delete da.animationstart.animation), "TransitionEvent" in window || delete da.transitionend.transition);
  function Xe(l) {
    if (_i[l]) return _i[l];
    if (!da[l]) return l;
    var t = da[l], e;
    for (e in t)
      if (t.hasOwnProperty(e) && e in po)
        return _i[l] = t[e];
    return l;
  }
  var bo = Xe("animationend"), To = Xe("animationiteration"), zo = Xe("animationstart"), wh = Xe("transitionrun"), Qh = Xe("transitionstart"), Zh = Xe("transitioncancel"), Eo = Xe("transitionend"), Ao = /* @__PURE__ */ new Map(), Ri = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Ri.push("scrollEnd");
  function Nt(l, t) {
    Ao.set(l, t), Le(t, [l]);
  }
  var $u = typeof reportError == "function" ? reportError : function(l) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof l == "object" && l !== null && typeof l.message == "string" ? String(l.message) : String(l),
        error: l
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", l);
      return;
    }
    console.error(l);
  }, zt = [], ma = 0, Oi = 0;
  function Iu() {
    for (var l = ma, t = Oi = ma = 0; t < l; ) {
      var e = zt[t];
      zt[t++] = null;
      var a = zt[t];
      zt[t++] = null;
      var u = zt[t];
      zt[t++] = null;
      var n = zt[t];
      if (zt[t++] = null, a !== null && u !== null) {
        var i = a.pending;
        i === null ? u.next = u : (u.next = i.next, i.next = u), a.pending = u;
      }
      n !== 0 && xo(e, u, n);
    }
  }
  function Pu(l, t, e, a) {
    zt[ma++] = l, zt[ma++] = t, zt[ma++] = e, zt[ma++] = a, Oi |= a, l.lanes |= a, l = l.alternate, l !== null && (l.lanes |= a);
  }
  function Ni(l, t, e, a) {
    return Pu(l, t, e, a), ln(l);
  }
  function je(l, t) {
    return Pu(l, null, null, t), ln(l);
  }
  function xo(l, t, e) {
    l.lanes |= e;
    var a = l.alternate;
    a !== null && (a.lanes |= e);
    for (var u = !1, n = l.return; n !== null; )
      n.childLanes |= e, a = n.alternate, a !== null && (a.childLanes |= e), n.tag === 22 && (l = n.stateNode, l === null || l._visibility & 1 || (u = !0)), l = n, n = n.return;
    return l.tag === 3 ? (n = l.stateNode, u && t !== null && (u = 31 - st(e), l = n.hiddenUpdates, a = l[u], a === null ? l[u] = [t] : a.push(t), t.lane = e | 536870912), n) : null;
  }
  function ln(l) {
    if (50 < zu)
      throw zu = 0, jc = null, Error(f(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var ga = {};
  function Vh(l, t, e, a) {
    this.tag = l, this.key = e, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ht(l, t, e, a) {
    return new Vh(l, t, e, a);
  }
  function Ci(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function Vt(l, t) {
    var e = l.alternate;
    return e === null ? (e = ht(
      l.tag,
      t,
      l.key,
      l.mode
    ), e.elementType = l.elementType, e.type = l.type, e.stateNode = l.stateNode, e.alternate = l, l.alternate = e) : (e.pendingProps = t, e.type = l.type, e.flags = 0, e.subtreeFlags = 0, e.deletions = null), e.flags = l.flags & 65011712, e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, t = l.dependencies, e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, e.sibling = l.sibling, e.index = l.index, e.ref = l.ref, e.refCleanup = l.refCleanup, e;
  }
  function Mo(l, t) {
    l.flags &= 65011714;
    var e = l.alternate;
    return e === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, l.type = e.type, t = e.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function tn(l, t, e, a, u, n) {
    var i = 0;
    if (a = l, typeof l == "function") Ci(l) && (i = 1);
    else if (typeof l == "string")
      i = Fd(
        l,
        e,
        C.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (l) {
        case lt:
          return l = ht(31, e, t, u), l.elementType = lt, l.lanes = n, l;
        case P:
          return we(e.children, u, n, t);
        case zl:
          i = 8, u |= 24;
          break;
        case ul:
          return l = ht(12, e, t, u | 2), l.elementType = ul, l.lanes = n, l;
        case Yl:
          return l = ht(13, e, t, u), l.elementType = Yl, l.lanes = n, l;
        case O:
          return l = ht(19, e, t, u), l.elementType = O, l.lanes = n, l;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case El:
                i = 10;
                break l;
              case gl:
                i = 9;
                break l;
              case k:
                i = 11;
                break l;
              case w:
                i = 14;
                break l;
              case vl:
                i = 16, a = null;
                break l;
            }
          i = 29, e = Error(
            f(130, l === null ? "null" : typeof l, "")
          ), a = null;
      }
    return t = ht(i, e, t, u), t.elementType = l, t.type = a, t.lanes = n, t;
  }
  function we(l, t, e, a) {
    return l = ht(7, l, a, t), l.lanes = e, l;
  }
  function Hi(l, t, e) {
    return l = ht(6, l, null, t), l.lanes = e, l;
  }
  function Do(l) {
    var t = ht(18, null, null, 0);
    return t.stateNode = l, t;
  }
  function qi(l, t, e) {
    return t = ht(
      4,
      l.children !== null ? l.children : [],
      l.key,
      t
    ), t.lanes = e, t.stateNode = {
      containerInfo: l.containerInfo,
      pendingChildren: null,
      implementation: l.implementation
    }, t;
  }
  var Uo = /* @__PURE__ */ new WeakMap();
  function Et(l, t) {
    if (typeof l == "object" && l !== null) {
      var e = Uo.get(l);
      return e !== void 0 ? e : (t = {
        value: l,
        source: t,
        stack: qe(t)
      }, Uo.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: qe(t)
    };
  }
  var va = [], ya = 0, en = null, tu = 0, At = [], xt = 0, he = null, Lt = 1, Gt = "";
  function Kt(l, t) {
    va[ya++] = tu, va[ya++] = en, en = l, tu = t;
  }
  function _o(l, t, e) {
    At[xt++] = Lt, At[xt++] = Gt, At[xt++] = he, he = l;
    var a = Lt;
    l = Gt;
    var u = 32 - st(a) - 1;
    a &= ~(1 << u), e += 1;
    var n = 32 - st(t) + u;
    if (30 < n) {
      var i = u - u % 5;
      n = (a & (1 << i) - 1).toString(32), a >>= i, u -= i, Lt = 1 << 32 - st(t) + u | e << u | a, Gt = n + l;
    } else
      Lt = 1 << n | e << u | a, Gt = l;
  }
  function Bi(l) {
    l.return !== null && (Kt(l, 1), _o(l, 1, 0));
  }
  function Li(l) {
    for (; l === en; )
      en = va[--ya], va[ya] = null, tu = va[--ya], va[ya] = null;
    for (; l === he; )
      he = At[--xt], At[xt] = null, Gt = At[--xt], At[xt] = null, Lt = At[--xt], At[xt] = null;
  }
  function Ro(l, t) {
    At[xt++] = Lt, At[xt++] = Gt, At[xt++] = he, Lt = t.id, Gt = t.overflow, he = l;
  }
  var Kl = null, Al = null, il = !1, de = null, Mt = !1, Gi = Error(f(519));
  function me(l) {
    var t = Error(
      f(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw eu(Et(t, l)), Gi;
  }
  function Oo(l) {
    var t = l.stateNode, e = l.type, a = l.memoizedProps;
    switch (t[Vl] = l, t[et] = a, e) {
      case "dialog":
        tl("cancel", t), tl("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        tl("load", t);
        break;
      case "video":
      case "audio":
        for (e = 0; e < Au.length; e++)
          tl(Au[e], t);
        break;
      case "source":
        tl("error", t);
        break;
      case "img":
      case "image":
      case "link":
        tl("error", t), tl("load", t);
        break;
      case "details":
        tl("toggle", t);
        break;
      case "input":
        tl("invalid", t), Qf(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        tl("invalid", t);
        break;
      case "textarea":
        tl("invalid", t), Vf(t, a.value, a.defaultValue, a.children);
    }
    e = a.children, typeof e != "string" && typeof e != "number" && typeof e != "bigint" || t.textContent === "" + e || a.suppressHydrationWarning === !0 || ks(t.textContent, e) ? (a.popover != null && (tl("beforetoggle", t), tl("toggle", t)), a.onScroll != null && tl("scroll", t), a.onScrollEnd != null && tl("scrollend", t), a.onClick != null && (t.onclick = Qt), t = !0) : t = !1, t || me(l, !0);
  }
  function No(l) {
    for (Kl = l.return; Kl; )
      switch (Kl.tag) {
        case 5:
        case 31:
        case 13:
          Mt = !1;
          return;
        case 27:
        case 3:
          Mt = !0;
          return;
        default:
          Kl = Kl.return;
      }
  }
  function Sa(l) {
    if (l !== Kl) return !1;
    if (!il) return No(l), il = !0, !1;
    var t = l.tag, e;
    if ((e = t !== 3 && t !== 27) && ((e = t === 5) && (e = l.type, e = !(e !== "form" && e !== "button") || ef(l.type, l.memoizedProps)), e = !e), e && Al && me(l), No(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(f(317));
      Al = ar(l);
    } else if (t === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(f(317));
      Al = ar(l);
    } else
      t === 27 ? (t = Al, Ue(l.type) ? (l = ff, ff = null, Al = l) : Al = t) : Al = Kl ? Ut(l.stateNode.nextSibling) : null;
    return !0;
  }
  function Qe() {
    Al = Kl = null, il = !1;
  }
  function Yi() {
    var l = de;
    return l !== null && (ct === null ? ct = l : ct.push.apply(
      ct,
      l
    ), de = null), l;
  }
  function eu(l) {
    de === null ? de = [l] : de.push(l);
  }
  var Xi = r(null), Ze = null, Jt = null;
  function ge(l, t, e) {
    R(Xi, t._currentValue), t._currentValue = e;
  }
  function kt(l) {
    l._currentValue = Xi.current, z(Xi);
  }
  function ji(l, t, e) {
    for (; l !== null; ) {
      var a = l.alternate;
      if ((l.childLanes & t) !== t ? (l.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), l === e) break;
      l = l.return;
    }
  }
  function wi(l, t, e, a) {
    var u = l.child;
    for (u !== null && (u.return = l); u !== null; ) {
      var n = u.dependencies;
      if (n !== null) {
        var i = u.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var c = n;
          n = u;
          for (var o = 0; o < t.length; o++)
            if (c.context === t[o]) {
              n.lanes |= e, c = n.alternate, c !== null && (c.lanes |= e), ji(
                n.return,
                e,
                l
              ), a || (i = null);
              break l;
            }
          n = c.next;
        }
      } else if (u.tag === 18) {
        if (i = u.return, i === null) throw Error(f(341));
        i.lanes |= e, n = i.alternate, n !== null && (n.lanes |= e), ji(i, e, l), i = null;
      } else i = u.child;
      if (i !== null) i.return = u;
      else
        for (i = u; i !== null; ) {
          if (i === l) {
            i = null;
            break;
          }
          if (u = i.sibling, u !== null) {
            u.return = i.return, i = u;
            break;
          }
          i = i.return;
        }
      u = i;
    }
  }
  function pa(l, t, e, a) {
    l = null;
    for (var u = t, n = !1; u !== null; ) {
      if (!n) {
        if ((u.flags & 524288) !== 0) n = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var i = u.alternate;
        if (i === null) throw Error(f(387));
        if (i = i.memoizedProps, i !== null) {
          var c = u.type;
          rt(u.pendingProps.value, i.value) || (l !== null ? l.push(c) : l = [c]);
        }
      } else if (u === I.current) {
        if (i = u.alternate, i === null) throw Error(f(387));
        i.memoizedState.memoizedState !== u.memoizedState.memoizedState && (l !== null ? l.push(_u) : l = [_u]);
      }
      u = u.return;
    }
    l !== null && wi(
      t,
      l,
      e,
      a
    ), t.flags |= 262144;
  }
  function an(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!rt(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function Ve(l) {
    Ze = l, Jt = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function Jl(l) {
    return Co(Ze, l);
  }
  function un(l, t) {
    return Ze === null && Ve(l), Co(l, t);
  }
  function Co(l, t) {
    var e = t._currentValue;
    if (t = { context: t, memoizedValue: e, next: null }, Jt === null) {
      if (l === null) throw Error(f(308));
      Jt = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else Jt = Jt.next = t;
    return e;
  }
  var Kh = typeof AbortController < "u" ? AbortController : function() {
    var l = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(e, a) {
        l.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, l.forEach(function(e) {
        return e();
      });
    };
  }, Jh = g.unstable_scheduleCallback, kh = g.unstable_NormalPriority, ql = {
    $$typeof: El,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Qi() {
    return {
      controller: new Kh(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function au(l) {
    l.refCount--, l.refCount === 0 && Jh(kh, function() {
      l.controller.abort();
    });
  }
  var uu = null, Zi = 0, ba = 0, Ta = null;
  function Wh(l, t) {
    if (uu === null) {
      var e = uu = [];
      Zi = 0, ba = Jc(), Ta = {
        status: "pending",
        value: void 0,
        then: function(a) {
          e.push(a);
        }
      };
    }
    return Zi++, t.then(Ho, Ho), t;
  }
  function Ho() {
    if (--Zi === 0 && uu !== null) {
      Ta !== null && (Ta.status = "fulfilled");
      var l = uu;
      uu = null, ba = 0, Ta = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function Fh(l, t) {
    var e = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(u) {
        e.push(u);
      }
    };
    return l.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var u = 0; u < e.length; u++) (0, e[u])(t);
      },
      function(u) {
        for (a.status = "rejected", a.reason = u, u = 0; u < e.length; u++)
          (0, e[u])(void 0);
      }
    ), a;
  }
  var qo = S.S;
  S.S = function(l, t) {
    Ss = Il(), typeof t == "object" && t !== null && typeof t.then == "function" && Wh(l, t), qo !== null && qo(l, t);
  };
  var Ke = r(null);
  function Vi() {
    var l = Ke.current;
    return l !== null ? l : Tl.pooledCache;
  }
  function nn(l, t) {
    t === null ? R(Ke, Ke.current) : R(Ke, t.pool);
  }
  function Bo() {
    var l = Vi();
    return l === null ? null : { parent: ql._currentValue, pool: l };
  }
  var za = Error(f(460)), Ki = Error(f(474)), cn = Error(f(542)), fn = { then: function() {
  } };
  function Lo(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function Go(l, t, e) {
    switch (e = l[e], e === void 0 ? l.push(t) : e !== t && (t.then(Qt, Qt), t = e), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, Xo(l), l;
      default:
        if (typeof t.status == "string") t.then(Qt, Qt);
        else {
          if (l = Tl, l !== null && 100 < l.shellSuspendCounter)
            throw Error(f(482));
          l = t, l.status = "pending", l.then(
            function(a) {
              if (t.status === "pending") {
                var u = t;
                u.status = "fulfilled", u.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var u = t;
                u.status = "rejected", u.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw l = t.reason, Xo(l), l;
        }
        throw ke = t, za;
    }
  }
  function Je(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (e) {
      throw e !== null && typeof e == "object" && typeof e.then == "function" ? (ke = e, za) : e;
    }
  }
  var ke = null;
  function Yo() {
    if (ke === null) throw Error(f(459));
    var l = ke;
    return ke = null, l;
  }
  function Xo(l) {
    if (l === za || l === cn)
      throw Error(f(483));
  }
  var Ea = null, nu = 0;
  function on(l) {
    var t = nu;
    return nu += 1, Ea === null && (Ea = []), Go(Ea, l, t);
  }
  function iu(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function sn(l, t) {
    throw t.$$typeof === L ? Error(f(525)) : (l = Object.prototype.toString.call(t), Error(
      f(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l
      )
    ));
  }
  function jo(l) {
    function t(h, s) {
      if (l) {
        var d = h.deletions;
        d === null ? (h.deletions = [s], h.flags |= 16) : d.push(s);
      }
    }
    function e(h, s) {
      if (!l) return null;
      for (; s !== null; )
        t(h, s), s = s.sibling;
      return null;
    }
    function a(h) {
      for (var s = /* @__PURE__ */ new Map(); h !== null; )
        h.key !== null ? s.set(h.key, h) : s.set(h.index, h), h = h.sibling;
      return s;
    }
    function u(h, s) {
      return h = Vt(h, s), h.index = 0, h.sibling = null, h;
    }
    function n(h, s, d) {
      return h.index = d, l ? (d = h.alternate, d !== null ? (d = d.index, d < s ? (h.flags |= 67108866, s) : d) : (h.flags |= 67108866, s)) : (h.flags |= 1048576, s);
    }
    function i(h) {
      return l && h.alternate === null && (h.flags |= 67108866), h;
    }
    function c(h, s, d, b) {
      return s === null || s.tag !== 6 ? (s = Hi(d, h.mode, b), s.return = h, s) : (s = u(s, d), s.return = h, s);
    }
    function o(h, s, d, b) {
      var G = d.type;
      return G === P ? p(
        h,
        s,
        d.props.children,
        b,
        d.key
      ) : s !== null && (s.elementType === G || typeof G == "object" && G !== null && G.$$typeof === vl && Je(G) === s.type) ? (s = u(s, d.props), iu(s, d), s.return = h, s) : (s = tn(
        d.type,
        d.key,
        d.props,
        null,
        h.mode,
        b
      ), iu(s, d), s.return = h, s);
    }
    function m(h, s, d, b) {
      return s === null || s.tag !== 4 || s.stateNode.containerInfo !== d.containerInfo || s.stateNode.implementation !== d.implementation ? (s = qi(d, h.mode, b), s.return = h, s) : (s = u(s, d.children || []), s.return = h, s);
    }
    function p(h, s, d, b, G) {
      return s === null || s.tag !== 7 ? (s = we(
        d,
        h.mode,
        b,
        G
      ), s.return = h, s) : (s = u(s, d), s.return = h, s);
    }
    function E(h, s, d) {
      if (typeof s == "string" && s !== "" || typeof s == "number" || typeof s == "bigint")
        return s = Hi(
          "" + s,
          h.mode,
          d
        ), s.return = h, s;
      if (typeof s == "object" && s !== null) {
        switch (s.$$typeof) {
          case hl:
            return d = tn(
              s.type,
              s.key,
              s.props,
              null,
              h.mode,
              d
            ), iu(d, s), d.return = h, d;
          case cl:
            return s = qi(
              s,
              h.mode,
              d
            ), s.return = h, s;
          case vl:
            return s = Je(s), E(h, s, d);
        }
        if (tt(s) || Xl(s))
          return s = we(
            s,
            h.mode,
            d,
            null
          ), s.return = h, s;
        if (typeof s.then == "function")
          return E(h, on(s), d);
        if (s.$$typeof === El)
          return E(
            h,
            un(h, s),
            d
          );
        sn(h, s);
      }
      return null;
    }
    function v(h, s, d, b) {
      var G = s !== null ? s.key : null;
      if (typeof d == "string" && d !== "" || typeof d == "number" || typeof d == "bigint")
        return G !== null ? null : c(h, s, "" + d, b);
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case hl:
            return d.key === G ? o(h, s, d, b) : null;
          case cl:
            return d.key === G ? m(h, s, d, b) : null;
          case vl:
            return d = Je(d), v(h, s, d, b);
        }
        if (tt(d) || Xl(d))
          return G !== null ? null : p(h, s, d, b, null);
        if (typeof d.then == "function")
          return v(
            h,
            s,
            on(d),
            b
          );
        if (d.$$typeof === El)
          return v(
            h,
            s,
            un(h, d),
            b
          );
        sn(h, d);
      }
      return null;
    }
    function y(h, s, d, b, G) {
      if (typeof b == "string" && b !== "" || typeof b == "number" || typeof b == "bigint")
        return h = h.get(d) || null, c(s, h, "" + b, G);
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case hl:
            return h = h.get(
              b.key === null ? d : b.key
            ) || null, o(s, h, b, G);
          case cl:
            return h = h.get(
              b.key === null ? d : b.key
            ) || null, m(s, h, b, G);
          case vl:
            return b = Je(b), y(
              h,
              s,
              d,
              b,
              G
            );
        }
        if (tt(b) || Xl(b))
          return h = h.get(d) || null, p(s, h, b, G, null);
        if (typeof b.then == "function")
          return y(
            h,
            s,
            d,
            on(b),
            G
          );
        if (b.$$typeof === El)
          return y(
            h,
            s,
            d,
            un(s, b),
            G
          );
        sn(s, b);
      }
      return null;
    }
    function H(h, s, d, b) {
      for (var G = null, fl = null, B = s, F = s = 0, al = null; B !== null && F < d.length; F++) {
        B.index > F ? (al = B, B = null) : al = B.sibling;
        var ol = v(
          h,
          B,
          d[F],
          b
        );
        if (ol === null) {
          B === null && (B = al);
          break;
        }
        l && B && ol.alternate === null && t(h, B), s = n(ol, s, F), fl === null ? G = ol : fl.sibling = ol, fl = ol, B = al;
      }
      if (F === d.length)
        return e(h, B), il && Kt(h, F), G;
      if (B === null) {
        for (; F < d.length; F++)
          B = E(h, d[F], b), B !== null && (s = n(
            B,
            s,
            F
          ), fl === null ? G = B : fl.sibling = B, fl = B);
        return il && Kt(h, F), G;
      }
      for (B = a(B); F < d.length; F++)
        al = y(
          B,
          h,
          F,
          d[F],
          b
        ), al !== null && (l && al.alternate !== null && B.delete(
          al.key === null ? F : al.key
        ), s = n(
          al,
          s,
          F
        ), fl === null ? G = al : fl.sibling = al, fl = al);
      return l && B.forEach(function(Ce) {
        return t(h, Ce);
      }), il && Kt(h, F), G;
    }
    function Y(h, s, d, b) {
      if (d == null) throw Error(f(151));
      for (var G = null, fl = null, B = s, F = s = 0, al = null, ol = d.next(); B !== null && !ol.done; F++, ol = d.next()) {
        B.index > F ? (al = B, B = null) : al = B.sibling;
        var Ce = v(h, B, ol.value, b);
        if (Ce === null) {
          B === null && (B = al);
          break;
        }
        l && B && Ce.alternate === null && t(h, B), s = n(Ce, s, F), fl === null ? G = Ce : fl.sibling = Ce, fl = Ce, B = al;
      }
      if (ol.done)
        return e(h, B), il && Kt(h, F), G;
      if (B === null) {
        for (; !ol.done; F++, ol = d.next())
          ol = E(h, ol.value, b), ol !== null && (s = n(ol, s, F), fl === null ? G = ol : fl.sibling = ol, fl = ol);
        return il && Kt(h, F), G;
      }
      for (B = a(B); !ol.done; F++, ol = d.next())
        ol = y(B, h, F, ol.value, b), ol !== null && (l && ol.alternate !== null && B.delete(ol.key === null ? F : ol.key), s = n(ol, s, F), fl === null ? G = ol : fl.sibling = ol, fl = ol);
      return l && B.forEach(function(cm) {
        return t(h, cm);
      }), il && Kt(h, F), G;
    }
    function bl(h, s, d, b) {
      if (typeof d == "object" && d !== null && d.type === P && d.key === null && (d = d.props.children), typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case hl:
            l: {
              for (var G = d.key; s !== null; ) {
                if (s.key === G) {
                  if (G = d.type, G === P) {
                    if (s.tag === 7) {
                      e(
                        h,
                        s.sibling
                      ), b = u(
                        s,
                        d.props.children
                      ), b.return = h, h = b;
                      break l;
                    }
                  } else if (s.elementType === G || typeof G == "object" && G !== null && G.$$typeof === vl && Je(G) === s.type) {
                    e(
                      h,
                      s.sibling
                    ), b = u(s, d.props), iu(b, d), b.return = h, h = b;
                    break l;
                  }
                  e(h, s);
                  break;
                } else t(h, s);
                s = s.sibling;
              }
              d.type === P ? (b = we(
                d.props.children,
                h.mode,
                b,
                d.key
              ), b.return = h, h = b) : (b = tn(
                d.type,
                d.key,
                d.props,
                null,
                h.mode,
                b
              ), iu(b, d), b.return = h, h = b);
            }
            return i(h);
          case cl:
            l: {
              for (G = d.key; s !== null; ) {
                if (s.key === G)
                  if (s.tag === 4 && s.stateNode.containerInfo === d.containerInfo && s.stateNode.implementation === d.implementation) {
                    e(
                      h,
                      s.sibling
                    ), b = u(s, d.children || []), b.return = h, h = b;
                    break l;
                  } else {
                    e(h, s);
                    break;
                  }
                else t(h, s);
                s = s.sibling;
              }
              b = qi(d, h.mode, b), b.return = h, h = b;
            }
            return i(h);
          case vl:
            return d = Je(d), bl(
              h,
              s,
              d,
              b
            );
        }
        if (tt(d))
          return H(
            h,
            s,
            d,
            b
          );
        if (Xl(d)) {
          if (G = Xl(d), typeof G != "function") throw Error(f(150));
          return d = G.call(d), Y(
            h,
            s,
            d,
            b
          );
        }
        if (typeof d.then == "function")
          return bl(
            h,
            s,
            on(d),
            b
          );
        if (d.$$typeof === El)
          return bl(
            h,
            s,
            un(h, d),
            b
          );
        sn(h, d);
      }
      return typeof d == "string" && d !== "" || typeof d == "number" || typeof d == "bigint" ? (d = "" + d, s !== null && s.tag === 6 ? (e(h, s.sibling), b = u(s, d), b.return = h, h = b) : (e(h, s), b = Hi(d, h.mode, b), b.return = h, h = b), i(h)) : e(h, s);
    }
    return function(h, s, d, b) {
      try {
        nu = 0;
        var G = bl(
          h,
          s,
          d,
          b
        );
        return Ea = null, G;
      } catch (B) {
        if (B === za || B === cn) throw B;
        var fl = ht(29, B, null, h.mode);
        return fl.lanes = b, fl.return = h, fl;
      }
    };
  }
  var We = jo(!0), wo = jo(!1), ve = !1;
  function Ji(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function ki(l, t) {
    l = l.updateQueue, t.updateQueue === l && (t.updateQueue = {
      baseState: l.baseState,
      firstBaseUpdate: l.firstBaseUpdate,
      lastBaseUpdate: l.lastBaseUpdate,
      shared: l.shared,
      callbacks: null
    });
  }
  function ye(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function Se(l, t, e) {
    var a = l.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (rl & 2) !== 0) {
      var u = a.pending;
      return u === null ? t.next = t : (t.next = u.next, u.next = t), a.pending = t, t = ln(l), xo(l, null, e), t;
    }
    return Pu(l, a, t, e), ln(l);
  }
  function cu(l, t, e) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (e & 4194048) !== 0)) {
      var a = t.lanes;
      a &= l.pendingLanes, e |= a, t.lanes = e, Nf(l, e);
    }
  }
  function Wi(l, t) {
    var e = l.updateQueue, a = l.alternate;
    if (a !== null && (a = a.updateQueue, e === a)) {
      var u = null, n = null;
      if (e = e.firstBaseUpdate, e !== null) {
        do {
          var i = {
            lane: e.lane,
            tag: e.tag,
            payload: e.payload,
            callback: null,
            next: null
          };
          n === null ? u = n = i : n = n.next = i, e = e.next;
        } while (e !== null);
        n === null ? u = n = t : n = n.next = t;
      } else u = n = t;
      e = {
        baseState: a.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: n,
        shared: a.shared,
        callbacks: a.callbacks
      }, l.updateQueue = e;
      return;
    }
    l = e.lastBaseUpdate, l === null ? e.firstBaseUpdate = t : l.next = t, e.lastBaseUpdate = t;
  }
  var Fi = !1;
  function fu() {
    if (Fi) {
      var l = Ta;
      if (l !== null) throw l;
    }
  }
  function ou(l, t, e, a) {
    Fi = !1;
    var u = l.updateQueue;
    ve = !1;
    var n = u.firstBaseUpdate, i = u.lastBaseUpdate, c = u.shared.pending;
    if (c !== null) {
      u.shared.pending = null;
      var o = c, m = o.next;
      o.next = null, i === null ? n = m : i.next = m, i = o;
      var p = l.alternate;
      p !== null && (p = p.updateQueue, c = p.lastBaseUpdate, c !== i && (c === null ? p.firstBaseUpdate = m : c.next = m, p.lastBaseUpdate = o));
    }
    if (n !== null) {
      var E = u.baseState;
      i = 0, p = m = o = null, c = n;
      do {
        var v = c.lane & -536870913, y = v !== c.lane;
        if (y ? (el & v) === v : (a & v) === v) {
          v !== 0 && v === ba && (Fi = !0), p !== null && (p = p.next = {
            lane: 0,
            tag: c.tag,
            payload: c.payload,
            callback: null,
            next: null
          });
          l: {
            var H = l, Y = c;
            v = t;
            var bl = e;
            switch (Y.tag) {
              case 1:
                if (H = Y.payload, typeof H == "function") {
                  E = H.call(bl, E, v);
                  break l;
                }
                E = H;
                break l;
              case 3:
                H.flags = H.flags & -65537 | 128;
              case 0:
                if (H = Y.payload, v = typeof H == "function" ? H.call(bl, E, v) : H, v == null) break l;
                E = _({}, E, v);
                break l;
              case 2:
                ve = !0;
            }
          }
          v = c.callback, v !== null && (l.flags |= 64, y && (l.flags |= 8192), y = u.callbacks, y === null ? u.callbacks = [v] : y.push(v));
        } else
          y = {
            lane: v,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null
          }, p === null ? (m = p = y, o = E) : p = p.next = y, i |= v;
        if (c = c.next, c === null) {
          if (c = u.shared.pending, c === null)
            break;
          y = c, c = y.next, y.next = null, u.lastBaseUpdate = y, u.shared.pending = null;
        }
      } while (!0);
      p === null && (o = E), u.baseState = o, u.firstBaseUpdate = m, u.lastBaseUpdate = p, n === null && (u.shared.lanes = 0), Ee |= i, l.lanes = i, l.memoizedState = E;
    }
  }
  function Qo(l, t) {
    if (typeof l != "function")
      throw Error(f(191, l));
    l.call(t);
  }
  function Zo(l, t) {
    var e = l.callbacks;
    if (e !== null)
      for (l.callbacks = null, l = 0; l < e.length; l++)
        Qo(e[l], t);
  }
  var Aa = r(null), rn = r(0);
  function Vo(l, t) {
    l = ae, R(rn, l), R(Aa, t), ae = l | t.baseLanes;
  }
  function $i() {
    R(rn, ae), R(Aa, Aa.current);
  }
  function Ii() {
    ae = rn.current, z(Aa), z(rn);
  }
  var dt = r(null), Dt = null;
  function pe(l) {
    var t = l.alternate;
    R(Nl, Nl.current & 1), R(dt, l), Dt === null && (t === null || Aa.current !== null || t.memoizedState !== null) && (Dt = l);
  }
  function Pi(l) {
    R(Nl, Nl.current), R(dt, l), Dt === null && (Dt = l);
  }
  function Ko(l) {
    l.tag === 22 ? (R(Nl, Nl.current), R(dt, l), Dt === null && (Dt = l)) : be();
  }
  function be() {
    R(Nl, Nl.current), R(dt, dt.current);
  }
  function mt(l) {
    z(dt), Dt === l && (Dt = null), z(Nl);
  }
  var Nl = r(0);
  function hn(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if (e !== null && (e = e.dehydrated, e === null || nf(e) || cf(e)))
          return t;
      } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === l) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === l) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Wt = 0, W = null, Sl = null, Bl = null, dn = !1, xa = !1, Fe = !1, mn = 0, su = 0, Ma = null, $h = 0;
  function _l() {
    throw Error(f(321));
  }
  function lc(l, t) {
    if (t === null) return !1;
    for (var e = 0; e < t.length && e < l.length; e++)
      if (!rt(l[e], t[e])) return !1;
    return !0;
  }
  function tc(l, t, e, a, u, n) {
    return Wt = n, W = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, S.H = l === null || l.memoizedState === null ? _0 : vc, Fe = !1, n = e(a, u), Fe = !1, xa && (n = ko(
      t,
      e,
      a,
      u
    )), Jo(l), n;
  }
  function Jo(l) {
    S.H = du;
    var t = Sl !== null && Sl.next !== null;
    if (Wt = 0, Bl = Sl = W = null, dn = !1, su = 0, Ma = null, t) throw Error(f(300));
    l === null || Ll || (l = l.dependencies, l !== null && an(l) && (Ll = !0));
  }
  function ko(l, t, e, a) {
    W = l;
    var u = 0;
    do {
      if (xa && (Ma = null), su = 0, xa = !1, 25 <= u) throw Error(f(301));
      if (u += 1, Bl = Sl = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      S.H = R0, n = t(e, a);
    } while (xa);
    return n;
  }
  function Ih() {
    var l = S.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? ru(t) : t, l = l.useState()[0], (Sl !== null ? Sl.memoizedState : null) !== l && (W.flags |= 1024), t;
  }
  function ec() {
    var l = mn !== 0;
    return mn = 0, l;
  }
  function ac(l, t, e) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~e;
  }
  function uc(l) {
    if (dn) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        t !== null && (t.pending = null), l = l.next;
      }
      dn = !1;
    }
    Wt = 0, Bl = Sl = W = null, xa = !1, su = mn = 0, Ma = null;
  }
  function Pl() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Bl === null ? W.memoizedState = Bl = l : Bl = Bl.next = l, Bl;
  }
  function Cl() {
    if (Sl === null) {
      var l = W.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = Sl.next;
    var t = Bl === null ? W.memoizedState : Bl.next;
    if (t !== null)
      Bl = t, Sl = l;
    else {
      if (l === null)
        throw W.alternate === null ? Error(f(467)) : Error(f(310));
      Sl = l, l = {
        memoizedState: Sl.memoizedState,
        baseState: Sl.baseState,
        baseQueue: Sl.baseQueue,
        queue: Sl.queue,
        next: null
      }, Bl === null ? W.memoizedState = Bl = l : Bl = Bl.next = l;
    }
    return Bl;
  }
  function gn() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function ru(l) {
    var t = su;
    return su += 1, Ma === null && (Ma = []), l = Go(Ma, l, t), t = W, (Bl === null ? t.memoizedState : Bl.next) === null && (t = t.alternate, S.H = t === null || t.memoizedState === null ? _0 : vc), l;
  }
  function vn(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return ru(l);
      if (l.$$typeof === El) return Jl(l);
    }
    throw Error(f(438, String(l)));
  }
  function nc(l) {
    var t = null, e = W.updateQueue;
    if (e !== null && (t = e.memoCache), t == null) {
      var a = W.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(u) {
          return u.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), e === null && (e = gn(), W.updateQueue = e), e.memoCache = t, e = t.data[t.index], e === void 0)
      for (e = t.data[t.index] = Array(l), a = 0; a < l; a++)
        e[a] = qt;
    return t.index++, e;
  }
  function Ft(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function yn(l) {
    var t = Cl();
    return ic(t, Sl, l);
  }
  function ic(l, t, e) {
    var a = l.queue;
    if (a === null) throw Error(f(311));
    a.lastRenderedReducer = e;
    var u = l.baseQueue, n = a.pending;
    if (n !== null) {
      if (u !== null) {
        var i = u.next;
        u.next = n.next, n.next = i;
      }
      t.baseQueue = u = n, a.pending = null;
    }
    if (n = l.baseState, u === null) l.memoizedState = n;
    else {
      t = u.next;
      var c = i = null, o = null, m = t, p = !1;
      do {
        var E = m.lane & -536870913;
        if (E !== m.lane ? (el & E) === E : (Wt & E) === E) {
          var v = m.revertLane;
          if (v === 0)
            o !== null && (o = o.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: m.action,
              hasEagerState: m.hasEagerState,
              eagerState: m.eagerState,
              next: null
            }), E === ba && (p = !0);
          else if ((Wt & v) === v) {
            m = m.next, v === ba && (p = !0);
            continue;
          } else
            E = {
              lane: 0,
              revertLane: m.revertLane,
              gesture: null,
              action: m.action,
              hasEagerState: m.hasEagerState,
              eagerState: m.eagerState,
              next: null
            }, o === null ? (c = o = E, i = n) : o = o.next = E, W.lanes |= v, Ee |= v;
          E = m.action, Fe && e(n, E), n = m.hasEagerState ? m.eagerState : e(n, E);
        } else
          v = {
            lane: E,
            revertLane: m.revertLane,
            gesture: m.gesture,
            action: m.action,
            hasEagerState: m.hasEagerState,
            eagerState: m.eagerState,
            next: null
          }, o === null ? (c = o = v, i = n) : o = o.next = v, W.lanes |= E, Ee |= E;
        m = m.next;
      } while (m !== null && m !== t);
      if (o === null ? i = n : o.next = c, !rt(n, l.memoizedState) && (Ll = !0, p && (e = Ta, e !== null)))
        throw e;
      l.memoizedState = n, l.baseState = i, l.baseQueue = o, a.lastRenderedState = n;
    }
    return u === null && (a.lanes = 0), [l.memoizedState, a.dispatch];
  }
  function cc(l) {
    var t = Cl(), e = t.queue;
    if (e === null) throw Error(f(311));
    e.lastRenderedReducer = l;
    var a = e.dispatch, u = e.pending, n = t.memoizedState;
    if (u !== null) {
      e.pending = null;
      var i = u = u.next;
      do
        n = l(n, i.action), i = i.next;
      while (i !== u);
      rt(n, t.memoizedState) || (Ll = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), e.lastRenderedState = n;
    }
    return [n, a];
  }
  function Wo(l, t, e) {
    var a = W, u = Cl(), n = il;
    if (n) {
      if (e === void 0) throw Error(f(407));
      e = e();
    } else e = t();
    var i = !rt(
      (Sl || u).memoizedState,
      e
    );
    if (i && (u.memoizedState = e, Ll = !0), u = u.queue, sc(Io.bind(null, a, u, l), [
      l
    ]), u.getSnapshot !== t || i || Bl !== null && Bl.memoizedState.tag & 1) {
      if (a.flags |= 2048, Da(
        9,
        { destroy: void 0 },
        $o.bind(
          null,
          a,
          u,
          e,
          t
        ),
        null
      ), Tl === null) throw Error(f(349));
      n || (Wt & 127) !== 0 || Fo(a, t, e);
    }
    return e;
  }
  function Fo(l, t, e) {
    l.flags |= 16384, l = { getSnapshot: t, value: e }, t = W.updateQueue, t === null ? (t = gn(), W.updateQueue = t, t.stores = [l]) : (e = t.stores, e === null ? t.stores = [l] : e.push(l));
  }
  function $o(l, t, e, a) {
    t.value = e, t.getSnapshot = a, Po(t) && l0(l);
  }
  function Io(l, t, e) {
    return e(function() {
      Po(t) && l0(l);
    });
  }
  function Po(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var e = t();
      return !rt(l, e);
    } catch {
      return !0;
    }
  }
  function l0(l) {
    var t = je(l, 2);
    t !== null && ft(t, l, 2);
  }
  function fc(l) {
    var t = Pl();
    if (typeof l == "function") {
      var e = l;
      if (l = e(), Fe) {
        oe(!0);
        try {
          e();
        } finally {
          oe(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = l, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ft,
      lastRenderedState: l
    }, t;
  }
  function t0(l, t, e, a) {
    return l.baseState = e, ic(
      l,
      Sl,
      typeof a == "function" ? a : Ft
    );
  }
  function Ph(l, t, e, a, u) {
    if (bn(l)) throw Error(f(485));
    if (l = t.action, l !== null) {
      var n = {
        payload: u,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(i) {
          n.listeners.push(i);
        }
      };
      S.T !== null ? e(!0) : n.isTransition = !1, a(n), e = t.pending, e === null ? (n.next = t.pending = n, e0(t, n)) : (n.next = e.next, t.pending = e.next = n);
    }
  }
  function e0(l, t) {
    var e = t.action, a = t.payload, u = l.state;
    if (t.isTransition) {
      var n = S.T, i = {};
      S.T = i;
      try {
        var c = e(u, a), o = S.S;
        o !== null && o(i, c), a0(l, t, c);
      } catch (m) {
        oc(l, t, m);
      } finally {
        n !== null && i.types !== null && (n.types = i.types), S.T = n;
      }
    } else
      try {
        n = e(u, a), a0(l, t, n);
      } catch (m) {
        oc(l, t, m);
      }
  }
  function a0(l, t, e) {
    e !== null && typeof e == "object" && typeof e.then == "function" ? e.then(
      function(a) {
        u0(l, t, a);
      },
      function(a) {
        return oc(l, t, a);
      }
    ) : u0(l, t, e);
  }
  function u0(l, t, e) {
    t.status = "fulfilled", t.value = e, n0(t), l.state = e, t = l.pending, t !== null && (e = t.next, e === t ? l.pending = null : (e = e.next, t.next = e, e0(l, e)));
  }
  function oc(l, t, e) {
    var a = l.pending;
    if (l.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = e, n0(t), t = t.next;
      while (t !== a);
    }
    l.action = null;
  }
  function n0(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function i0(l, t) {
    return t;
  }
  function c0(l, t) {
    if (il) {
      var e = Tl.formState;
      if (e !== null) {
        l: {
          var a = W;
          if (il) {
            if (Al) {
              t: {
                for (var u = Al, n = Mt; u.nodeType !== 8; ) {
                  if (!n) {
                    u = null;
                    break t;
                  }
                  if (u = Ut(
                    u.nextSibling
                  ), u === null) {
                    u = null;
                    break t;
                  }
                }
                n = u.data, u = n === "F!" || n === "F" ? u : null;
              }
              if (u) {
                Al = Ut(
                  u.nextSibling
                ), a = u.data === "F!";
                break l;
              }
            }
            me(a);
          }
          a = !1;
        }
        a && (t = e[0]);
      }
    }
    return e = Pl(), e.memoizedState = e.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: i0,
      lastRenderedState: t
    }, e.queue = a, e = M0.bind(
      null,
      W,
      a
    ), a.dispatch = e, a = fc(!1), n = gc.bind(
      null,
      W,
      !1,
      a.queue
    ), a = Pl(), u = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, a.queue = u, e = Ph.bind(
      null,
      W,
      u,
      n,
      e
    ), u.dispatch = e, a.memoizedState = l, [t, e, !1];
  }
  function f0(l) {
    var t = Cl();
    return o0(t, Sl, l);
  }
  function o0(l, t, e) {
    if (t = ic(
      l,
      t,
      i0
    )[0], l = yn(Ft)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = ru(t);
      } catch (i) {
        throw i === za ? cn : i;
      }
    else a = t;
    t = Cl();
    var u = t.queue, n = u.dispatch;
    return e !== t.memoizedState && (W.flags |= 2048, Da(
      9,
      { destroy: void 0 },
      ld.bind(null, u, e),
      null
    )), [a, n, l];
  }
  function ld(l, t) {
    l.action = t;
  }
  function s0(l) {
    var t = Cl(), e = Sl;
    if (e !== null)
      return o0(t, e, l);
    Cl(), t = t.memoizedState, e = Cl();
    var a = e.queue.dispatch;
    return e.memoizedState = l, [t, a, !1];
  }
  function Da(l, t, e, a) {
    return l = { tag: l, create: e, deps: a, inst: t, next: null }, t = W.updateQueue, t === null && (t = gn(), W.updateQueue = t), e = t.lastEffect, e === null ? t.lastEffect = l.next = l : (a = e.next, e.next = l, l.next = a, t.lastEffect = l), l;
  }
  function r0() {
    return Cl().memoizedState;
  }
  function Sn(l, t, e, a) {
    var u = Pl();
    W.flags |= l, u.memoizedState = Da(
      1 | t,
      { destroy: void 0 },
      e,
      a === void 0 ? null : a
    );
  }
  function pn(l, t, e, a) {
    var u = Cl();
    a = a === void 0 ? null : a;
    var n = u.memoizedState.inst;
    Sl !== null && a !== null && lc(a, Sl.memoizedState.deps) ? u.memoizedState = Da(t, n, e, a) : (W.flags |= l, u.memoizedState = Da(
      1 | t,
      n,
      e,
      a
    ));
  }
  function h0(l, t) {
    Sn(8390656, 8, l, t);
  }
  function sc(l, t) {
    pn(2048, 8, l, t);
  }
  function td(l) {
    W.flags |= 4;
    var t = W.updateQueue;
    if (t === null)
      t = gn(), W.updateQueue = t, t.events = [l];
    else {
      var e = t.events;
      e === null ? t.events = [l] : e.push(l);
    }
  }
  function d0(l) {
    var t = Cl().memoizedState;
    return td({ ref: t, nextImpl: l }), function() {
      if ((rl & 2) !== 0) throw Error(f(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function m0(l, t) {
    return pn(4, 2, l, t);
  }
  function g0(l, t) {
    return pn(4, 4, l, t);
  }
  function v0(l, t) {
    if (typeof t == "function") {
      l = l();
      var e = t(l);
      return function() {
        typeof e == "function" ? e() : t(null);
      };
    }
    if (t != null)
      return l = l(), t.current = l, function() {
        t.current = null;
      };
  }
  function y0(l, t, e) {
    e = e != null ? e.concat([l]) : null, pn(4, 4, v0.bind(null, t, l), e);
  }
  function rc() {
  }
  function S0(l, t) {
    var e = Cl();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    return t !== null && lc(t, a[1]) ? a[0] : (e.memoizedState = [l, t], l);
  }
  function p0(l, t) {
    var e = Cl();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    if (t !== null && lc(t, a[1]))
      return a[0];
    if (a = l(), Fe) {
      oe(!0);
      try {
        l();
      } finally {
        oe(!1);
      }
    }
    return e.memoizedState = [a, t], a;
  }
  function hc(l, t, e) {
    return e === void 0 || (Wt & 1073741824) !== 0 && (el & 261930) === 0 ? l.memoizedState = t : (l.memoizedState = e, l = bs(), W.lanes |= l, Ee |= l, e);
  }
  function b0(l, t, e, a) {
    return rt(e, t) ? e : Aa.current !== null ? (l = hc(l, e, a), rt(l, t) || (Ll = !0), l) : (Wt & 42) === 0 || (Wt & 1073741824) !== 0 && (el & 261930) === 0 ? (Ll = !0, l.memoizedState = e) : (l = bs(), W.lanes |= l, Ee |= l, t);
  }
  function T0(l, t, e, a, u) {
    var n = U.p;
    U.p = n !== 0 && 8 > n ? n : 8;
    var i = S.T, c = {};
    S.T = c, gc(l, !1, t, e);
    try {
      var o = u(), m = S.S;
      if (m !== null && m(c, o), o !== null && typeof o == "object" && typeof o.then == "function") {
        var p = Fh(
          o,
          a
        );
        hu(
          l,
          t,
          p,
          yt(l)
        );
      } else
        hu(
          l,
          t,
          a,
          yt(l)
        );
    } catch (E) {
      hu(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: E },
        yt()
      );
    } finally {
      U.p = n, i !== null && c.types !== null && (i.types = c.types), S.T = i;
    }
  }
  function ed() {
  }
  function dc(l, t, e, a) {
    if (l.tag !== 5) throw Error(f(476));
    var u = z0(l).queue;
    T0(
      l,
      u,
      t,
      q,
      e === null ? ed : function() {
        return E0(l), e(a);
      }
    );
  }
  function z0(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: q,
      baseState: q,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ft,
        lastRenderedState: q
      },
      next: null
    };
    var e = {};
    return t.next = {
      memoizedState: e,
      baseState: e,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ft,
        lastRenderedState: e
      },
      next: null
    }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  }
  function E0(l) {
    var t = z0(l);
    t.next === null && (t = l.alternate.memoizedState), hu(
      l,
      t.next.queue,
      {},
      yt()
    );
  }
  function mc() {
    return Jl(_u);
  }
  function A0() {
    return Cl().memoizedState;
  }
  function x0() {
    return Cl().memoizedState;
  }
  function ad(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var e = yt();
          l = ye(e);
          var a = Se(t, l, e);
          a !== null && (ft(a, t, e), cu(a, t, e)), t = { cache: Qi() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function ud(l, t, e) {
    var a = yt();
    e = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, bn(l) ? D0(t, e) : (e = Ni(l, t, e, a), e !== null && (ft(e, l, a), U0(e, t, a)));
  }
  function M0(l, t, e) {
    var a = yt();
    hu(l, t, e, a);
  }
  function hu(l, t, e, a) {
    var u = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (bn(l)) D0(t, u);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var i = t.lastRenderedState, c = n(i, e);
          if (u.hasEagerState = !0, u.eagerState = c, rt(c, i))
            return Pu(l, t, u, 0), Tl === null && Iu(), !1;
        } catch {
        }
      if (e = Ni(l, t, u, a), e !== null)
        return ft(e, l, a), U0(e, t, a), !0;
    }
    return !1;
  }
  function gc(l, t, e, a) {
    if (a = {
      lane: 2,
      revertLane: Jc(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, bn(l)) {
      if (t) throw Error(f(479));
    } else
      t = Ni(
        l,
        e,
        a,
        2
      ), t !== null && ft(t, l, 2);
  }
  function bn(l) {
    var t = l.alternate;
    return l === W || t !== null && t === W;
  }
  function D0(l, t) {
    xa = dn = !0;
    var e = l.pending;
    e === null ? t.next = t : (t.next = e.next, e.next = t), l.pending = t;
  }
  function U0(l, t, e) {
    if ((e & 4194048) !== 0) {
      var a = t.lanes;
      a &= l.pendingLanes, e |= a, t.lanes = e, Nf(l, e);
    }
  }
  var du = {
    readContext: Jl,
    use: vn,
    useCallback: _l,
    useContext: _l,
    useEffect: _l,
    useImperativeHandle: _l,
    useLayoutEffect: _l,
    useInsertionEffect: _l,
    useMemo: _l,
    useReducer: _l,
    useRef: _l,
    useState: _l,
    useDebugValue: _l,
    useDeferredValue: _l,
    useTransition: _l,
    useSyncExternalStore: _l,
    useId: _l,
    useHostTransitionStatus: _l,
    useFormState: _l,
    useActionState: _l,
    useOptimistic: _l,
    useMemoCache: _l,
    useCacheRefresh: _l
  };
  du.useEffectEvent = _l;
  var _0 = {
    readContext: Jl,
    use: vn,
    useCallback: function(l, t) {
      return Pl().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: Jl,
    useEffect: h0,
    useImperativeHandle: function(l, t, e) {
      e = e != null ? e.concat([l]) : null, Sn(
        4194308,
        4,
        v0.bind(null, t, l),
        e
      );
    },
    useLayoutEffect: function(l, t) {
      return Sn(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      Sn(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var e = Pl();
      t = t === void 0 ? null : t;
      var a = l();
      if (Fe) {
        oe(!0);
        try {
          l();
        } finally {
          oe(!1);
        }
      }
      return e.memoizedState = [a, t], a;
    },
    useReducer: function(l, t, e) {
      var a = Pl();
      if (e !== void 0) {
        var u = e(t);
        if (Fe) {
          oe(!0);
          try {
            e(t);
          } finally {
            oe(!1);
          }
        }
      } else u = t;
      return a.memoizedState = a.baseState = u, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: u
      }, a.queue = l, l = l.dispatch = ud.bind(
        null,
        W,
        l
      ), [a.memoizedState, l];
    },
    useRef: function(l) {
      var t = Pl();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = fc(l);
      var t = l.queue, e = M0.bind(null, W, t);
      return t.dispatch = e, [l.memoizedState, e];
    },
    useDebugValue: rc,
    useDeferredValue: function(l, t) {
      var e = Pl();
      return hc(e, l, t);
    },
    useTransition: function() {
      var l = fc(!1);
      return l = T0.bind(
        null,
        W,
        l.queue,
        !0,
        !1
      ), Pl().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, e) {
      var a = W, u = Pl();
      if (il) {
        if (e === void 0)
          throw Error(f(407));
        e = e();
      } else {
        if (e = t(), Tl === null)
          throw Error(f(349));
        (el & 127) !== 0 || Fo(a, t, e);
      }
      u.memoizedState = e;
      var n = { value: e, getSnapshot: t };
      return u.queue = n, h0(Io.bind(null, a, n, l), [
        l
      ]), a.flags |= 2048, Da(
        9,
        { destroy: void 0 },
        $o.bind(
          null,
          a,
          n,
          e,
          t
        ),
        null
      ), e;
    },
    useId: function() {
      var l = Pl(), t = Tl.identifierPrefix;
      if (il) {
        var e = Gt, a = Lt;
        e = (a & ~(1 << 32 - st(a) - 1)).toString(32) + e, t = "_" + t + "R_" + e, e = mn++, 0 < e && (t += "H" + e.toString(32)), t += "_";
      } else
        e = $h++, t = "_" + t + "r_" + e.toString(32) + "_";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: mc,
    useFormState: c0,
    useActionState: c0,
    useOptimistic: function(l) {
      var t = Pl();
      t.memoizedState = t.baseState = l;
      var e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = e, t = gc.bind(
        null,
        W,
        !0,
        e
      ), e.dispatch = t, [l, t];
    },
    useMemoCache: nc,
    useCacheRefresh: function() {
      return Pl().memoizedState = ad.bind(
        null,
        W
      );
    },
    useEffectEvent: function(l) {
      var t = Pl(), e = { impl: l };
      return t.memoizedState = e, function() {
        if ((rl & 2) !== 0)
          throw Error(f(440));
        return e.impl.apply(void 0, arguments);
      };
    }
  }, vc = {
    readContext: Jl,
    use: vn,
    useCallback: S0,
    useContext: Jl,
    useEffect: sc,
    useImperativeHandle: y0,
    useInsertionEffect: m0,
    useLayoutEffect: g0,
    useMemo: p0,
    useReducer: yn,
    useRef: r0,
    useState: function() {
      return yn(Ft);
    },
    useDebugValue: rc,
    useDeferredValue: function(l, t) {
      var e = Cl();
      return b0(
        e,
        Sl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = yn(Ft)[0], t = Cl().memoizedState;
      return [
        typeof l == "boolean" ? l : ru(l),
        t
      ];
    },
    useSyncExternalStore: Wo,
    useId: A0,
    useHostTransitionStatus: mc,
    useFormState: f0,
    useActionState: f0,
    useOptimistic: function(l, t) {
      var e = Cl();
      return t0(e, Sl, l, t);
    },
    useMemoCache: nc,
    useCacheRefresh: x0
  };
  vc.useEffectEvent = d0;
  var R0 = {
    readContext: Jl,
    use: vn,
    useCallback: S0,
    useContext: Jl,
    useEffect: sc,
    useImperativeHandle: y0,
    useInsertionEffect: m0,
    useLayoutEffect: g0,
    useMemo: p0,
    useReducer: cc,
    useRef: r0,
    useState: function() {
      return cc(Ft);
    },
    useDebugValue: rc,
    useDeferredValue: function(l, t) {
      var e = Cl();
      return Sl === null ? hc(e, l, t) : b0(
        e,
        Sl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = cc(Ft)[0], t = Cl().memoizedState;
      return [
        typeof l == "boolean" ? l : ru(l),
        t
      ];
    },
    useSyncExternalStore: Wo,
    useId: A0,
    useHostTransitionStatus: mc,
    useFormState: s0,
    useActionState: s0,
    useOptimistic: function(l, t) {
      var e = Cl();
      return Sl !== null ? t0(e, Sl, l, t) : (e.baseState = l, [l, e.queue.dispatch]);
    },
    useMemoCache: nc,
    useCacheRefresh: x0
  };
  R0.useEffectEvent = d0;
  function yc(l, t, e, a) {
    t = l.memoizedState, e = e(a, t), e = e == null ? t : _({}, t, e), l.memoizedState = e, l.lanes === 0 && (l.updateQueue.baseState = e);
  }
  var Sc = {
    enqueueSetState: function(l, t, e) {
      l = l._reactInternals;
      var a = yt(), u = ye(a);
      u.payload = t, e != null && (u.callback = e), t = Se(l, u, a), t !== null && (ft(t, l, a), cu(t, l, a));
    },
    enqueueReplaceState: function(l, t, e) {
      l = l._reactInternals;
      var a = yt(), u = ye(a);
      u.tag = 1, u.payload = t, e != null && (u.callback = e), t = Se(l, u, a), t !== null && (ft(t, l, a), cu(t, l, a));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var e = yt(), a = ye(e);
      a.tag = 2, t != null && (a.callback = t), t = Se(l, a, e), t !== null && (ft(t, l, e), cu(t, l, e));
    }
  };
  function O0(l, t, e, a, u, n, i) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(a, n, i) : t.prototype && t.prototype.isPureReactComponent ? !Pa(e, a) || !Pa(u, n) : !0;
  }
  function N0(l, t, e, a) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(e, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(e, a), t.state !== l && Sc.enqueueReplaceState(t, t.state, null);
  }
  function $e(l, t) {
    var e = t;
    if ("ref" in t) {
      e = {};
      for (var a in t)
        a !== "ref" && (e[a] = t[a]);
    }
    if (l = l.defaultProps) {
      e === t && (e = _({}, e));
      for (var u in l)
        e[u] === void 0 && (e[u] = l[u]);
    }
    return e;
  }
  function C0(l) {
    $u(l);
  }
  function H0(l) {
    console.error(l);
  }
  function q0(l) {
    $u(l);
  }
  function Tn(l, t) {
    try {
      var e = l.onUncaughtError;
      e(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function B0(l, t, e) {
    try {
      var a = l.onCaughtError;
      a(e.value, {
        componentStack: e.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (u) {
      setTimeout(function() {
        throw u;
      });
    }
  }
  function pc(l, t, e) {
    return e = ye(e), e.tag = 3, e.payload = { element: null }, e.callback = function() {
      Tn(l, t);
    }, e;
  }
  function L0(l) {
    return l = ye(l), l.tag = 3, l;
  }
  function G0(l, t, e, a) {
    var u = e.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var n = a.value;
      l.payload = function() {
        return u(n);
      }, l.callback = function() {
        B0(t, e, a);
      };
    }
    var i = e.stateNode;
    i !== null && typeof i.componentDidCatch == "function" && (l.callback = function() {
      B0(t, e, a), typeof u != "function" && (Ae === null ? Ae = /* @__PURE__ */ new Set([this]) : Ae.add(this));
      var c = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: c !== null ? c : ""
      });
    });
  }
  function nd(l, t, e, a, u) {
    if (e.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = e.alternate, t !== null && pa(
        t,
        e,
        u,
        !0
      ), e = dt.current, e !== null) {
        switch (e.tag) {
          case 31:
          case 13:
            return Dt === null ? Cn() : e.alternate === null && Rl === 0 && (Rl = 3), e.flags &= -257, e.flags |= 65536, e.lanes = u, a === fn ? e.flags |= 16384 : (t = e.updateQueue, t === null ? e.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Zc(l, a, u)), !1;
          case 22:
            return e.flags |= 65536, a === fn ? e.flags |= 16384 : (t = e.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, e.updateQueue = t) : (e = t.retryQueue, e === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : e.add(a)), Zc(l, a, u)), !1;
        }
        throw Error(f(435, e.tag));
      }
      return Zc(l, a, u), Cn(), !1;
    }
    if (il)
      return t = dt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = u, a !== Gi && (l = Error(f(422), { cause: a }), eu(Et(l, e)))) : (a !== Gi && (t = Error(f(423), {
        cause: a
      }), eu(
        Et(t, e)
      )), l = l.current.alternate, l.flags |= 65536, u &= -u, l.lanes |= u, a = Et(a, e), u = pc(
        l.stateNode,
        a,
        u
      ), Wi(l, u), Rl !== 4 && (Rl = 2)), !1;
    var n = Error(f(520), { cause: a });
    if (n = Et(n, e), Tu === null ? Tu = [n] : Tu.push(n), Rl !== 4 && (Rl = 2), t === null) return !0;
    a = Et(a, e), e = t;
    do {
      switch (e.tag) {
        case 3:
          return e.flags |= 65536, l = u & -u, e.lanes |= l, l = pc(e.stateNode, a, l), Wi(e, l), !1;
        case 1:
          if (t = e.type, n = e.stateNode, (e.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (Ae === null || !Ae.has(n))))
            return e.flags |= 65536, u &= -u, e.lanes |= u, u = L0(u), G0(
              u,
              l,
              e,
              a
            ), Wi(e, u), !1;
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var bc = Error(f(461)), Ll = !1;
  function kl(l, t, e, a) {
    t.child = l === null ? wo(t, null, e, a) : We(
      t,
      l.child,
      e,
      a
    );
  }
  function Y0(l, t, e, a, u) {
    e = e.render;
    var n = t.ref;
    if ("ref" in a) {
      var i = {};
      for (var c in a)
        c !== "ref" && (i[c] = a[c]);
    } else i = a;
    return Ve(t), a = tc(
      l,
      t,
      e,
      i,
      n,
      u
    ), c = ec(), l !== null && !Ll ? (ac(l, t, u), $t(l, t, u)) : (il && c && Bi(t), t.flags |= 1, kl(l, t, a, u), t.child);
  }
  function X0(l, t, e, a, u) {
    if (l === null) {
      var n = e.type;
      return typeof n == "function" && !Ci(n) && n.defaultProps === void 0 && e.compare === null ? (t.tag = 15, t.type = n, j0(
        l,
        t,
        n,
        a,
        u
      )) : (l = tn(
        e.type,
        null,
        a,
        t,
        t.mode,
        u
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (n = l.child, !Uc(l, u)) {
      var i = n.memoizedProps;
      if (e = e.compare, e = e !== null ? e : Pa, e(i, a) && l.ref === t.ref)
        return $t(l, t, u);
    }
    return t.flags |= 1, l = Vt(n, a), l.ref = t.ref, l.return = t, t.child = l;
  }
  function j0(l, t, e, a, u) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (Pa(n, a) && l.ref === t.ref)
        if (Ll = !1, t.pendingProps = a = n, Uc(l, u))
          (l.flags & 131072) !== 0 && (Ll = !0);
        else
          return t.lanes = l.lanes, $t(l, t, u);
    }
    return Tc(
      l,
      t,
      e,
      a,
      u
    );
  }
  function w0(l, t, e, a) {
    var u = a.children, n = l !== null ? l.memoizedState : null;
    if (l === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (n = n !== null ? n.baseLanes | e : e, l !== null) {
          for (a = t.child = l.child, u = 0; a !== null; )
            u = u | a.lanes | a.childLanes, a = a.sibling;
          a = u & ~n;
        } else a = 0, t.child = null;
        return Q0(
          l,
          t,
          n,
          e,
          a
        );
      }
      if ((e & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && nn(
          t,
          n !== null ? n.cachePool : null
        ), n !== null ? Vo(t, n) : $i(), Ko(t);
      else
        return a = t.lanes = 536870912, Q0(
          l,
          t,
          n !== null ? n.baseLanes | e : e,
          e,
          a
        );
    } else
      n !== null ? (nn(t, n.cachePool), Vo(t, n), be(), t.memoizedState = null) : (l !== null && nn(t, null), $i(), be());
    return kl(l, t, u, e), t.child;
  }
  function mu(l, t) {
    return l !== null && l.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Q0(l, t, e, a, u) {
    var n = Vi();
    return n = n === null ? null : { parent: ql._currentValue, pool: n }, t.memoizedState = {
      baseLanes: e,
      cachePool: n
    }, l !== null && nn(t, null), $i(), Ko(t), l !== null && pa(l, t, a, !0), t.childLanes = u, null;
  }
  function zn(l, t) {
    return t = An(
      { mode: t.mode, children: t.children },
      l.mode
    ), t.ref = l.ref, l.child = t, t.return = l, t;
  }
  function Z0(l, t, e) {
    return We(t, l.child, null, e), l = zn(t, t.pendingProps), l.flags |= 2, mt(t), t.memoizedState = null, l;
  }
  function id(l, t, e) {
    var a = t.pendingProps, u = (t.flags & 128) !== 0;
    if (t.flags &= -129, l === null) {
      if (il) {
        if (a.mode === "hidden")
          return l = zn(t, a), t.lanes = 536870912, mu(null, l);
        if (Pi(t), (l = Al) ? (l = er(
          l,
          Mt
        ), l = l !== null && l.data === "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: he !== null ? { id: Lt, overflow: Gt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = Do(l), e.return = t, t.child = e, Kl = t, Al = null)) : l = null, l === null) throw me(t);
        return t.lanes = 536870912, null;
      }
      return zn(t, a);
    }
    var n = l.memoizedState;
    if (n !== null) {
      var i = n.dehydrated;
      if (Pi(t), u)
        if (t.flags & 256)
          t.flags &= -257, t = Z0(
            l,
            t,
            e
          );
        else if (t.memoizedState !== null)
          t.child = l.child, t.flags |= 128, t = null;
        else throw Error(f(558));
      else if (Ll || pa(l, t, e, !1), u = (e & l.childLanes) !== 0, Ll || u) {
        if (a = Tl, a !== null && (i = Cf(a, e), i !== 0 && i !== n.retryLane))
          throw n.retryLane = i, je(l, i), ft(a, l, i), bc;
        Cn(), t = Z0(
          l,
          t,
          e
        );
      } else
        l = n.treeContext, Al = Ut(i.nextSibling), Kl = t, il = !0, de = null, Mt = !1, l !== null && Ro(t, l), t = zn(t, a), t.flags |= 4096;
      return t;
    }
    return l = Vt(l.child, {
      mode: a.mode,
      children: a.children
    }), l.ref = t.ref, t.child = l, l.return = t, l;
  }
  function En(l, t) {
    var e = t.ref;
    if (e === null)
      l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof e != "function" && typeof e != "object")
        throw Error(f(284));
      (l === null || l.ref !== e) && (t.flags |= 4194816);
    }
  }
  function Tc(l, t, e, a, u) {
    return Ve(t), e = tc(
      l,
      t,
      e,
      a,
      void 0,
      u
    ), a = ec(), l !== null && !Ll ? (ac(l, t, u), $t(l, t, u)) : (il && a && Bi(t), t.flags |= 1, kl(l, t, e, u), t.child);
  }
  function V0(l, t, e, a, u, n) {
    return Ve(t), t.updateQueue = null, e = ko(
      t,
      a,
      e,
      u
    ), Jo(l), a = ec(), l !== null && !Ll ? (ac(l, t, n), $t(l, t, n)) : (il && a && Bi(t), t.flags |= 1, kl(l, t, e, n), t.child);
  }
  function K0(l, t, e, a, u) {
    if (Ve(t), t.stateNode === null) {
      var n = ga, i = e.contextType;
      typeof i == "object" && i !== null && (n = Jl(i)), n = new e(a, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = Sc, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = a, n.state = t.memoizedState, n.refs = {}, Ji(t), i = e.contextType, n.context = typeof i == "object" && i !== null ? Jl(i) : ga, n.state = t.memoizedState, i = e.getDerivedStateFromProps, typeof i == "function" && (yc(
        t,
        e,
        i,
        a
      ), n.state = t.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (i = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), i !== n.state && Sc.enqueueReplaceState(n, n.state, null), ou(t, a, n, u), fu(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (l === null) {
      n = t.stateNode;
      var c = t.memoizedProps, o = $e(e, c);
      n.props = o;
      var m = n.context, p = e.contextType;
      i = ga, typeof p == "object" && p !== null && (i = Jl(p));
      var E = e.getDerivedStateFromProps;
      p = typeof E == "function" || typeof n.getSnapshotBeforeUpdate == "function", c = t.pendingProps !== c, p || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c || m !== i) && N0(
        t,
        n,
        a,
        i
      ), ve = !1;
      var v = t.memoizedState;
      n.state = v, ou(t, a, n, u), fu(), m = t.memoizedState, c || v !== m || ve ? (typeof E == "function" && (yc(
        t,
        e,
        E,
        a
      ), m = t.memoizedState), (o = ve || O0(
        t,
        e,
        o,
        a,
        v,
        m,
        i
      )) ? (p || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = m), n.props = a, n.state = m, n.context = i, a = o) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      n = t.stateNode, ki(l, t), i = t.memoizedProps, p = $e(e, i), n.props = p, E = t.pendingProps, v = n.context, m = e.contextType, o = ga, typeof m == "object" && m !== null && (o = Jl(m)), c = e.getDerivedStateFromProps, (m = typeof c == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (i !== E || v !== o) && N0(
        t,
        n,
        a,
        o
      ), ve = !1, v = t.memoizedState, n.state = v, ou(t, a, n, u), fu();
      var y = t.memoizedState;
      i !== E || v !== y || ve || l !== null && l.dependencies !== null && an(l.dependencies) ? (typeof c == "function" && (yc(
        t,
        e,
        c,
        a
      ), y = t.memoizedState), (p = ve || O0(
        t,
        e,
        p,
        a,
        v,
        y,
        o
      ) || l !== null && l.dependencies !== null && an(l.dependencies)) ? (m || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(a, y, o), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        a,
        y,
        o
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || i === l.memoizedProps && v === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === l.memoizedProps && v === l.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = y), n.props = a, n.state = y, n.context = o, a = p) : (typeof n.componentDidUpdate != "function" || i === l.memoizedProps && v === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === l.memoizedProps && v === l.memoizedState || (t.flags |= 1024), a = !1);
    }
    return n = a, En(l, t), a = (t.flags & 128) !== 0, n || a ? (n = t.stateNode, e = a && typeof e.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && a ? (t.child = We(
      t,
      l.child,
      null,
      u
    ), t.child = We(
      t,
      null,
      e,
      u
    )) : kl(l, t, e, u), t.memoizedState = n.state, l = t.child) : l = $t(
      l,
      t,
      u
    ), l;
  }
  function J0(l, t, e, a) {
    return Qe(), t.flags |= 256, kl(l, t, e, a), t.child;
  }
  var zc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Ec(l) {
    return { baseLanes: l, cachePool: Bo() };
  }
  function Ac(l, t, e) {
    return l = l !== null ? l.childLanes & ~e : 0, t && (l |= vt), l;
  }
  function k0(l, t, e) {
    var a = t.pendingProps, u = !1, n = (t.flags & 128) !== 0, i;
    if ((i = n) || (i = l !== null && l.memoizedState === null ? !1 : (Nl.current & 2) !== 0), i && (u = !0, t.flags &= -129), i = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (il) {
        if (u ? pe(t) : be(), (l = Al) ? (l = er(
          l,
          Mt
        ), l = l !== null && l.data !== "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: he !== null ? { id: Lt, overflow: Gt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = Do(l), e.return = t, t.child = e, Kl = t, Al = null)) : l = null, l === null) throw me(t);
        return cf(l) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var c = a.children;
      return a = a.fallback, u ? (be(), u = t.mode, c = An(
        { mode: "hidden", children: c },
        u
      ), a = we(
        a,
        u,
        e,
        null
      ), c.return = t, a.return = t, c.sibling = a, t.child = c, a = t.child, a.memoizedState = Ec(e), a.childLanes = Ac(
        l,
        i,
        e
      ), t.memoizedState = zc, mu(null, a)) : (pe(t), xc(t, c));
    }
    var o = l.memoizedState;
    if (o !== null && (c = o.dehydrated, c !== null)) {
      if (n)
        t.flags & 256 ? (pe(t), t.flags &= -257, t = Mc(
          l,
          t,
          e
        )) : t.memoizedState !== null ? (be(), t.child = l.child, t.flags |= 128, t = null) : (be(), c = a.fallback, u = t.mode, a = An(
          { mode: "visible", children: a.children },
          u
        ), c = we(
          c,
          u,
          e,
          null
        ), c.flags |= 2, a.return = t, c.return = t, a.sibling = c, t.child = a, We(
          t,
          l.child,
          null,
          e
        ), a = t.child, a.memoizedState = Ec(e), a.childLanes = Ac(
          l,
          i,
          e
        ), t.memoizedState = zc, t = mu(null, a));
      else if (pe(t), cf(c)) {
        if (i = c.nextSibling && c.nextSibling.dataset, i) var m = i.dgst;
        i = m, a = Error(f(419)), a.stack = "", a.digest = i, eu({ value: a, source: null, stack: null }), t = Mc(
          l,
          t,
          e
        );
      } else if (Ll || pa(l, t, e, !1), i = (e & l.childLanes) !== 0, Ll || i) {
        if (i = Tl, i !== null && (a = Cf(i, e), a !== 0 && a !== o.retryLane))
          throw o.retryLane = a, je(l, a), ft(i, l, a), bc;
        nf(c) || Cn(), t = Mc(
          l,
          t,
          e
        );
      } else
        nf(c) ? (t.flags |= 192, t.child = l.child, t = null) : (l = o.treeContext, Al = Ut(
          c.nextSibling
        ), Kl = t, il = !0, de = null, Mt = !1, l !== null && Ro(t, l), t = xc(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return u ? (be(), c = a.fallback, u = t.mode, o = l.child, m = o.sibling, a = Vt(o, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = o.subtreeFlags & 65011712, m !== null ? c = Vt(
      m,
      c
    ) : (c = we(
      c,
      u,
      e,
      null
    ), c.flags |= 2), c.return = t, a.return = t, a.sibling = c, t.child = a, mu(null, a), a = t.child, c = l.child.memoizedState, c === null ? c = Ec(e) : (u = c.cachePool, u !== null ? (o = ql._currentValue, u = u.parent !== o ? { parent: o, pool: o } : u) : u = Bo(), c = {
      baseLanes: c.baseLanes | e,
      cachePool: u
    }), a.memoizedState = c, a.childLanes = Ac(
      l,
      i,
      e
    ), t.memoizedState = zc, mu(l.child, a)) : (pe(t), e = l.child, l = e.sibling, e = Vt(e, {
      mode: "visible",
      children: a.children
    }), e.return = t, e.sibling = null, l !== null && (i = t.deletions, i === null ? (t.deletions = [l], t.flags |= 16) : i.push(l)), t.child = e, t.memoizedState = null, e);
  }
  function xc(l, t) {
    return t = An(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function An(l, t) {
    return l = ht(22, l, null, t), l.lanes = 0, l;
  }
  function Mc(l, t, e) {
    return We(t, l.child, null, e), l = xc(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function W0(l, t, e) {
    l.lanes |= t;
    var a = l.alternate;
    a !== null && (a.lanes |= t), ji(l.return, t, e);
  }
  function Dc(l, t, e, a, u, n) {
    var i = l.memoizedState;
    i === null ? l.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: e,
      tailMode: u,
      treeForkCount: n
    } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = a, i.tail = e, i.tailMode = u, i.treeForkCount = n);
  }
  function F0(l, t, e) {
    var a = t.pendingProps, u = a.revealOrder, n = a.tail;
    a = a.children;
    var i = Nl.current, c = (i & 2) !== 0;
    if (c ? (i = i & 1 | 2, t.flags |= 128) : i &= 1, R(Nl, i), kl(l, t, a, e), a = il ? tu : 0, !c && l !== null && (l.flags & 128) !== 0)
      l: for (l = t.child; l !== null; ) {
        if (l.tag === 13)
          l.memoizedState !== null && W0(l, e, t);
        else if (l.tag === 19)
          W0(l, e, t);
        else if (l.child !== null) {
          l.child.return = l, l = l.child;
          continue;
        }
        if (l === t) break l;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === t)
            break l;
          l = l.return;
        }
        l.sibling.return = l.return, l = l.sibling;
      }
    switch (u) {
      case "forwards":
        for (e = t.child, u = null; e !== null; )
          l = e.alternate, l !== null && hn(l) === null && (u = e), e = e.sibling;
        e = u, e === null ? (u = t.child, t.child = null) : (u = e.sibling, e.sibling = null), Dc(
          t,
          !1,
          u,
          e,
          n,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (e = null, u = t.child, t.child = null; u !== null; ) {
          if (l = u.alternate, l !== null && hn(l) === null) {
            t.child = u;
            break;
          }
          l = u.sibling, u.sibling = e, e = u, u = l;
        }
        Dc(
          t,
          !0,
          e,
          null,
          n,
          a
        );
        break;
      case "together":
        Dc(
          t,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function $t(l, t, e) {
    if (l !== null && (t.dependencies = l.dependencies), Ee |= t.lanes, (e & t.childLanes) === 0)
      if (l !== null) {
        if (pa(
          l,
          t,
          e,
          !1
        ), (e & t.childLanes) === 0)
          return null;
      } else return null;
    if (l !== null && t.child !== l.child)
      throw Error(f(153));
    if (t.child !== null) {
      for (l = t.child, e = Vt(l, l.pendingProps), t.child = e, e.return = t; l.sibling !== null; )
        l = l.sibling, e = e.sibling = Vt(l, l.pendingProps), e.return = t;
      e.sibling = null;
    }
    return t.child;
  }
  function Uc(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && an(l)));
  }
  function cd(l, t, e) {
    switch (t.tag) {
      case 3:
        jl(t, t.stateNode.containerInfo), ge(t, ql, l.memoizedState.cache), Qe();
        break;
      case 27:
      case 5:
        ce(t);
        break;
      case 4:
        jl(t, t.stateNode.containerInfo);
        break;
      case 10:
        ge(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, Pi(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (pe(t), t.flags |= 128, null) : (e & t.child.childLanes) !== 0 ? k0(l, t, e) : (pe(t), l = $t(
            l,
            t,
            e
          ), l !== null ? l.sibling : null);
        pe(t);
        break;
      case 19:
        var u = (l.flags & 128) !== 0;
        if (a = (e & t.childLanes) !== 0, a || (pa(
          l,
          t,
          e,
          !1
        ), a = (e & t.childLanes) !== 0), u) {
          if (a)
            return F0(
              l,
              t,
              e
            );
          t.flags |= 128;
        }
        if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), R(Nl, Nl.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, w0(
          l,
          t,
          e,
          t.pendingProps
        );
      case 24:
        ge(t, ql, l.memoizedState.cache);
    }
    return $t(l, t, e);
  }
  function $0(l, t, e) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        Ll = !0;
      else {
        if (!Uc(l, e) && (t.flags & 128) === 0)
          return Ll = !1, cd(
            l,
            t,
            e
          );
        Ll = (l.flags & 131072) !== 0;
      }
    else
      Ll = !1, il && (t.flags & 1048576) !== 0 && _o(t, tu, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          var a = t.pendingProps;
          if (l = Je(t.elementType), t.type = l, typeof l == "function")
            Ci(l) ? (a = $e(l, a), t.tag = 1, t = K0(
              null,
              t,
              l,
              a,
              e
            )) : (t.tag = 0, t = Tc(
              null,
              t,
              l,
              a,
              e
            ));
          else {
            if (l != null) {
              var u = l.$$typeof;
              if (u === k) {
                t.tag = 11, t = Y0(
                  null,
                  t,
                  l,
                  a,
                  e
                );
                break l;
              } else if (u === w) {
                t.tag = 14, t = X0(
                  null,
                  t,
                  l,
                  a,
                  e
                );
                break l;
              }
            }
            throw t = pt(l) || l, Error(f(306, t, ""));
          }
        }
        return t;
      case 0:
        return Tc(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 1:
        return a = t.type, u = $e(
          a,
          t.pendingProps
        ), K0(
          l,
          t,
          a,
          u,
          e
        );
      case 3:
        l: {
          if (jl(
            t,
            t.stateNode.containerInfo
          ), l === null) throw Error(f(387));
          a = t.pendingProps;
          var n = t.memoizedState;
          u = n.element, ki(l, t), ou(t, a, null, e);
          var i = t.memoizedState;
          if (a = i.cache, ge(t, ql, a), a !== n.cache && wi(
            t,
            [ql],
            e,
            !0
          ), fu(), a = i.element, n.isDehydrated)
            if (n = {
              element: a,
              isDehydrated: !1,
              cache: i.cache
            }, t.updateQueue.baseState = n, t.memoizedState = n, t.flags & 256) {
              t = J0(
                l,
                t,
                a,
                e
              );
              break l;
            } else if (a !== u) {
              u = Et(
                Error(f(424)),
                t
              ), eu(u), t = J0(
                l,
                t,
                a,
                e
              );
              break l;
            } else
              for (l = t.stateNode.containerInfo, l.nodeType === 9 ? l = l.body : l = l.nodeName === "HTML" ? l.ownerDocument.body : l, Al = Ut(l.firstChild), Kl = t, il = !0, de = null, Mt = !0, e = wo(
                t,
                null,
                a,
                e
              ), t.child = e; e; )
                e.flags = e.flags & -3 | 4096, e = e.sibling;
          else {
            if (Qe(), a === u) {
              t = $t(
                l,
                t,
                e
              );
              break l;
            }
            kl(l, t, a, e);
          }
          t = t.child;
        }
        return t;
      case 26:
        return En(l, t), l === null ? (e = fr(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = e : il || (e = t.type, l = t.pendingProps, a = Xn(
          $.current
        ).createElement(e), a[Vl] = t, a[et] = l, Wl(a, e, l), Ql(a), t.stateNode = a) : t.memoizedState = fr(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return ce(t), l === null && il && (a = t.stateNode = nr(
          t.type,
          t.pendingProps,
          $.current
        ), Kl = t, Mt = !0, u = Al, Ue(t.type) ? (ff = u, Al = Ut(a.firstChild)) : Al = u), kl(
          l,
          t,
          t.pendingProps.children,
          e
        ), En(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && il && ((u = a = Al) && (a = Ld(
          a,
          t.type,
          t.pendingProps,
          Mt
        ), a !== null ? (t.stateNode = a, Kl = t, Al = Ut(a.firstChild), Mt = !1, u = !0) : u = !1), u || me(t)), ce(t), u = t.type, n = t.pendingProps, i = l !== null ? l.memoizedProps : null, a = n.children, ef(u, n) ? a = null : i !== null && ef(u, i) && (t.flags |= 32), t.memoizedState !== null && (u = tc(
          l,
          t,
          Ih,
          null,
          null,
          e
        ), _u._currentValue = u), En(l, t), kl(l, t, a, e), t.child;
      case 6:
        return l === null && il && ((l = e = Al) && (e = Gd(
          e,
          t.pendingProps,
          Mt
        ), e !== null ? (t.stateNode = e, Kl = t, Al = null, l = !0) : l = !1), l || me(t)), null;
      case 13:
        return k0(l, t, e);
      case 4:
        return jl(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, l === null ? t.child = We(
          t,
          null,
          a,
          e
        ) : kl(l, t, a, e), t.child;
      case 11:
        return Y0(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 7:
        return kl(
          l,
          t,
          t.pendingProps,
          e
        ), t.child;
      case 8:
        return kl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 12:
        return kl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 10:
        return a = t.pendingProps, ge(t, t.type, a.value), kl(l, t, a.children, e), t.child;
      case 9:
        return u = t.type._context, a = t.pendingProps.children, Ve(t), u = Jl(u), a = a(u), t.flags |= 1, kl(l, t, a, e), t.child;
      case 14:
        return X0(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 15:
        return j0(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 19:
        return F0(l, t, e);
      case 31:
        return id(l, t, e);
      case 22:
        return w0(
          l,
          t,
          e,
          t.pendingProps
        );
      case 24:
        return Ve(t), a = Jl(ql), l === null ? (u = Vi(), u === null && (u = Tl, n = Qi(), u.pooledCache = n, n.refCount++, n !== null && (u.pooledCacheLanes |= e), u = n), t.memoizedState = { parent: a, cache: u }, Ji(t), ge(t, ql, u)) : ((l.lanes & e) !== 0 && (ki(l, t), ou(t, null, null, e), fu()), u = l.memoizedState, n = t.memoizedState, u.parent !== a ? (u = { parent: a, cache: a }, t.memoizedState = u, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u), ge(t, ql, a)) : (a = n.cache, ge(t, ql, a), a !== u.cache && wi(
          t,
          [ql],
          e,
          !0
        ))), kl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(f(156, t.tag));
  }
  function It(l) {
    l.flags |= 4;
  }
  function _c(l, t, e, a, u) {
    if ((t = (l.mode & 32) !== 0) && (t = !1), t) {
      if (l.flags |= 16777216, (u & 335544128) === u)
        if (l.stateNode.complete) l.flags |= 8192;
        else if (As()) l.flags |= 8192;
        else
          throw ke = fn, Ki;
    } else l.flags &= -16777217;
  }
  function I0(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !dr(t))
      if (As()) l.flags |= 8192;
      else
        throw ke = fn, Ki;
  }
  function xn(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? Rf() : 536870912, l.lanes |= t, Oa |= t);
  }
  function gu(l, t) {
    if (!il)
      switch (l.tailMode) {
        case "hidden":
          t = l.tail;
          for (var e = null; t !== null; )
            t.alternate !== null && (e = t), t = t.sibling;
          e === null ? l.tail = null : e.sibling = null;
          break;
        case "collapsed":
          e = l.tail;
          for (var a = null; e !== null; )
            e.alternate !== null && (a = e), e = e.sibling;
          a === null ? t || l.tail === null ? l.tail = null : l.tail.sibling = null : a.sibling = null;
      }
  }
  function xl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, e = 0, a = 0;
    if (t)
      for (var u = l.child; u !== null; )
        e |= u.lanes | u.childLanes, a |= u.subtreeFlags & 65011712, a |= u.flags & 65011712, u.return = l, u = u.sibling;
    else
      for (u = l.child; u !== null; )
        e |= u.lanes | u.childLanes, a |= u.subtreeFlags, a |= u.flags, u.return = l, u = u.sibling;
    return l.subtreeFlags |= a, l.childLanes = e, t;
  }
  function fd(l, t, e) {
    var a = t.pendingProps;
    switch (Li(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return xl(t), null;
      case 1:
        return xl(t), null;
      case 3:
        return e = t.stateNode, a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), kt(ql), Ml(), e.pendingContext && (e.context = e.pendingContext, e.pendingContext = null), (l === null || l.child === null) && (Sa(t) ? It(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Yi())), xl(t), null;
      case 26:
        var u = t.type, n = t.memoizedState;
        return l === null ? (It(t), n !== null ? (xl(t), I0(t, n)) : (xl(t), _c(
          t,
          u,
          null,
          a,
          e
        ))) : n ? n !== l.memoizedState ? (It(t), xl(t), I0(t, n)) : (xl(t), t.flags &= -16777217) : (l = l.memoizedProps, l !== a && It(t), xl(t), _c(
          t,
          u,
          l,
          a,
          e
        )), null;
      case 27:
        if (He(t), e = $.current, u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && It(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(f(166));
            return xl(t), null;
          }
          l = C.current, Sa(t) ? Oo(t) : (l = nr(u, a, e), t.stateNode = l, It(t));
        }
        return xl(t), null;
      case 5:
        if (He(t), u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && It(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(f(166));
            return xl(t), null;
          }
          if (n = C.current, Sa(t))
            Oo(t);
          else {
            var i = Xn(
              $.current
            );
            switch (n) {
              case 1:
                n = i.createElementNS(
                  "http://www.w3.org/2000/svg",
                  u
                );
                break;
              case 2:
                n = i.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  u
                );
                break;
              default:
                switch (u) {
                  case "svg":
                    n = i.createElementNS(
                      "http://www.w3.org/2000/svg",
                      u
                    );
                    break;
                  case "math":
                    n = i.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      u
                    );
                    break;
                  case "script":
                    n = i.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(
                      n.firstChild
                    );
                    break;
                  case "select":
                    n = typeof a.is == "string" ? i.createElement("select", {
                      is: a.is
                    }) : i.createElement("select"), a.multiple ? n.multiple = !0 : a.size && (n.size = a.size);
                    break;
                  default:
                    n = typeof a.is == "string" ? i.createElement(u, { is: a.is }) : i.createElement(u);
                }
            }
            n[Vl] = t, n[et] = a;
            l: for (i = t.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6)
                n.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                i.child.return = i, i = i.child;
                continue;
              }
              if (i === t) break l;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === t)
                  break l;
                i = i.return;
              }
              i.sibling.return = i.return, i = i.sibling;
            }
            t.stateNode = n;
            l: switch (Wl(n, u, a), u) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break l;
              case "img":
                a = !0;
                break l;
              default:
                a = !1;
            }
            a && It(t);
          }
        }
        return xl(t), _c(
          t,
          t.type,
          l === null ? null : l.memoizedProps,
          t.pendingProps,
          e
        ), null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== a && It(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(f(166));
          if (l = $.current, Sa(t)) {
            if (l = t.stateNode, e = t.memoizedProps, a = null, u = Kl, u !== null)
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            l[Vl] = t, l = !!(l.nodeValue === e || a !== null && a.suppressHydrationWarning === !0 || ks(l.nodeValue, e)), l || me(t, !0);
          } else
            l = Xn(l).createTextNode(
              a
            ), l[Vl] = t, t.stateNode = l;
        }
        return xl(t), null;
      case 31:
        if (e = t.memoizedState, l === null || l.memoizedState !== null) {
          if (a = Sa(t), e !== null) {
            if (l === null) {
              if (!a) throw Error(f(318));
              if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(f(557));
              l[Vl] = t;
            } else
              Qe(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            xl(t), l = !1;
          } else
            e = Yi(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e), l = !0;
          if (!l)
            return t.flags & 256 ? (mt(t), t) : (mt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(f(558));
        }
        return xl(t), null;
      case 13:
        if (a = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (u = Sa(t), a !== null && a.dehydrated !== null) {
            if (l === null) {
              if (!u) throw Error(f(318));
              if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(f(317));
              u[Vl] = t;
            } else
              Qe(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            xl(t), u = !1;
          } else
            u = Yi(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = u), u = !0;
          if (!u)
            return t.flags & 256 ? (mt(t), t) : (mt(t), null);
        }
        return mt(t), (t.flags & 128) !== 0 ? (t.lanes = e, t) : (e = a !== null, l = l !== null && l.memoizedState !== null, e && (a = t.child, u = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (u = a.alternate.memoizedState.cachePool.pool), n = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (n = a.memoizedState.cachePool.pool), n !== u && (a.flags |= 2048)), e !== l && e && (t.child.flags |= 8192), xn(t, t.updateQueue), xl(t), null);
      case 4:
        return Ml(), l === null && $c(t.stateNode.containerInfo), xl(t), null;
      case 10:
        return kt(t.type), xl(t), null;
      case 19:
        if (z(Nl), a = t.memoizedState, a === null) return xl(t), null;
        if (u = (t.flags & 128) !== 0, n = a.rendering, n === null)
          if (u) gu(a, !1);
          else {
            if (Rl !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = hn(l), n !== null) {
                  for (t.flags |= 128, gu(a, !1), l = n.updateQueue, t.updateQueue = l, xn(t, l), t.subtreeFlags = 0, l = e, e = t.child; e !== null; )
                    Mo(e, l), e = e.sibling;
                  return R(
                    Nl,
                    Nl.current & 1 | 2
                  ), il && Kt(t, a.treeForkCount), t.child;
                }
                l = l.sibling;
              }
            a.tail !== null && Il() > Rn && (t.flags |= 128, u = !0, gu(a, !1), t.lanes = 4194304);
          }
        else {
          if (!u)
            if (l = hn(n), l !== null) {
              if (t.flags |= 128, u = !0, l = l.updateQueue, t.updateQueue = l, xn(t, l), gu(a, !0), a.tail === null && a.tailMode === "hidden" && !n.alternate && !il)
                return xl(t), null;
            } else
              2 * Il() - a.renderingStartTime > Rn && e !== 536870912 && (t.flags |= 128, u = !0, gu(a, !1), t.lanes = 4194304);
          a.isBackwards ? (n.sibling = t.child, t.child = n) : (l = a.last, l !== null ? l.sibling = n : t.child = n, a.last = n);
        }
        return a.tail !== null ? (l = a.tail, a.rendering = l, a.tail = l.sibling, a.renderingStartTime = Il(), l.sibling = null, e = Nl.current, R(
          Nl,
          u ? e & 1 | 2 : e & 1
        ), il && Kt(t, a.treeForkCount), l) : (xl(t), null);
      case 22:
      case 23:
        return mt(t), Ii(), a = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (e & 536870912) !== 0 && (t.flags & 128) === 0 && (xl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : xl(t), e = t.updateQueue, e !== null && xn(t, e.retryQueue), e = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== e && (t.flags |= 2048), l !== null && z(Ke), null;
      case 24:
        return e = null, l !== null && (e = l.memoizedState.cache), t.memoizedState.cache !== e && (t.flags |= 2048), kt(ql), xl(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(f(156, t.tag));
  }
  function od(l, t) {
    switch (Li(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return kt(ql), Ml(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return He(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (mt(t), t.alternate === null)
            throw Error(f(340));
          Qe();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 13:
        if (mt(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(f(340));
          Qe();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return z(Nl), null;
      case 4:
        return Ml(), null;
      case 10:
        return kt(t.type), null;
      case 22:
      case 23:
        return mt(t), Ii(), l !== null && z(Ke), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return kt(ql), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function P0(l, t) {
    switch (Li(t), t.tag) {
      case 3:
        kt(ql), Ml();
        break;
      case 26:
      case 27:
      case 5:
        He(t);
        break;
      case 4:
        Ml();
        break;
      case 31:
        t.memoizedState !== null && mt(t);
        break;
      case 13:
        mt(t);
        break;
      case 19:
        z(Nl);
        break;
      case 10:
        kt(t.type);
        break;
      case 22:
      case 23:
        mt(t), Ii(), l !== null && z(Ke);
        break;
      case 24:
        kt(ql);
    }
  }
  function vu(l, t) {
    try {
      var e = t.updateQueue, a = e !== null ? e.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        e = u;
        do {
          if ((e.tag & l) === l) {
            a = void 0;
            var n = e.create, i = e.inst;
            a = n(), i.destroy = a;
          }
          e = e.next;
        } while (e !== u);
      }
    } catch (c) {
      ml(t, t.return, c);
    }
  }
  function Te(l, t, e) {
    try {
      var a = t.updateQueue, u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var n = u.next;
        a = n;
        do {
          if ((a.tag & l) === l) {
            var i = a.inst, c = i.destroy;
            if (c !== void 0) {
              i.destroy = void 0, u = t;
              var o = e, m = c;
              try {
                m();
              } catch (p) {
                ml(
                  u,
                  o,
                  p
                );
              }
            }
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (p) {
      ml(t, t.return, p);
    }
  }
  function ls(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var e = l.stateNode;
      try {
        Zo(t, e);
      } catch (a) {
        ml(l, l.return, a);
      }
    }
  }
  function ts(l, t, e) {
    e.props = $e(
      l.type,
      l.memoizedProps
    ), e.state = l.memoizedState;
    try {
      e.componentWillUnmount();
    } catch (a) {
      ml(l, t, a);
    }
  }
  function yu(l, t) {
    try {
      var e = l.ref;
      if (e !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var a = l.stateNode;
            break;
          case 30:
            a = l.stateNode;
            break;
          default:
            a = l.stateNode;
        }
        typeof e == "function" ? l.refCleanup = e(a) : e.current = a;
      }
    } catch (u) {
      ml(l, t, u);
    }
  }
  function Yt(l, t) {
    var e = l.ref, a = l.refCleanup;
    if (e !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (u) {
          ml(l, t, u);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof e == "function")
        try {
          e(null);
        } catch (u) {
          ml(l, t, u);
        }
      else e.current = null;
  }
  function es(l) {
    var t = l.type, e = l.memoizedProps, a = l.stateNode;
    try {
      l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          e.autoFocus && a.focus();
          break l;
        case "img":
          e.src ? a.src = e.src : e.srcSet && (a.srcset = e.srcSet);
      }
    } catch (u) {
      ml(l, l.return, u);
    }
  }
  function Rc(l, t, e) {
    try {
      var a = l.stateNode;
      Od(a, l.type, e, t), a[et] = t;
    } catch (u) {
      ml(l, l.return, u);
    }
  }
  function as(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && Ue(l.type) || l.tag === 4;
  }
  function Oc(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || as(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && Ue(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function Nc(l, t, e) {
    var a = l.tag;
    if (a === 5 || a === 6)
      l = l.stateNode, t ? (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).insertBefore(l, t) : (t = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, t.appendChild(l), e = e._reactRootContainer, e != null || t.onclick !== null || (t.onclick = Qt));
    else if (a !== 4 && (a === 27 && Ue(l.type) && (e = l.stateNode, t = null), l = l.child, l !== null))
      for (Nc(l, t, e), l = l.sibling; l !== null; )
        Nc(l, t, e), l = l.sibling;
  }
  function Mn(l, t, e) {
    var a = l.tag;
    if (a === 5 || a === 6)
      l = l.stateNode, t ? e.insertBefore(l, t) : e.appendChild(l);
    else if (a !== 4 && (a === 27 && Ue(l.type) && (e = l.stateNode), l = l.child, l !== null))
      for (Mn(l, t, e), l = l.sibling; l !== null; )
        Mn(l, t, e), l = l.sibling;
  }
  function us(l) {
    var t = l.stateNode, e = l.memoizedProps;
    try {
      for (var a = l.type, u = t.attributes; u.length; )
        t.removeAttributeNode(u[0]);
      Wl(t, a, e), t[Vl] = l, t[et] = e;
    } catch (n) {
      ml(l, l.return, n);
    }
  }
  var Pt = !1, Gl = !1, Cc = !1, ns = typeof WeakSet == "function" ? WeakSet : Set, Zl = null;
  function sd(l, t) {
    if (l = l.containerInfo, lf = Jn, l = yo(l), Mi(l)) {
      if ("selectionStart" in l)
        var e = {
          start: l.selectionStart,
          end: l.selectionEnd
        };
      else
        l: {
          e = (e = l.ownerDocument) && e.defaultView || window;
          var a = e.getSelection && e.getSelection();
          if (a && a.rangeCount !== 0) {
            e = a.anchorNode;
            var u = a.anchorOffset, n = a.focusNode;
            a = a.focusOffset;
            try {
              e.nodeType, n.nodeType;
            } catch {
              e = null;
              break l;
            }
            var i = 0, c = -1, o = -1, m = 0, p = 0, E = l, v = null;
            t: for (; ; ) {
              for (var y; E !== e || u !== 0 && E.nodeType !== 3 || (c = i + u), E !== n || a !== 0 && E.nodeType !== 3 || (o = i + a), E.nodeType === 3 && (i += E.nodeValue.length), (y = E.firstChild) !== null; )
                v = E, E = y;
              for (; ; ) {
                if (E === l) break t;
                if (v === e && ++m === u && (c = i), v === n && ++p === a && (o = i), (y = E.nextSibling) !== null) break;
                E = v, v = E.parentNode;
              }
              E = y;
            }
            e = c === -1 || o === -1 ? null : { start: c, end: o };
          } else e = null;
        }
      e = e || { start: 0, end: 0 };
    } else e = null;
    for (tf = { focusedElem: l, selectionRange: e }, Jn = !1, Zl = t; Zl !== null; )
      if (t = Zl, l = t.child, (t.subtreeFlags & 1028) !== 0 && l !== null)
        l.return = t, Zl = l;
      else
        for (; Zl !== null; ) {
          switch (t = Zl, n = t.alternate, l = t.flags, t.tag) {
            case 0:
              if ((l & 4) !== 0 && (l = t.updateQueue, l = l !== null ? l.events : null, l !== null))
                for (e = 0; e < l.length; e++)
                  u = l[e], u.ref.impl = u.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((l & 1024) !== 0 && n !== null) {
                l = void 0, e = t, u = n.memoizedProps, n = n.memoizedState, a = e.stateNode;
                try {
                  var H = $e(
                    e.type,
                    u
                  );
                  l = a.getSnapshotBeforeUpdate(
                    H,
                    n
                  ), a.__reactInternalSnapshotBeforeUpdate = l;
                } catch (Y) {
                  ml(
                    e,
                    e.return,
                    Y
                  );
                }
              }
              break;
            case 3:
              if ((l & 1024) !== 0) {
                if (l = t.stateNode.containerInfo, e = l.nodeType, e === 9)
                  uf(l);
                else if (e === 1)
                  switch (l.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      uf(l);
                      break;
                    default:
                      l.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((l & 1024) !== 0) throw Error(f(163));
          }
          if (l = t.sibling, l !== null) {
            l.return = t.return, Zl = l;
            break;
          }
          Zl = t.return;
        }
  }
  function is(l, t, e) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        te(l, e), a & 4 && vu(5, e);
        break;
      case 1:
        if (te(l, e), a & 4)
          if (l = e.stateNode, t === null)
            try {
              l.componentDidMount();
            } catch (i) {
              ml(e, e.return, i);
            }
          else {
            var u = $e(
              e.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              l.componentDidUpdate(
                u,
                t,
                l.__reactInternalSnapshotBeforeUpdate
              );
            } catch (i) {
              ml(
                e,
                e.return,
                i
              );
            }
          }
        a & 64 && ls(e), a & 512 && yu(e, e.return);
        break;
      case 3:
        if (te(l, e), a & 64 && (l = e.updateQueue, l !== null)) {
          if (t = null, e.child !== null)
            switch (e.child.tag) {
              case 27:
              case 5:
                t = e.child.stateNode;
                break;
              case 1:
                t = e.child.stateNode;
            }
          try {
            Zo(l, t);
          } catch (i) {
            ml(e, e.return, i);
          }
        }
        break;
      case 27:
        t === null && a & 4 && us(e);
      case 26:
      case 5:
        te(l, e), t === null && a & 4 && es(e), a & 512 && yu(e, e.return);
        break;
      case 12:
        te(l, e);
        break;
      case 31:
        te(l, e), a & 4 && os(l, e);
        break;
      case 13:
        te(l, e), a & 4 && ss(l, e), a & 64 && (l = e.memoizedState, l !== null && (l = l.dehydrated, l !== null && (e = pd.bind(
          null,
          e
        ), Yd(l, e))));
        break;
      case 22:
        if (a = e.memoizedState !== null || Pt, !a) {
          t = t !== null && t.memoizedState !== null || Gl, u = Pt;
          var n = Gl;
          Pt = a, (Gl = t) && !n ? ee(
            l,
            e,
            (e.subtreeFlags & 8772) !== 0
          ) : te(l, e), Pt = u, Gl = n;
        }
        break;
      case 30:
        break;
      default:
        te(l, e);
    }
  }
  function cs(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, cs(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && oi(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var Dl = null, ut = !1;
  function le(l, t, e) {
    for (e = e.child; e !== null; )
      fs(l, t, e), e = e.sibling;
  }
  function fs(l, t, e) {
    if (ot && typeof ot.onCommitFiberUnmount == "function")
      try {
        ot.onCommitFiberUnmount(ja, e);
      } catch {
      }
    switch (e.tag) {
      case 26:
        Gl || Yt(e, t), le(
          l,
          t,
          e
        ), e.memoizedState ? e.memoizedState.count-- : e.stateNode && (e = e.stateNode, e.parentNode.removeChild(e));
        break;
      case 27:
        Gl || Yt(e, t);
        var a = Dl, u = ut;
        Ue(e.type) && (Dl = e.stateNode, ut = !1), le(
          l,
          t,
          e
        ), Mu(e.stateNode), Dl = a, ut = u;
        break;
      case 5:
        Gl || Yt(e, t);
      case 6:
        if (a = Dl, u = ut, Dl = null, le(
          l,
          t,
          e
        ), Dl = a, ut = u, Dl !== null)
          if (ut)
            try {
              (Dl.nodeType === 9 ? Dl.body : Dl.nodeName === "HTML" ? Dl.ownerDocument.body : Dl).removeChild(e.stateNode);
            } catch (n) {
              ml(
                e,
                t,
                n
              );
            }
          else
            try {
              Dl.removeChild(e.stateNode);
            } catch (n) {
              ml(
                e,
                t,
                n
              );
            }
        break;
      case 18:
        Dl !== null && (ut ? (l = Dl, lr(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          e.stateNode
        ), Ya(l)) : lr(Dl, e.stateNode));
        break;
      case 4:
        a = Dl, u = ut, Dl = e.stateNode.containerInfo, ut = !0, le(
          l,
          t,
          e
        ), Dl = a, ut = u;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Te(2, e, t), Gl || Te(4, e, t), le(
          l,
          t,
          e
        );
        break;
      case 1:
        Gl || (Yt(e, t), a = e.stateNode, typeof a.componentWillUnmount == "function" && ts(
          e,
          t,
          a
        )), le(
          l,
          t,
          e
        );
        break;
      case 21:
        le(
          l,
          t,
          e
        );
        break;
      case 22:
        Gl = (a = Gl) || e.memoizedState !== null, le(
          l,
          t,
          e
        ), Gl = a;
        break;
      default:
        le(
          l,
          t,
          e
        );
    }
  }
  function os(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated;
      try {
        Ya(l);
      } catch (e) {
        ml(t, t.return, e);
      }
    }
  }
  function ss(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        Ya(l);
      } catch (e) {
        ml(t, t.return, e);
      }
  }
  function rd(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new ns()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new ns()), t;
      default:
        throw Error(f(435, l.tag));
    }
  }
  function Dn(l, t) {
    var e = rd(l);
    t.forEach(function(a) {
      if (!e.has(a)) {
        e.add(a);
        var u = bd.bind(null, l, a);
        a.then(u, u);
      }
    });
  }
  function nt(l, t) {
    var e = t.deletions;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var u = e[a], n = l, i = t, c = i;
        l: for (; c !== null; ) {
          switch (c.tag) {
            case 27:
              if (Ue(c.type)) {
                Dl = c.stateNode, ut = !1;
                break l;
              }
              break;
            case 5:
              Dl = c.stateNode, ut = !1;
              break l;
            case 3:
            case 4:
              Dl = c.stateNode.containerInfo, ut = !0;
              break l;
          }
          c = c.return;
        }
        if (Dl === null) throw Error(f(160));
        fs(n, i, u), Dl = null, ut = !1, n = u.alternate, n !== null && (n.return = null), u.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        rs(t, l), t = t.sibling;
  }
  var Ct = null;
  function rs(l, t) {
    var e = l.alternate, a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        nt(t, l), it(l), a & 4 && (Te(3, l, l.return), vu(3, l), Te(5, l, l.return));
        break;
      case 1:
        nt(t, l), it(l), a & 512 && (Gl || e === null || Yt(e, e.return)), a & 64 && Pt && (l = l.updateQueue, l !== null && (a = l.callbacks, a !== null && (e = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = e === null ? a : e.concat(a))));
        break;
      case 26:
        var u = Ct;
        if (nt(t, l), it(l), a & 512 && (Gl || e === null || Yt(e, e.return)), a & 4) {
          var n = e !== null ? e.memoizedState : null;
          if (a = l.memoizedState, e === null)
            if (a === null)
              if (l.stateNode === null) {
                l: {
                  a = l.type, e = l.memoizedProps, u = u.ownerDocument || u;
                  t: switch (a) {
                    case "title":
                      n = u.getElementsByTagName("title")[0], (!n || n[Za] || n[Vl] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.hasAttribute("itemprop")) && (n = u.createElement(a), u.head.insertBefore(
                        n,
                        u.querySelector("head > title")
                      )), Wl(n, a, e), n[Vl] = l, Ql(n), a = n;
                      break l;
                    case "link":
                      var i = rr(
                        "link",
                        "href",
                        u
                      ).get(a + (e.href || ""));
                      if (i) {
                        for (var c = 0; c < i.length; c++)
                          if (n = i[c], n.getAttribute("href") === (e.href == null || e.href === "" ? null : e.href) && n.getAttribute("rel") === (e.rel == null ? null : e.rel) && n.getAttribute("title") === (e.title == null ? null : e.title) && n.getAttribute("crossorigin") === (e.crossOrigin == null ? null : e.crossOrigin)) {
                            i.splice(c, 1);
                            break t;
                          }
                      }
                      n = u.createElement(a), Wl(n, a, e), u.head.appendChild(n);
                      break;
                    case "meta":
                      if (i = rr(
                        "meta",
                        "content",
                        u
                      ).get(a + (e.content || ""))) {
                        for (c = 0; c < i.length; c++)
                          if (n = i[c], n.getAttribute("content") === (e.content == null ? null : "" + e.content) && n.getAttribute("name") === (e.name == null ? null : e.name) && n.getAttribute("property") === (e.property == null ? null : e.property) && n.getAttribute("http-equiv") === (e.httpEquiv == null ? null : e.httpEquiv) && n.getAttribute("charset") === (e.charSet == null ? null : e.charSet)) {
                            i.splice(c, 1);
                            break t;
                          }
                      }
                      n = u.createElement(a), Wl(n, a, e), u.head.appendChild(n);
                      break;
                    default:
                      throw Error(f(468, a));
                  }
                  n[Vl] = l, Ql(n), a = n;
                }
                l.stateNode = a;
              } else
                hr(
                  u,
                  l.type,
                  l.stateNode
                );
            else
              l.stateNode = sr(
                u,
                a,
                l.memoizedProps
              );
          else
            n !== a ? (n === null ? e.stateNode !== null && (e = e.stateNode, e.parentNode.removeChild(e)) : n.count--, a === null ? hr(
              u,
              l.type,
              l.stateNode
            ) : sr(
              u,
              a,
              l.memoizedProps
            )) : a === null && l.stateNode !== null && Rc(
              l,
              l.memoizedProps,
              e.memoizedProps
            );
        }
        break;
      case 27:
        nt(t, l), it(l), a & 512 && (Gl || e === null || Yt(e, e.return)), e !== null && a & 4 && Rc(
          l,
          l.memoizedProps,
          e.memoizedProps
        );
        break;
      case 5:
        if (nt(t, l), it(l), a & 512 && (Gl || e === null || Yt(e, e.return)), l.flags & 32) {
          u = l.stateNode;
          try {
            fa(u, "");
          } catch (H) {
            ml(l, l.return, H);
          }
        }
        a & 4 && l.stateNode != null && (u = l.memoizedProps, Rc(
          l,
          u,
          e !== null ? e.memoizedProps : u
        )), a & 1024 && (Cc = !0);
        break;
      case 6:
        if (nt(t, l), it(l), a & 4) {
          if (l.stateNode === null)
            throw Error(f(162));
          a = l.memoizedProps, e = l.stateNode;
          try {
            e.nodeValue = a;
          } catch (H) {
            ml(l, l.return, H);
          }
        }
        break;
      case 3:
        if (Qn = null, u = Ct, Ct = jn(t.containerInfo), nt(t, l), Ct = u, it(l), a & 4 && e !== null && e.memoizedState.isDehydrated)
          try {
            Ya(t.containerInfo);
          } catch (H) {
            ml(l, l.return, H);
          }
        Cc && (Cc = !1, hs(l));
        break;
      case 4:
        a = Ct, Ct = jn(
          l.stateNode.containerInfo
        ), nt(t, l), it(l), Ct = a;
        break;
      case 12:
        nt(t, l), it(l);
        break;
      case 31:
        nt(t, l), it(l), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, Dn(l, a)));
        break;
      case 13:
        nt(t, l), it(l), l.child.flags & 8192 && l.memoizedState !== null != (e !== null && e.memoizedState !== null) && (_n = Il()), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, Dn(l, a)));
        break;
      case 22:
        u = l.memoizedState !== null;
        var o = e !== null && e.memoizedState !== null, m = Pt, p = Gl;
        if (Pt = m || u, Gl = p || o, nt(t, l), Gl = p, Pt = m, it(l), a & 8192)
          l: for (t = l.stateNode, t._visibility = u ? t._visibility & -2 : t._visibility | 1, u && (e === null || o || Pt || Gl || Ie(l)), e = null, t = l; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (e === null) {
                o = e = t;
                try {
                  if (n = o.stateNode, u)
                    i = n.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none";
                  else {
                    c = o.stateNode;
                    var E = o.memoizedProps.style, v = E != null && E.hasOwnProperty("display") ? E.display : null;
                    c.style.display = v == null || typeof v == "boolean" ? "" : ("" + v).trim();
                  }
                } catch (H) {
                  ml(o, o.return, H);
                }
              }
            } else if (t.tag === 6) {
              if (e === null) {
                o = t;
                try {
                  o.stateNode.nodeValue = u ? "" : o.memoizedProps;
                } catch (H) {
                  ml(o, o.return, H);
                }
              }
            } else if (t.tag === 18) {
              if (e === null) {
                o = t;
                try {
                  var y = o.stateNode;
                  u ? tr(y, !0) : tr(o.stateNode, !1);
                } catch (H) {
                  ml(o, o.return, H);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === l) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === l) break l;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === l) break l;
              e === t && (e = null), t = t.return;
            }
            e === t && (e = null), t.sibling.return = t.return, t = t.sibling;
          }
        a & 4 && (a = l.updateQueue, a !== null && (e = a.retryQueue, e !== null && (a.retryQueue = null, Dn(l, e))));
        break;
      case 19:
        nt(t, l), it(l), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, Dn(l, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        nt(t, l), it(l);
    }
  }
  function it(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var e, a = l.return; a !== null; ) {
          if (as(a)) {
            e = a;
            break;
          }
          a = a.return;
        }
        if (e == null) throw Error(f(160));
        switch (e.tag) {
          case 27:
            var u = e.stateNode, n = Oc(l);
            Mn(l, n, u);
            break;
          case 5:
            var i = e.stateNode;
            e.flags & 32 && (fa(i, ""), e.flags &= -33);
            var c = Oc(l);
            Mn(l, c, i);
            break;
          case 3:
          case 4:
            var o = e.stateNode.containerInfo, m = Oc(l);
            Nc(
              l,
              m,
              o
            );
            break;
          default:
            throw Error(f(161));
        }
      } catch (p) {
        ml(l, l.return, p);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function hs(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        hs(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), l = l.sibling;
      }
  }
  function te(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        is(l, t.alternate, t), t = t.sibling;
  }
  function Ie(l) {
    for (l = l.child; l !== null; ) {
      var t = l;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Te(4, t, t.return), Ie(t);
          break;
        case 1:
          Yt(t, t.return);
          var e = t.stateNode;
          typeof e.componentWillUnmount == "function" && ts(
            t,
            t.return,
            e
          ), Ie(t);
          break;
        case 27:
          Mu(t.stateNode);
        case 26:
        case 5:
          Yt(t, t.return), Ie(t);
          break;
        case 22:
          t.memoizedState === null && Ie(t);
          break;
        case 30:
          Ie(t);
          break;
        default:
          Ie(t);
      }
      l = l.sibling;
    }
  }
  function ee(l, t, e) {
    for (e = e && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, u = l, n = t, i = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          ee(
            u,
            n,
            e
          ), vu(4, n);
          break;
        case 1:
          if (ee(
            u,
            n,
            e
          ), a = n, u = a.stateNode, typeof u.componentDidMount == "function")
            try {
              u.componentDidMount();
            } catch (m) {
              ml(a, a.return, m);
            }
          if (a = n, u = a.updateQueue, u !== null) {
            var c = a.stateNode;
            try {
              var o = u.shared.hiddenCallbacks;
              if (o !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < o.length; u++)
                  Qo(o[u], c);
            } catch (m) {
              ml(a, a.return, m);
            }
          }
          e && i & 64 && ls(n), yu(n, n.return);
          break;
        case 27:
          us(n);
        case 26:
        case 5:
          ee(
            u,
            n,
            e
          ), e && a === null && i & 4 && es(n), yu(n, n.return);
          break;
        case 12:
          ee(
            u,
            n,
            e
          );
          break;
        case 31:
          ee(
            u,
            n,
            e
          ), e && i & 4 && os(u, n);
          break;
        case 13:
          ee(
            u,
            n,
            e
          ), e && i & 4 && ss(u, n);
          break;
        case 22:
          n.memoizedState === null && ee(
            u,
            n,
            e
          ), yu(n, n.return);
          break;
        case 30:
          break;
        default:
          ee(
            u,
            n,
            e
          );
      }
      t = t.sibling;
    }
  }
  function Hc(l, t) {
    var e = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== e && (l != null && l.refCount++, e != null && au(e));
  }
  function qc(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && au(l));
  }
  function Ht(l, t, e, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        ds(
          l,
          t,
          e,
          a
        ), t = t.sibling;
  }
  function ds(l, t, e, a) {
    var u = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Ht(
          l,
          t,
          e,
          a
        ), u & 2048 && vu(9, t);
        break;
      case 1:
        Ht(
          l,
          t,
          e,
          a
        );
        break;
      case 3:
        Ht(
          l,
          t,
          e,
          a
        ), u & 2048 && (l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && au(l)));
        break;
      case 12:
        if (u & 2048) {
          Ht(
            l,
            t,
            e,
            a
          ), l = t.stateNode;
          try {
            var n = t.memoizedProps, i = n.id, c = n.onPostCommit;
            typeof c == "function" && c(
              i,
              t.alternate === null ? "mount" : "update",
              l.passiveEffectDuration,
              -0
            );
          } catch (o) {
            ml(t, t.return, o);
          }
        } else
          Ht(
            l,
            t,
            e,
            a
          );
        break;
      case 31:
        Ht(
          l,
          t,
          e,
          a
        );
        break;
      case 13:
        Ht(
          l,
          t,
          e,
          a
        );
        break;
      case 23:
        break;
      case 22:
        n = t.stateNode, i = t.alternate, t.memoizedState !== null ? n._visibility & 2 ? Ht(
          l,
          t,
          e,
          a
        ) : Su(l, t) : n._visibility & 2 ? Ht(
          l,
          t,
          e,
          a
        ) : (n._visibility |= 2, Ua(
          l,
          t,
          e,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), u & 2048 && Hc(i, t);
        break;
      case 24:
        Ht(
          l,
          t,
          e,
          a
        ), u & 2048 && qc(t.alternate, t);
        break;
      default:
        Ht(
          l,
          t,
          e,
          a
        );
    }
  }
  function Ua(l, t, e, a, u) {
    for (u = u && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var n = l, i = t, c = e, o = a, m = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          Ua(
            n,
            i,
            c,
            o,
            u
          ), vu(8, i);
          break;
        case 23:
          break;
        case 22:
          var p = i.stateNode;
          i.memoizedState !== null ? p._visibility & 2 ? Ua(
            n,
            i,
            c,
            o,
            u
          ) : Su(
            n,
            i
          ) : (p._visibility |= 2, Ua(
            n,
            i,
            c,
            o,
            u
          )), u && m & 2048 && Hc(
            i.alternate,
            i
          );
          break;
        case 24:
          Ua(
            n,
            i,
            c,
            o,
            u
          ), u && m & 2048 && qc(i.alternate, i);
          break;
        default:
          Ua(
            n,
            i,
            c,
            o,
            u
          );
      }
      t = t.sibling;
    }
  }
  function Su(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var e = l, a = t, u = a.flags;
        switch (a.tag) {
          case 22:
            Su(e, a), u & 2048 && Hc(
              a.alternate,
              a
            );
            break;
          case 24:
            Su(e, a), u & 2048 && qc(a.alternate, a);
            break;
          default:
            Su(e, a);
        }
        t = t.sibling;
      }
  }
  var pu = 8192;
  function _a(l, t, e) {
    if (l.subtreeFlags & pu)
      for (l = l.child; l !== null; )
        ms(
          l,
          t,
          e
        ), l = l.sibling;
  }
  function ms(l, t, e) {
    switch (l.tag) {
      case 26:
        _a(
          l,
          t,
          e
        ), l.flags & pu && l.memoizedState !== null && $d(
          e,
          Ct,
          l.memoizedState,
          l.memoizedProps
        );
        break;
      case 5:
        _a(
          l,
          t,
          e
        );
        break;
      case 3:
      case 4:
        var a = Ct;
        Ct = jn(l.stateNode.containerInfo), _a(
          l,
          t,
          e
        ), Ct = a;
        break;
      case 22:
        l.memoizedState === null && (a = l.alternate, a !== null && a.memoizedState !== null ? (a = pu, pu = 16777216, _a(
          l,
          t,
          e
        ), pu = a) : _a(
          l,
          t,
          e
        ));
        break;
      default:
        _a(
          l,
          t,
          e
        );
    }
  }
  function gs(l) {
    var t = l.alternate;
    if (t !== null && (l = t.child, l !== null)) {
      t.child = null;
      do
        t = l.sibling, l.sibling = null, l = t;
      while (l !== null);
    }
  }
  function bu(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          Zl = a, ys(
            a,
            l
          );
        }
      gs(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        vs(l), l = l.sibling;
  }
  function vs(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        bu(l), l.flags & 2048 && Te(9, l, l.return);
        break;
      case 3:
        bu(l);
        break;
      case 12:
        bu(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, Un(l)) : bu(l);
        break;
      default:
        bu(l);
    }
  }
  function Un(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          Zl = a, ys(
            a,
            l
          );
        }
      gs(l);
    }
    for (l = l.child; l !== null; ) {
      switch (t = l, t.tag) {
        case 0:
        case 11:
        case 15:
          Te(8, t, t.return), Un(t);
          break;
        case 22:
          e = t.stateNode, e._visibility & 2 && (e._visibility &= -3, Un(t));
          break;
        default:
          Un(t);
      }
      l = l.sibling;
    }
  }
  function ys(l, t) {
    for (; Zl !== null; ) {
      var e = Zl;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          Te(8, e, t);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var a = e.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          au(e.memoizedState.cache);
      }
      if (a = e.child, a !== null) a.return = e, Zl = a;
      else
        l: for (e = l; Zl !== null; ) {
          a = Zl;
          var u = a.sibling, n = a.return;
          if (cs(a), a === e) {
            Zl = null;
            break l;
          }
          if (u !== null) {
            u.return = n, Zl = u;
            break l;
          }
          Zl = n;
        }
    }
  }
  var hd = {
    getCacheForType: function(l) {
      var t = Jl(ql), e = t.data.get(l);
      return e === void 0 && (e = l(), t.data.set(l, e)), e;
    },
    cacheSignal: function() {
      return Jl(ql).controller.signal;
    }
  }, dd = typeof WeakMap == "function" ? WeakMap : Map, rl = 0, Tl = null, ll = null, el = 0, dl = 0, gt = null, ze = !1, Ra = !1, Bc = !1, ae = 0, Rl = 0, Ee = 0, Pe = 0, Lc = 0, vt = 0, Oa = 0, Tu = null, ct = null, Gc = !1, _n = 0, Ss = 0, Rn = 1 / 0, On = null, Ae = null, wl = 0, xe = null, Na = null, ue = 0, Yc = 0, Xc = null, ps = null, zu = 0, jc = null;
  function yt() {
    return (rl & 2) !== 0 && el !== 0 ? el & -el : S.T !== null ? Jc() : Hf();
  }
  function bs() {
    if (vt === 0)
      if ((el & 536870912) === 0 || il) {
        var l = Gu;
        Gu <<= 1, (Gu & 3932160) === 0 && (Gu = 262144), vt = l;
      } else vt = 536870912;
    return l = dt.current, l !== null && (l.flags |= 32), vt;
  }
  function ft(l, t, e) {
    (l === Tl && (dl === 2 || dl === 9) || l.cancelPendingCommit !== null) && (Ca(l, 0), Me(
      l,
      el,
      vt,
      !1
    )), Qa(l, e), ((rl & 2) === 0 || l !== Tl) && (l === Tl && ((rl & 2) === 0 && (Pe |= e), Rl === 4 && Me(
      l,
      el,
      vt,
      !1
    )), Xt(l));
  }
  function Ts(l, t, e) {
    if ((rl & 6) !== 0) throw Error(f(327));
    var a = !e && (t & 127) === 0 && (t & l.expiredLanes) === 0 || wa(l, t), u = a ? vd(l, t) : Qc(l, t, !0), n = a;
    do {
      if (u === 0) {
        Ra && !a && Me(l, t, 0, !1);
        break;
      } else {
        if (e = l.current.alternate, n && !md(e)) {
          u = Qc(l, t, !1), n = !1;
          continue;
        }
        if (u === 2) {
          if (n = t, l.errorRecoveryDisabledLanes & n)
            var i = 0;
          else
            i = l.pendingLanes & -536870913, i = i !== 0 ? i : i & 536870912 ? 536870912 : 0;
          if (i !== 0) {
            t = i;
            l: {
              var c = l;
              u = Tu;
              var o = c.current.memoizedState.isDehydrated;
              if (o && (Ca(c, i).flags |= 256), i = Qc(
                c,
                i,
                !1
              ), i !== 2) {
                if (Bc && !o) {
                  c.errorRecoveryDisabledLanes |= n, Pe |= n, u = 4;
                  break l;
                }
                n = ct, ct = u, n !== null && (ct === null ? ct = n : ct.push.apply(
                  ct,
                  n
                ));
              }
              u = i;
            }
            if (n = !1, u !== 2) continue;
          }
        }
        if (u === 1) {
          Ca(l, 0), Me(l, t, 0, !0);
          break;
        }
        l: {
          switch (a = l, n = u, n) {
            case 0:
            case 1:
              throw Error(f(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Me(
                a,
                t,
                vt,
                !ze
              );
              break l;
            case 2:
              ct = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(f(329));
          }
          if ((t & 62914560) === t && (u = _n + 300 - Il(), 10 < u)) {
            if (Me(
              a,
              t,
              vt,
              !ze
            ), Xu(a, 0, !0) !== 0) break l;
            ue = t, a.timeoutHandle = Is(
              zs.bind(
                null,
                a,
                e,
                ct,
                On,
                Gc,
                t,
                vt,
                Pe,
                Oa,
                ze,
                n,
                "Throttled",
                -0,
                0
              ),
              u
            );
            break l;
          }
          zs(
            a,
            e,
            ct,
            On,
            Gc,
            t,
            vt,
            Pe,
            Oa,
            ze,
            n,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Xt(l);
  }
  function zs(l, t, e, a, u, n, i, c, o, m, p, E, v, y) {
    if (l.timeoutHandle = -1, E = t.subtreeFlags, E & 8192 || (E & 16785408) === 16785408) {
      E = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Qt
      }, ms(
        t,
        n,
        E
      );
      var H = (n & 62914560) === n ? _n - Il() : (n & 4194048) === n ? Ss - Il() : 0;
      if (H = Id(
        E,
        H
      ), H !== null) {
        ue = n, l.cancelPendingCommit = H(
          Rs.bind(
            null,
            l,
            t,
            n,
            e,
            a,
            u,
            i,
            c,
            o,
            p,
            E,
            null,
            v,
            y
          )
        ), Me(l, n, i, !m);
        return;
      }
    }
    Rs(
      l,
      t,
      n,
      e,
      a,
      u,
      i,
      c,
      o
    );
  }
  function md(l) {
    for (var t = l; ; ) {
      var e = t.tag;
      if ((e === 0 || e === 11 || e === 15) && t.flags & 16384 && (e = t.updateQueue, e !== null && (e = e.stores, e !== null)))
        for (var a = 0; a < e.length; a++) {
          var u = e[a], n = u.getSnapshot;
          u = u.value;
          try {
            if (!rt(n(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (e = t.child, t.subtreeFlags & 16384 && e !== null)
        e.return = t, t = e;
      else {
        if (t === l) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === l) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Me(l, t, e, a) {
    t &= ~Lc, t &= ~Pe, l.suspendedLanes |= t, l.pingedLanes &= ~t, a && (l.warmLanes |= t), a = l.expirationTimes;
    for (var u = t; 0 < u; ) {
      var n = 31 - st(u), i = 1 << n;
      a[n] = -1, u &= ~i;
    }
    e !== 0 && Of(l, e, t);
  }
  function Nn() {
    return (rl & 6) === 0 ? (Eu(0), !1) : !0;
  }
  function wc() {
    if (ll !== null) {
      if (dl === 0)
        var l = ll.return;
      else
        l = ll, Jt = Ze = null, uc(l), Ea = null, nu = 0, l = ll;
      for (; l !== null; )
        P0(l.alternate, l), l = l.return;
      ll = null;
    }
  }
  function Ca(l, t) {
    var e = l.timeoutHandle;
    e !== -1 && (l.timeoutHandle = -1, Hd(e)), e = l.cancelPendingCommit, e !== null && (l.cancelPendingCommit = null, e()), ue = 0, wc(), Tl = l, ll = e = Vt(l.current, null), el = t, dl = 0, gt = null, ze = !1, Ra = wa(l, t), Bc = !1, Oa = vt = Lc = Pe = Ee = Rl = 0, ct = Tu = null, Gc = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = l.entangledLanes;
    if (a !== 0)
      for (l = l.entanglements, a &= t; 0 < a; ) {
        var u = 31 - st(a), n = 1 << u;
        t |= l[u], a &= ~n;
      }
    return ae = t, Iu(), e;
  }
  function Es(l, t) {
    W = null, S.H = du, t === za || t === cn ? (t = Yo(), dl = 3) : t === Ki ? (t = Yo(), dl = 4) : dl = t === bc ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, gt = t, ll === null && (Rl = 1, Tn(
      l,
      Et(t, l.current)
    ));
  }
  function As() {
    var l = dt.current;
    return l === null ? !0 : (el & 4194048) === el ? Dt === null : (el & 62914560) === el || (el & 536870912) !== 0 ? l === Dt : !1;
  }
  function xs() {
    var l = S.H;
    return S.H = du, l === null ? du : l;
  }
  function Ms() {
    var l = S.A;
    return S.A = hd, l;
  }
  function Cn() {
    Rl = 4, ze || (el & 4194048) !== el && dt.current !== null || (Ra = !0), (Ee & 134217727) === 0 && (Pe & 134217727) === 0 || Tl === null || Me(
      Tl,
      el,
      vt,
      !1
    );
  }
  function Qc(l, t, e) {
    var a = rl;
    rl |= 2;
    var u = xs(), n = Ms();
    (Tl !== l || el !== t) && (On = null, Ca(l, t)), t = !1;
    var i = Rl;
    l: do
      try {
        if (dl !== 0 && ll !== null) {
          var c = ll, o = gt;
          switch (dl) {
            case 8:
              wc(), i = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              dt.current === null && (t = !0);
              var m = dl;
              if (dl = 0, gt = null, Ha(l, c, o, m), e && Ra) {
                i = 0;
                break l;
              }
              break;
            default:
              m = dl, dl = 0, gt = null, Ha(l, c, o, m);
          }
        }
        gd(), i = Rl;
        break;
      } catch (p) {
        Es(l, p);
      }
    while (!0);
    return t && l.shellSuspendCounter++, Jt = Ze = null, rl = a, S.H = u, S.A = n, ll === null && (Tl = null, el = 0, Iu()), i;
  }
  function gd() {
    for (; ll !== null; ) Ds(ll);
  }
  function vd(l, t) {
    var e = rl;
    rl |= 2;
    var a = xs(), u = Ms();
    Tl !== l || el !== t ? (On = null, Rn = Il() + 500, Ca(l, t)) : Ra = wa(
      l,
      t
    );
    l: do
      try {
        if (dl !== 0 && ll !== null) {
          t = ll;
          var n = gt;
          t: switch (dl) {
            case 1:
              dl = 0, gt = null, Ha(l, t, n, 1);
              break;
            case 2:
            case 9:
              if (Lo(n)) {
                dl = 0, gt = null, Us(t);
                break;
              }
              t = function() {
                dl !== 2 && dl !== 9 || Tl !== l || (dl = 7), Xt(l);
              }, n.then(t, t);
              break l;
            case 3:
              dl = 7;
              break l;
            case 4:
              dl = 5;
              break l;
            case 7:
              Lo(n) ? (dl = 0, gt = null, Us(t)) : (dl = 0, gt = null, Ha(l, t, n, 7));
              break;
            case 5:
              var i = null;
              switch (ll.tag) {
                case 26:
                  i = ll.memoizedState;
                case 5:
                case 27:
                  var c = ll;
                  if (i ? dr(i) : c.stateNode.complete) {
                    dl = 0, gt = null;
                    var o = c.sibling;
                    if (o !== null) ll = o;
                    else {
                      var m = c.return;
                      m !== null ? (ll = m, Hn(m)) : ll = null;
                    }
                    break t;
                  }
              }
              dl = 0, gt = null, Ha(l, t, n, 5);
              break;
            case 6:
              dl = 0, gt = null, Ha(l, t, n, 6);
              break;
            case 8:
              wc(), Rl = 6;
              break l;
            default:
              throw Error(f(462));
          }
        }
        yd();
        break;
      } catch (p) {
        Es(l, p);
      }
    while (!0);
    return Jt = Ze = null, S.H = a, S.A = u, rl = e, ll !== null ? 0 : (Tl = null, el = 0, Iu(), Rl);
  }
  function yd() {
    for (; ll !== null && !ti(); )
      Ds(ll);
  }
  function Ds(l) {
    var t = $0(l.alternate, l, ae);
    l.memoizedProps = l.pendingProps, t === null ? Hn(l) : ll = t;
  }
  function Us(l) {
    var t = l, e = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = V0(
          e,
          t,
          t.pendingProps,
          t.type,
          void 0,
          el
        );
        break;
      case 11:
        t = V0(
          e,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          el
        );
        break;
      case 5:
        uc(t);
      default:
        P0(e, t), t = ll = Mo(t, ae), t = $0(e, t, ae);
    }
    l.memoizedProps = l.pendingProps, t === null ? Hn(l) : ll = t;
  }
  function Ha(l, t, e, a) {
    Jt = Ze = null, uc(t), Ea = null, nu = 0;
    var u = t.return;
    try {
      if (nd(
        l,
        u,
        t,
        e,
        el
      )) {
        Rl = 1, Tn(
          l,
          Et(e, l.current)
        ), ll = null;
        return;
      }
    } catch (n) {
      if (u !== null) throw ll = u, n;
      Rl = 1, Tn(
        l,
        Et(e, l.current)
      ), ll = null;
      return;
    }
    t.flags & 32768 ? (il || a === 1 ? l = !0 : Ra || (el & 536870912) !== 0 ? l = !1 : (ze = l = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = dt.current, a !== null && a.tag === 13 && (a.flags |= 16384))), _s(t, l)) : Hn(t);
  }
  function Hn(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        _s(
          t,
          ze
        );
        return;
      }
      l = t.return;
      var e = fd(
        t.alternate,
        t,
        ae
      );
      if (e !== null) {
        ll = e;
        return;
      }
      if (t = t.sibling, t !== null) {
        ll = t;
        return;
      }
      ll = t = l;
    } while (t !== null);
    Rl === 0 && (Rl = 5);
  }
  function _s(l, t) {
    do {
      var e = od(l.alternate, l);
      if (e !== null) {
        e.flags &= 32767, ll = e;
        return;
      }
      if (e = l.return, e !== null && (e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null), !t && (l = l.sibling, l !== null)) {
        ll = l;
        return;
      }
      ll = l = e;
    } while (l !== null);
    Rl = 6, ll = null;
  }
  function Rs(l, t, e, a, u, n, i, c, o) {
    l.cancelPendingCommit = null;
    do
      qn();
    while (wl !== 0);
    if ((rl & 6) !== 0) throw Error(f(327));
    if (t !== null) {
      if (t === l.current) throw Error(f(177));
      if (n = t.lanes | t.childLanes, n |= Oi, Fr(
        l,
        e,
        n,
        i,
        c,
        o
      ), l === Tl && (ll = Tl = null, el = 0), Na = t, xe = l, ue = e, Yc = n, Xc = u, ps = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, Td(ta, function() {
        return qs(), null;
      })) : (l.callbackNode = null, l.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = S.T, S.T = null, u = U.p, U.p = 2, i = rl, rl |= 4;
        try {
          sd(l, t, e);
        } finally {
          rl = i, U.p = u, S.T = a;
        }
      }
      wl = 1, Os(), Ns(), Cs();
    }
  }
  function Os() {
    if (wl === 1) {
      wl = 0;
      var l = xe, t = Na, e = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || e) {
        e = S.T, S.T = null;
        var a = U.p;
        U.p = 2;
        var u = rl;
        rl |= 4;
        try {
          rs(t, l);
          var n = tf, i = yo(l.containerInfo), c = n.focusedElem, o = n.selectionRange;
          if (i !== c && c && c.ownerDocument && vo(
            c.ownerDocument.documentElement,
            c
          )) {
            if (o !== null && Mi(c)) {
              var m = o.start, p = o.end;
              if (p === void 0 && (p = m), "selectionStart" in c)
                c.selectionStart = m, c.selectionEnd = Math.min(
                  p,
                  c.value.length
                );
              else {
                var E = c.ownerDocument || document, v = E && E.defaultView || window;
                if (v.getSelection) {
                  var y = v.getSelection(), H = c.textContent.length, Y = Math.min(o.start, H), bl = o.end === void 0 ? Y : Math.min(o.end, H);
                  !y.extend && Y > bl && (i = bl, bl = Y, Y = i);
                  var h = go(
                    c,
                    Y
                  ), s = go(
                    c,
                    bl
                  );
                  if (h && s && (y.rangeCount !== 1 || y.anchorNode !== h.node || y.anchorOffset !== h.offset || y.focusNode !== s.node || y.focusOffset !== s.offset)) {
                    var d = E.createRange();
                    d.setStart(h.node, h.offset), y.removeAllRanges(), Y > bl ? (y.addRange(d), y.extend(s.node, s.offset)) : (d.setEnd(s.node, s.offset), y.addRange(d));
                  }
                }
              }
            }
            for (E = [], y = c; y = y.parentNode; )
              y.nodeType === 1 && E.push({
                element: y,
                left: y.scrollLeft,
                top: y.scrollTop
              });
            for (typeof c.focus == "function" && c.focus(), c = 0; c < E.length; c++) {
              var b = E[c];
              b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
            }
          }
          Jn = !!lf, tf = lf = null;
        } finally {
          rl = u, U.p = a, S.T = e;
        }
      }
      l.current = t, wl = 2;
    }
  }
  function Ns() {
    if (wl === 2) {
      wl = 0;
      var l = xe, t = Na, e = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || e) {
        e = S.T, S.T = null;
        var a = U.p;
        U.p = 2;
        var u = rl;
        rl |= 4;
        try {
          is(l, t.alternate, t);
        } finally {
          rl = u, U.p = a, S.T = e;
        }
      }
      wl = 3;
    }
  }
  function Cs() {
    if (wl === 4 || wl === 3) {
      wl = 0, ei();
      var l = xe, t = Na, e = ue, a = ps;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? wl = 5 : (wl = 0, Na = xe = null, Hs(l, l.pendingLanes));
      var u = l.pendingLanes;
      if (u === 0 && (Ae = null), ci(e), t = t.stateNode, ot && typeof ot.onCommitFiberRoot == "function")
        try {
          ot.onCommitFiberRoot(
            ja,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = S.T, u = U.p, U.p = 2, S.T = null;
        try {
          for (var n = l.onRecoverableError, i = 0; i < a.length; i++) {
            var c = a[i];
            n(c.value, {
              componentStack: c.stack
            });
          }
        } finally {
          S.T = t, U.p = u;
        }
      }
      (ue & 3) !== 0 && qn(), Xt(l), u = l.pendingLanes, (e & 261930) !== 0 && (u & 42) !== 0 ? l === jc ? zu++ : (zu = 0, jc = l) : zu = 0, Eu(0);
    }
  }
  function Hs(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, au(t)));
  }
  function qn() {
    return Os(), Ns(), Cs(), qs();
  }
  function qs() {
    if (wl !== 5) return !1;
    var l = xe, t = Yc;
    Yc = 0;
    var e = ci(ue), a = S.T, u = U.p;
    try {
      U.p = 32 > e ? 32 : e, S.T = null, e = Xc, Xc = null;
      var n = xe, i = ue;
      if (wl = 0, Na = xe = null, ue = 0, (rl & 6) !== 0) throw Error(f(331));
      var c = rl;
      if (rl |= 4, vs(n.current), ds(
        n,
        n.current,
        i,
        e
      ), rl = c, Eu(0, !1), ot && typeof ot.onPostCommitFiberRoot == "function")
        try {
          ot.onPostCommitFiberRoot(ja, n);
        } catch {
        }
      return !0;
    } finally {
      U.p = u, S.T = a, Hs(l, t);
    }
  }
  function Bs(l, t, e) {
    t = Et(e, t), t = pc(l.stateNode, t, 2), l = Se(l, t, 2), l !== null && (Qa(l, 2), Xt(l));
  }
  function ml(l, t, e) {
    if (l.tag === 3)
      Bs(l, l, e);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Bs(
            t,
            l,
            e
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Ae === null || !Ae.has(a))) {
            l = Et(e, l), e = L0(2), a = Se(t, e, 2), a !== null && (G0(
              e,
              a,
              t,
              l
            ), Qa(a, 2), Xt(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Zc(l, t, e) {
    var a = l.pingCache;
    if (a === null) {
      a = l.pingCache = new dd();
      var u = /* @__PURE__ */ new Set();
      a.set(t, u);
    } else
      u = a.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), a.set(t, u));
    u.has(e) || (Bc = !0, u.add(e), l = Sd.bind(null, l, t, e), t.then(l, l));
  }
  function Sd(l, t, e) {
    var a = l.pingCache;
    a !== null && a.delete(t), l.pingedLanes |= l.suspendedLanes & e, l.warmLanes &= ~e, Tl === l && (el & e) === e && (Rl === 4 || Rl === 3 && (el & 62914560) === el && 300 > Il() - _n ? (rl & 2) === 0 && Ca(l, 0) : Lc |= e, Oa === el && (Oa = 0)), Xt(l);
  }
  function Ls(l, t) {
    t === 0 && (t = Rf()), l = je(l, t), l !== null && (Qa(l, t), Xt(l));
  }
  function pd(l) {
    var t = l.memoizedState, e = 0;
    t !== null && (e = t.retryLane), Ls(l, e);
  }
  function bd(l, t) {
    var e = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var a = l.stateNode, u = l.memoizedState;
        u !== null && (e = u.retryLane);
        break;
      case 19:
        a = l.stateNode;
        break;
      case 22:
        a = l.stateNode._retryCache;
        break;
      default:
        throw Error(f(314));
    }
    a !== null && a.delete(t), Ls(l, e);
  }
  function Td(l, t) {
    return jt(l, t);
  }
  var Bn = null, qa = null, Vc = !1, Ln = !1, Kc = !1, De = 0;
  function Xt(l) {
    l !== qa && l.next === null && (qa === null ? Bn = qa = l : qa = qa.next = l), Ln = !0, Vc || (Vc = !0, Ed());
  }
  function Eu(l, t) {
    if (!Kc && Ln) {
      Kc = !0;
      do
        for (var e = !1, a = Bn; a !== null; ) {
          if (l !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var n = 0;
            else {
              var i = a.suspendedLanes, c = a.pingedLanes;
              n = (1 << 31 - st(42 | l) + 1) - 1, n &= u & ~(i & ~c), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (e = !0, js(a, n));
          } else
            n = el, n = Xu(
              a,
              a === Tl ? n : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (n & 3) === 0 || wa(a, n) || (e = !0, js(a, n));
          a = a.next;
        }
      while (e);
      Kc = !1;
    }
  }
  function zd() {
    Gs();
  }
  function Gs() {
    Ln = Vc = !1;
    var l = 0;
    De !== 0 && Cd() && (l = De);
    for (var t = Il(), e = null, a = Bn; a !== null; ) {
      var u = a.next, n = Ys(a, t);
      n === 0 ? (a.next = null, e === null ? Bn = u : e.next = u, u === null && (qa = e)) : (e = a, (l !== 0 || (n & 3) !== 0) && (Ln = !0)), a = u;
    }
    wl !== 0 && wl !== 5 || Eu(l), De !== 0 && (De = 0);
  }
  function Ys(l, t) {
    for (var e = l.suspendedLanes, a = l.pingedLanes, u = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var i = 31 - st(n), c = 1 << i, o = u[i];
      o === -1 ? ((c & e) === 0 || (c & a) !== 0) && (u[i] = Wr(c, t)) : o <= t && (l.expiredLanes |= c), n &= ~c;
    }
    if (t = Tl, e = el, e = Xu(
      l,
      l === t ? e : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a = l.callbackNode, e === 0 || l === t && (dl === 2 || dl === 9) || l.cancelPendingCommit !== null)
      return a !== null && a !== null && Bt(a), l.callbackNode = null, l.callbackPriority = 0;
    if ((e & 3) === 0 || wa(l, e)) {
      if (t = e & -e, t === l.callbackPriority) return t;
      switch (a !== null && Bt(a), ci(e)) {
        case 2:
        case 8:
          e = Xa;
          break;
        case 32:
          e = ta;
          break;
        case 268435456:
          e = _f;
          break;
        default:
          e = ta;
      }
      return a = Xs.bind(null, l), e = jt(e, a), l.callbackPriority = t, l.callbackNode = e, t;
    }
    return a !== null && a !== null && Bt(a), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function Xs(l, t) {
    if (wl !== 0 && wl !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var e = l.callbackNode;
    if (qn() && l.callbackNode !== e)
      return null;
    var a = el;
    return a = Xu(
      l,
      l === Tl ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a === 0 ? null : (Ts(l, a, t), Ys(l, Il()), l.callbackNode != null && l.callbackNode === e ? Xs.bind(null, l) : null);
  }
  function js(l, t) {
    if (qn()) return null;
    Ts(l, t, !0);
  }
  function Ed() {
    qd(function() {
      (rl & 6) !== 0 ? jt(
        Bu,
        zd
      ) : Gs();
    });
  }
  function Jc() {
    if (De === 0) {
      var l = ba;
      l === 0 && (l = Lu, Lu <<= 1, (Lu & 261888) === 0 && (Lu = 256)), De = l;
    }
    return De;
  }
  function ws(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : Zu("" + l);
  }
  function Qs(l, t) {
    var e = t.ownerDocument.createElement("input");
    return e.name = t.name, e.value = t.value, l.id && e.setAttribute("form", l.id), t.parentNode.insertBefore(e, t), l = new FormData(l), e.parentNode.removeChild(e), l;
  }
  function Ad(l, t, e, a, u) {
    if (t === "submit" && e && e.stateNode === u) {
      var n = ws(
        (u[et] || null).action
      ), i = a.submitter;
      i && (t = (t = i[et] || null) ? ws(t.formAction) : i.getAttribute("formAction"), t !== null && (n = t, i = null));
      var c = new ku(
        "action",
        "action",
        null,
        a,
        u
      );
      l.push({
        event: c,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (De !== 0) {
                  var o = i ? Qs(u, i) : new FormData(u);
                  dc(
                    e,
                    {
                      pending: !0,
                      data: o,
                      method: u.method,
                      action: n
                    },
                    null,
                    o
                  );
                }
              } else
                typeof n == "function" && (c.preventDefault(), o = i ? Qs(u, i) : new FormData(u), dc(
                  e,
                  {
                    pending: !0,
                    data: o,
                    method: u.method,
                    action: n
                  },
                  n,
                  o
                ));
            },
            currentTarget: u
          }
        ]
      });
    }
  }
  for (var kc = 0; kc < Ri.length; kc++) {
    var Wc = Ri[kc], xd = Wc.toLowerCase(), Md = Wc[0].toUpperCase() + Wc.slice(1);
    Nt(
      xd,
      "on" + Md
    );
  }
  Nt(bo, "onAnimationEnd"), Nt(To, "onAnimationIteration"), Nt(zo, "onAnimationStart"), Nt("dblclick", "onDoubleClick"), Nt("focusin", "onFocus"), Nt("focusout", "onBlur"), Nt(wh, "onTransitionRun"), Nt(Qh, "onTransitionStart"), Nt(Zh, "onTransitionCancel"), Nt(Eo, "onTransitionEnd"), ia("onMouseEnter", ["mouseout", "mouseover"]), ia("onMouseLeave", ["mouseout", "mouseover"]), ia("onPointerEnter", ["pointerout", "pointerover"]), ia("onPointerLeave", ["pointerout", "pointerover"]), Le(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Le(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Le("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Le(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Le(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Le(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Au = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Dd = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Au)
  );
  function Zs(l, t) {
    t = (t & 4) !== 0;
    for (var e = 0; e < l.length; e++) {
      var a = l[e], u = a.event;
      a = a.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var i = a.length - 1; 0 <= i; i--) {
            var c = a[i], o = c.instance, m = c.currentTarget;
            if (c = c.listener, o !== n && u.isPropagationStopped())
              break l;
            n = c, u.currentTarget = m;
            try {
              n(u);
            } catch (p) {
              $u(p);
            }
            u.currentTarget = null, n = o;
          }
        else
          for (i = 0; i < a.length; i++) {
            if (c = a[i], o = c.instance, m = c.currentTarget, c = c.listener, o !== n && u.isPropagationStopped())
              break l;
            n = c, u.currentTarget = m;
            try {
              n(u);
            } catch (p) {
              $u(p);
            }
            u.currentTarget = null, n = o;
          }
      }
    }
  }
  function tl(l, t) {
    var e = t[fi];
    e === void 0 && (e = t[fi] = /* @__PURE__ */ new Set());
    var a = l + "__bubble";
    e.has(a) || (Vs(t, l, 2, !1), e.add(a));
  }
  function Fc(l, t, e) {
    var a = 0;
    t && (a |= 4), Vs(
      e,
      l,
      a,
      t
    );
  }
  var Gn = "_reactListening" + Math.random().toString(36).slice(2);
  function $c(l) {
    if (!l[Gn]) {
      l[Gn] = !0, Lf.forEach(function(e) {
        e !== "selectionchange" && (Dd.has(e) || Fc(e, !1, l), Fc(e, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[Gn] || (t[Gn] = !0, Fc("selectionchange", !1, t));
    }
  }
  function Vs(l, t, e, a) {
    switch (br(t)) {
      case 2:
        var u = tm;
        break;
      case 8:
        u = em;
        break;
      default:
        u = df;
    }
    e = u.bind(
      null,
      t,
      e,
      l
    ), u = void 0, !yi || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (u = !0), a ? u !== void 0 ? l.addEventListener(t, e, {
      capture: !0,
      passive: u
    }) : l.addEventListener(t, e, !0) : u !== void 0 ? l.addEventListener(t, e, {
      passive: u
    }) : l.addEventListener(t, e, !1);
  }
  function Ic(l, t, e, a, u) {
    var n = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      l: for (; ; ) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var c = a.stateNode.containerInfo;
          if (c === u) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var o = i.tag;
              if ((o === 3 || o === 4) && i.stateNode.containerInfo === u)
                return;
              i = i.return;
            }
          for (; c !== null; ) {
            if (i = aa(c), i === null) return;
            if (o = i.tag, o === 5 || o === 6 || o === 26 || o === 27) {
              a = n = i;
              continue l;
            }
            c = c.parentNode;
          }
        }
        a = a.return;
      }
    Wf(function() {
      var m = n, p = gi(e), E = [];
      l: {
        var v = Ao.get(l);
        if (v !== void 0) {
          var y = ku, H = l;
          switch (l) {
            case "keypress":
              if (Ku(e) === 0) break l;
            case "keydown":
            case "keyup":
              y = bh;
              break;
            case "focusin":
              H = "focus", y = Ti;
              break;
            case "focusout":
              H = "blur", y = Ti;
              break;
            case "beforeblur":
            case "afterblur":
              y = Ti;
              break;
            case "click":
              if (e.button === 2) break l;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              y = If;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              y = fh;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              y = Eh;
              break;
            case bo:
            case To:
            case zo:
              y = rh;
              break;
            case Eo:
              y = xh;
              break;
            case "scroll":
            case "scrollend":
              y = ih;
              break;
            case "wheel":
              y = Dh;
              break;
            case "copy":
            case "cut":
            case "paste":
              y = dh;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              y = lo;
              break;
            case "toggle":
            case "beforetoggle":
              y = _h;
          }
          var Y = (t & 4) !== 0, bl = !Y && (l === "scroll" || l === "scrollend"), h = Y ? v !== null ? v + "Capture" : null : v;
          Y = [];
          for (var s = m, d; s !== null; ) {
            var b = s;
            if (d = b.stateNode, b = b.tag, b !== 5 && b !== 26 && b !== 27 || d === null || h === null || (b = Ka(s, h), b != null && Y.push(
              xu(s, b, d)
            )), bl) break;
            s = s.return;
          }
          0 < Y.length && (v = new y(
            v,
            H,
            null,
            e,
            p
          ), E.push({ event: v, listeners: Y }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (v = l === "mouseover" || l === "pointerover", y = l === "mouseout" || l === "pointerout", v && e !== mi && (H = e.relatedTarget || e.fromElement) && (aa(H) || H[ea]))
            break l;
          if ((y || v) && (v = p.window === p ? p : (v = p.ownerDocument) ? v.defaultView || v.parentWindow : window, y ? (H = e.relatedTarget || e.toElement, y = m, H = H ? aa(H) : null, H !== null && (bl = Q(H), Y = H.tag, H !== bl || Y !== 5 && Y !== 27 && Y !== 6) && (H = null)) : (y = null, H = m), y !== H)) {
            if (Y = If, b = "onMouseLeave", h = "onMouseEnter", s = "mouse", (l === "pointerout" || l === "pointerover") && (Y = lo, b = "onPointerLeave", h = "onPointerEnter", s = "pointer"), bl = y == null ? v : Va(y), d = H == null ? v : Va(H), v = new Y(
              b,
              s + "leave",
              y,
              e,
              p
            ), v.target = bl, v.relatedTarget = d, b = null, aa(p) === m && (Y = new Y(
              h,
              s + "enter",
              H,
              e,
              p
            ), Y.target = d, Y.relatedTarget = bl, b = Y), bl = b, y && H)
              t: {
                for (Y = Ud, h = y, s = H, d = 0, b = h; b; b = Y(b))
                  d++;
                b = 0;
                for (var G = s; G; G = Y(G))
                  b++;
                for (; 0 < d - b; )
                  h = Y(h), d--;
                for (; 0 < b - d; )
                  s = Y(s), b--;
                for (; d--; ) {
                  if (h === s || s !== null && h === s.alternate) {
                    Y = h;
                    break t;
                  }
                  h = Y(h), s = Y(s);
                }
                Y = null;
              }
            else Y = null;
            y !== null && Ks(
              E,
              v,
              y,
              Y,
              !1
            ), H !== null && bl !== null && Ks(
              E,
              bl,
              H,
              Y,
              !0
            );
          }
        }
        l: {
          if (v = m ? Va(m) : window, y = v.nodeName && v.nodeName.toLowerCase(), y === "select" || y === "input" && v.type === "file")
            var fl = fo;
          else if (io(v))
            if (oo)
              fl = Yh;
            else {
              fl = Lh;
              var B = Bh;
            }
          else
            y = v.nodeName, !y || y.toLowerCase() !== "input" || v.type !== "checkbox" && v.type !== "radio" ? m && di(m.elementType) && (fl = fo) : fl = Gh;
          if (fl && (fl = fl(l, m))) {
            co(
              E,
              fl,
              e,
              p
            );
            break l;
          }
          B && B(l, v, m), l === "focusout" && m && v.type === "number" && m.memoizedProps.value != null && hi(v, "number", v.value);
        }
        switch (B = m ? Va(m) : window, l) {
          case "focusin":
            (io(B) || B.contentEditable === "true") && (ha = B, Di = m, lu = null);
            break;
          case "focusout":
            lu = Di = ha = null;
            break;
          case "mousedown":
            Ui = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Ui = !1, So(E, e, p);
            break;
          case "selectionchange":
            if (jh) break;
          case "keydown":
          case "keyup":
            So(E, e, p);
        }
        var F;
        if (Ei)
          l: {
            switch (l) {
              case "compositionstart":
                var al = "onCompositionStart";
                break l;
              case "compositionend":
                al = "onCompositionEnd";
                break l;
              case "compositionupdate":
                al = "onCompositionUpdate";
                break l;
            }
            al = void 0;
          }
        else
          ra ? uo(l, e) && (al = "onCompositionEnd") : l === "keydown" && e.keyCode === 229 && (al = "onCompositionStart");
        al && (to && e.locale !== "ko" && (ra || al !== "onCompositionStart" ? al === "onCompositionEnd" && ra && (F = Ff()) : (re = p, Si = "value" in re ? re.value : re.textContent, ra = !0)), B = Yn(m, al), 0 < B.length && (al = new Pf(
          al,
          l,
          null,
          e,
          p
        ), E.push({ event: al, listeners: B }), F ? al.data = F : (F = no(e), F !== null && (al.data = F)))), (F = Oh ? Nh(l, e) : Ch(l, e)) && (al = Yn(m, "onBeforeInput"), 0 < al.length && (B = new Pf(
          "onBeforeInput",
          "beforeinput",
          null,
          e,
          p
        ), E.push({
          event: B,
          listeners: al
        }), B.data = F)), Ad(
          E,
          l,
          m,
          e,
          p
        );
      }
      Zs(E, t);
    });
  }
  function xu(l, t, e) {
    return {
      instance: l,
      listener: t,
      currentTarget: e
    };
  }
  function Yn(l, t) {
    for (var e = t + "Capture", a = []; l !== null; ) {
      var u = l, n = u.stateNode;
      if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || n === null || (u = Ka(l, e), u != null && a.unshift(
        xu(l, u, n)
      ), u = Ka(l, t), u != null && a.push(
        xu(l, u, n)
      )), l.tag === 3) return a;
      l = l.return;
    }
    return [];
  }
  function Ud(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function Ks(l, t, e, a, u) {
    for (var n = t._reactName, i = []; e !== null && e !== a; ) {
      var c = e, o = c.alternate, m = c.stateNode;
      if (c = c.tag, o !== null && o === a) break;
      c !== 5 && c !== 26 && c !== 27 || m === null || (o = m, u ? (m = Ka(e, n), m != null && i.unshift(
        xu(e, m, o)
      )) : u || (m = Ka(e, n), m != null && i.push(
        xu(e, m, o)
      ))), e = e.return;
    }
    i.length !== 0 && l.push({ event: t, listeners: i });
  }
  var _d = /\r\n?/g, Rd = /\u0000|\uFFFD/g;
  function Js(l) {
    return (typeof l == "string" ? l : "" + l).replace(_d, `
`).replace(Rd, "");
  }
  function ks(l, t) {
    return t = Js(t), Js(l) === t;
  }
  function pl(l, t, e, a, u, n) {
    switch (e) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || fa(l, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && fa(l, "" + a);
        break;
      case "className":
        wu(l, "class", a);
        break;
      case "tabIndex":
        wu(l, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        wu(l, e, a);
        break;
      case "style":
        Jf(l, a, n);
        break;
      case "data":
        if (t !== "object") {
          wu(l, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || e !== "href")) {
          l.removeAttribute(e);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(e);
          break;
        }
        a = Zu("" + a), l.setAttribute(e, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          l.setAttribute(
            e,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof n == "function" && (e === "formAction" ? (t !== "input" && pl(l, t, "name", u.name, u, null), pl(
            l,
            t,
            "formEncType",
            u.formEncType,
            u,
            null
          ), pl(
            l,
            t,
            "formMethod",
            u.formMethod,
            u,
            null
          ), pl(
            l,
            t,
            "formTarget",
            u.formTarget,
            u,
            null
          )) : (pl(l, t, "encType", u.encType, u, null), pl(l, t, "method", u.method, u, null), pl(l, t, "target", u.target, u, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(e);
          break;
        }
        a = Zu("" + a), l.setAttribute(e, a);
        break;
      case "onClick":
        a != null && (l.onclick = Qt);
        break;
      case "onScroll":
        a != null && tl("scroll", l);
        break;
      case "onScrollEnd":
        a != null && tl("scrollend", l);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(f(61));
          if (e = a.__html, e != null) {
            if (u.children != null) throw Error(f(60));
            l.innerHTML = e;
          }
        }
        break;
      case "multiple":
        l.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        l.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          l.removeAttribute("xlink:href");
          break;
        }
        e = Zu("" + a), l.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          e
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(e, "" + a) : l.removeAttribute(e);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(e, "") : l.removeAttribute(e);
        break;
      case "capture":
      case "download":
        a === !0 ? l.setAttribute(e, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(e, a) : l.removeAttribute(e);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? l.setAttribute(e, a) : l.removeAttribute(e);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? l.removeAttribute(e) : l.setAttribute(e, a);
        break;
      case "popover":
        tl("beforetoggle", l), tl("toggle", l), ju(l, "popover", a);
        break;
      case "xlinkActuate":
        wt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        wt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        wt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        wt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        wt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        wt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        wt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        wt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        wt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        ju(l, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N") && (e = uh.get(e) || e, ju(l, e, a));
    }
  }
  function Pc(l, t, e, a, u, n) {
    switch (e) {
      case "style":
        Jf(l, a, n);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(f(61));
          if (e = a.__html, e != null) {
            if (u.children != null) throw Error(f(60));
            l.innerHTML = e;
          }
        }
        break;
      case "children":
        typeof a == "string" ? fa(l, a) : (typeof a == "number" || typeof a == "bigint") && fa(l, "" + a);
        break;
      case "onScroll":
        a != null && tl("scroll", l);
        break;
      case "onScrollEnd":
        a != null && tl("scrollend", l);
        break;
      case "onClick":
        a != null && (l.onclick = Qt);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Gf.hasOwnProperty(e))
          l: {
            if (e[0] === "o" && e[1] === "n" && (u = e.endsWith("Capture"), t = e.slice(2, u ? e.length - 7 : void 0), n = l[et] || null, n = n != null ? n[e] : null, typeof n == "function" && l.removeEventListener(t, n, u), typeof a == "function")) {
              typeof n != "function" && n !== null && (e in l ? l[e] = null : l.hasAttribute(e) && l.removeAttribute(e)), l.addEventListener(t, a, u);
              break l;
            }
            e in l ? l[e] = a : a === !0 ? l.setAttribute(e, "") : ju(l, e, a);
          }
    }
  }
  function Wl(l, t, e) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        tl("error", l), tl("load", l);
        var a = !1, u = !1, n;
        for (n in e)
          if (e.hasOwnProperty(n)) {
            var i = e[n];
            if (i != null)
              switch (n) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  u = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(f(137, t));
                default:
                  pl(l, t, n, i, e, null);
              }
          }
        u && pl(l, t, "srcSet", e.srcSet, e, null), a && pl(l, t, "src", e.src, e, null);
        return;
      case "input":
        tl("invalid", l);
        var c = n = i = u = null, o = null, m = null;
        for (a in e)
          if (e.hasOwnProperty(a)) {
            var p = e[a];
            if (p != null)
              switch (a) {
                case "name":
                  u = p;
                  break;
                case "type":
                  i = p;
                  break;
                case "checked":
                  o = p;
                  break;
                case "defaultChecked":
                  m = p;
                  break;
                case "value":
                  n = p;
                  break;
                case "defaultValue":
                  c = p;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (p != null)
                    throw Error(f(137, t));
                  break;
                default:
                  pl(l, t, a, p, e, null);
              }
          }
        Qf(
          l,
          n,
          c,
          o,
          m,
          i,
          u,
          !1
        );
        return;
      case "select":
        tl("invalid", l), a = i = n = null;
        for (u in e)
          if (e.hasOwnProperty(u) && (c = e[u], c != null))
            switch (u) {
              case "value":
                n = c;
                break;
              case "defaultValue":
                i = c;
                break;
              case "multiple":
                a = c;
              default:
                pl(l, t, u, c, e, null);
            }
        t = n, e = i, l.multiple = !!a, t != null ? ca(l, !!a, t, !1) : e != null && ca(l, !!a, e, !0);
        return;
      case "textarea":
        tl("invalid", l), n = u = a = null;
        for (i in e)
          if (e.hasOwnProperty(i) && (c = e[i], c != null))
            switch (i) {
              case "value":
                a = c;
                break;
              case "defaultValue":
                u = c;
                break;
              case "children":
                n = c;
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(f(91));
                break;
              default:
                pl(l, t, i, c, e, null);
            }
        Vf(l, a, u, n);
        return;
      case "option":
        for (o in e)
          e.hasOwnProperty(o) && (a = e[o], a != null) && (o === "selected" ? l.selected = a && typeof a != "function" && typeof a != "symbol" : pl(l, t, o, a, e, null));
        return;
      case "dialog":
        tl("beforetoggle", l), tl("toggle", l), tl("cancel", l), tl("close", l);
        break;
      case "iframe":
      case "object":
        tl("load", l);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Au.length; a++)
          tl(Au[a], l);
        break;
      case "image":
        tl("error", l), tl("load", l);
        break;
      case "details":
        tl("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        tl("error", l), tl("load", l);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (m in e)
          if (e.hasOwnProperty(m) && (a = e[m], a != null))
            switch (m) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(f(137, t));
              default:
                pl(l, t, m, a, e, null);
            }
        return;
      default:
        if (di(t)) {
          for (p in e)
            e.hasOwnProperty(p) && (a = e[p], a !== void 0 && Pc(
              l,
              t,
              p,
              a,
              e,
              void 0
            ));
          return;
        }
    }
    for (c in e)
      e.hasOwnProperty(c) && (a = e[c], a != null && pl(l, t, c, a, e, null));
  }
  function Od(l, t, e, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var u = null, n = null, i = null, c = null, o = null, m = null, p = null;
        for (y in e) {
          var E = e[y];
          if (e.hasOwnProperty(y) && E != null)
            switch (y) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                o = E;
              default:
                a.hasOwnProperty(y) || pl(l, t, y, null, a, E);
            }
        }
        for (var v in a) {
          var y = a[v];
          if (E = e[v], a.hasOwnProperty(v) && (y != null || E != null))
            switch (v) {
              case "type":
                n = y;
                break;
              case "name":
                u = y;
                break;
              case "checked":
                m = y;
                break;
              case "defaultChecked":
                p = y;
                break;
              case "value":
                i = y;
                break;
              case "defaultValue":
                c = y;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (y != null)
                  throw Error(f(137, t));
                break;
              default:
                y !== E && pl(
                  l,
                  t,
                  v,
                  y,
                  a,
                  E
                );
            }
        }
        ri(
          l,
          i,
          c,
          o,
          m,
          p,
          n,
          u
        );
        return;
      case "select":
        y = i = c = v = null;
        for (n in e)
          if (o = e[n], e.hasOwnProperty(n) && o != null)
            switch (n) {
              case "value":
                break;
              case "multiple":
                y = o;
              default:
                a.hasOwnProperty(n) || pl(
                  l,
                  t,
                  n,
                  null,
                  a,
                  o
                );
            }
        for (u in a)
          if (n = a[u], o = e[u], a.hasOwnProperty(u) && (n != null || o != null))
            switch (u) {
              case "value":
                v = n;
                break;
              case "defaultValue":
                c = n;
                break;
              case "multiple":
                i = n;
              default:
                n !== o && pl(
                  l,
                  t,
                  u,
                  n,
                  a,
                  o
                );
            }
        t = c, e = i, a = y, v != null ? ca(l, !!e, v, !1) : !!a != !!e && (t != null ? ca(l, !!e, t, !0) : ca(l, !!e, e ? [] : "", !1));
        return;
      case "textarea":
        y = v = null;
        for (c in e)
          if (u = e[c], e.hasOwnProperty(c) && u != null && !a.hasOwnProperty(c))
            switch (c) {
              case "value":
                break;
              case "children":
                break;
              default:
                pl(l, t, c, null, a, u);
            }
        for (i in a)
          if (u = a[i], n = e[i], a.hasOwnProperty(i) && (u != null || n != null))
            switch (i) {
              case "value":
                v = u;
                break;
              case "defaultValue":
                y = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(f(91));
                break;
              default:
                u !== n && pl(l, t, i, u, a, n);
            }
        Zf(l, v, y);
        return;
      case "option":
        for (var H in e)
          v = e[H], e.hasOwnProperty(H) && v != null && !a.hasOwnProperty(H) && (H === "selected" ? l.selected = !1 : pl(
            l,
            t,
            H,
            null,
            a,
            v
          ));
        for (o in a)
          v = a[o], y = e[o], a.hasOwnProperty(o) && v !== y && (v != null || y != null) && (o === "selected" ? l.selected = v && typeof v != "function" && typeof v != "symbol" : pl(
            l,
            t,
            o,
            v,
            a,
            y
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var Y in e)
          v = e[Y], e.hasOwnProperty(Y) && v != null && !a.hasOwnProperty(Y) && pl(l, t, Y, null, a, v);
        for (m in a)
          if (v = a[m], y = e[m], a.hasOwnProperty(m) && v !== y && (v != null || y != null))
            switch (m) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (v != null)
                  throw Error(f(137, t));
                break;
              default:
                pl(
                  l,
                  t,
                  m,
                  v,
                  a,
                  y
                );
            }
        return;
      default:
        if (di(t)) {
          for (var bl in e)
            v = e[bl], e.hasOwnProperty(bl) && v !== void 0 && !a.hasOwnProperty(bl) && Pc(
              l,
              t,
              bl,
              void 0,
              a,
              v
            );
          for (p in a)
            v = a[p], y = e[p], !a.hasOwnProperty(p) || v === y || v === void 0 && y === void 0 || Pc(
              l,
              t,
              p,
              v,
              a,
              y
            );
          return;
        }
    }
    for (var h in e)
      v = e[h], e.hasOwnProperty(h) && v != null && !a.hasOwnProperty(h) && pl(l, t, h, null, a, v);
    for (E in a)
      v = a[E], y = e[E], !a.hasOwnProperty(E) || v === y || v == null && y == null || pl(l, t, E, v, a, y);
  }
  function Ws(l) {
    switch (l) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function Nd() {
    if (typeof performance.getEntriesByType == "function") {
      for (var l = 0, t = 0, e = performance.getEntriesByType("resource"), a = 0; a < e.length; a++) {
        var u = e[a], n = u.transferSize, i = u.initiatorType, c = u.duration;
        if (n && c && Ws(i)) {
          for (i = 0, c = u.responseEnd, a += 1; a < e.length; a++) {
            var o = e[a], m = o.startTime;
            if (m > c) break;
            var p = o.transferSize, E = o.initiatorType;
            p && Ws(E) && (o = o.responseEnd, i += p * (o < c ? 1 : (c - m) / (o - m)));
          }
          if (--a, t += 8 * (n + i) / (u.duration / 1e3), l++, 10 < l) break;
        }
      }
      if (0 < l) return t / l / 1e6;
    }
    return navigator.connection && (l = navigator.connection.downlink, typeof l == "number") ? l : 5;
  }
  var lf = null, tf = null;
  function Xn(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function Fs(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function $s(l, t) {
    if (l === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return l === 1 && t === "foreignObject" ? 0 : l;
  }
  function ef(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var af = null;
  function Cd() {
    var l = window.event;
    return l && l.type === "popstate" ? l === af ? !1 : (af = l, !0) : (af = null, !1);
  }
  var Is = typeof setTimeout == "function" ? setTimeout : void 0, Hd = typeof clearTimeout == "function" ? clearTimeout : void 0, Ps = typeof Promise == "function" ? Promise : void 0, qd = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ps < "u" ? function(l) {
    return Ps.resolve(null).then(l).catch(Bd);
  } : Is;
  function Bd(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function Ue(l) {
    return l === "head";
  }
  function lr(l, t) {
    var e = t, a = 0;
    do {
      var u = e.nextSibling;
      if (l.removeChild(e), u && u.nodeType === 8)
        if (e = u.data, e === "/$" || e === "/&") {
          if (a === 0) {
            l.removeChild(u), Ya(t);
            return;
          }
          a--;
        } else if (e === "$" || e === "$?" || e === "$~" || e === "$!" || e === "&")
          a++;
        else if (e === "html")
          Mu(l.ownerDocument.documentElement);
        else if (e === "head") {
          e = l.ownerDocument.head, Mu(e);
          for (var n = e.firstChild; n; ) {
            var i = n.nextSibling, c = n.nodeName;
            n[Za] || c === "SCRIPT" || c === "STYLE" || c === "LINK" && n.rel.toLowerCase() === "stylesheet" || e.removeChild(n), n = i;
          }
        } else
          e === "body" && Mu(l.ownerDocument.body);
      e = u;
    } while (e);
    Ya(t);
  }
  function tr(l, t) {
    var e = l;
    l = 0;
    do {
      var a = e.nextSibling;
      if (e.nodeType === 1 ? t ? (e._stashedDisplay = e.style.display, e.style.display = "none") : (e.style.display = e._stashedDisplay || "", e.getAttribute("style") === "" && e.removeAttribute("style")) : e.nodeType === 3 && (t ? (e._stashedText = e.nodeValue, e.nodeValue = "") : e.nodeValue = e._stashedText || ""), a && a.nodeType === 8)
        if (e = a.data, e === "/$") {
          if (l === 0) break;
          l--;
        } else
          e !== "$" && e !== "$?" && e !== "$~" && e !== "$!" || l++;
      e = a;
    } while (e);
  }
  function uf(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var e = t;
      switch (t = t.nextSibling, e.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          uf(e), oi(e);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (e.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(e);
    }
  }
  function Ld(l, t, e, a) {
    for (; l.nodeType === 1; ) {
      var u = e;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (a) {
        if (!l[Za])
          switch (t) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (n = l.getAttribute("rel"), n === "stylesheet" && l.hasAttribute("data-precedence"))
                break;
              if (n !== u.rel || l.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || l.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || l.getAttribute("title") !== (u.title == null ? null : u.title))
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (n = l.getAttribute("src"), (n !== (u.src == null ? null : u.src) || l.getAttribute("type") !== (u.type == null ? null : u.type) || l.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && n && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                break;
              return l;
            default:
              return l;
          }
      } else if (t === "input" && l.type === "hidden") {
        var n = u.name == null ? null : "" + u.name;
        if (u.type === "hidden" && l.getAttribute("name") === n)
          return l;
      } else return l;
      if (l = Ut(l.nextSibling), l === null) break;
    }
    return null;
  }
  function Gd(l, t, e) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !e || (l = Ut(l.nextSibling), l === null)) return null;
    return l;
  }
  function er(l, t) {
    for (; l.nodeType !== 8; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !t || (l = Ut(l.nextSibling), l === null)) return null;
    return l;
  }
  function nf(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function cf(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading";
  }
  function Yd(l, t) {
    var e = l.ownerDocument;
    if (l.data === "$~") l._reactRetry = t;
    else if (l.data !== "$?" || e.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), e.removeEventListener("DOMContentLoaded", a);
      };
      e.addEventListener("DOMContentLoaded", a), l._reactRetry = a;
    }
  }
  function Ut(l) {
    for (; l != null; l = l.nextSibling) {
      var t = l.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = l.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return l;
  }
  var ff = null;
  function ar(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === "/$" || e === "/&") {
          if (t === 0)
            return Ut(l.nextSibling);
          t--;
        } else
          e !== "$" && e !== "$!" && e !== "$?" && e !== "$~" && e !== "&" || t++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function ur(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&") {
          if (t === 0) return l;
          t--;
        } else e !== "/$" && e !== "/&" || t++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function nr(l, t, e) {
    switch (t = Xn(e), l) {
      case "html":
        if (l = t.documentElement, !l) throw Error(f(452));
        return l;
      case "head":
        if (l = t.head, !l) throw Error(f(453));
        return l;
      case "body":
        if (l = t.body, !l) throw Error(f(454));
        return l;
      default:
        throw Error(f(451));
    }
  }
  function Mu(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    oi(l);
  }
  var _t = /* @__PURE__ */ new Map(), ir = /* @__PURE__ */ new Set();
  function jn(l) {
    return typeof l.getRootNode == "function" ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument;
  }
  var ne = U.d;
  U.d = {
    f: Xd,
    r: jd,
    D: wd,
    C: Qd,
    L: Zd,
    m: Vd,
    X: Jd,
    S: Kd,
    M: kd
  };
  function Xd() {
    var l = ne.f(), t = Nn();
    return l || t;
  }
  function jd(l) {
    var t = ua(l);
    t !== null && t.tag === 5 && t.type === "form" ? E0(t) : ne.r(l);
  }
  var Ba = typeof document > "u" ? null : document;
  function cr(l, t, e) {
    var a = Ba;
    if (a && typeof t == "string" && t) {
      var u = Tt(t);
      u = 'link[rel="' + l + '"][href="' + u + '"]', typeof e == "string" && (u += '[crossorigin="' + e + '"]'), ir.has(u) || (ir.add(u), l = { rel: l, crossOrigin: e, href: t }, a.querySelector(u) === null && (t = a.createElement("link"), Wl(t, "link", l), Ql(t), a.head.appendChild(t)));
    }
  }
  function wd(l) {
    ne.D(l), cr("dns-prefetch", l, null);
  }
  function Qd(l, t) {
    ne.C(l, t), cr("preconnect", l, t);
  }
  function Zd(l, t, e) {
    ne.L(l, t, e);
    var a = Ba;
    if (a && l && t) {
      var u = 'link[rel="preload"][as="' + Tt(t) + '"]';
      t === "image" && e && e.imageSrcSet ? (u += '[imagesrcset="' + Tt(
        e.imageSrcSet
      ) + '"]', typeof e.imageSizes == "string" && (u += '[imagesizes="' + Tt(
        e.imageSizes
      ) + '"]')) : u += '[href="' + Tt(l) + '"]';
      var n = u;
      switch (t) {
        case "style":
          n = La(l);
          break;
        case "script":
          n = Ga(l);
      }
      _t.has(n) || (l = _(
        {
          rel: "preload",
          href: t === "image" && e && e.imageSrcSet ? void 0 : l,
          as: t
        },
        e
      ), _t.set(n, l), a.querySelector(u) !== null || t === "style" && a.querySelector(Du(n)) || t === "script" && a.querySelector(Uu(n)) || (t = a.createElement("link"), Wl(t, "link", l), Ql(t), a.head.appendChild(t)));
    }
  }
  function Vd(l, t) {
    ne.m(l, t);
    var e = Ba;
    if (e && l) {
      var a = t && typeof t.as == "string" ? t.as : "script", u = 'link[rel="modulepreload"][as="' + Tt(a) + '"][href="' + Tt(l) + '"]', n = u;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = Ga(l);
      }
      if (!_t.has(n) && (l = _({ rel: "modulepreload", href: l }, t), _t.set(n, l), e.querySelector(u) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(Uu(n)))
              return;
        }
        a = e.createElement("link"), Wl(a, "link", l), Ql(a), e.head.appendChild(a);
      }
    }
  }
  function Kd(l, t, e) {
    ne.S(l, t, e);
    var a = Ba;
    if (a && l) {
      var u = na(a).hoistableStyles, n = La(l);
      t = t || "default";
      var i = u.get(n);
      if (!i) {
        var c = { loading: 0, preload: null };
        if (i = a.querySelector(
          Du(n)
        ))
          c.loading = 5;
        else {
          l = _(
            { rel: "stylesheet", href: l, "data-precedence": t },
            e
          ), (e = _t.get(n)) && of(l, e);
          var o = i = a.createElement("link");
          Ql(o), Wl(o, "link", l), o._p = new Promise(function(m, p) {
            o.onload = m, o.onerror = p;
          }), o.addEventListener("load", function() {
            c.loading |= 1;
          }), o.addEventListener("error", function() {
            c.loading |= 2;
          }), c.loading |= 4, wn(i, t, a);
        }
        i = {
          type: "stylesheet",
          instance: i,
          count: 1,
          state: c
        }, u.set(n, i);
      }
    }
  }
  function Jd(l, t) {
    ne.X(l, t);
    var e = Ba;
    if (e && l) {
      var a = na(e).hoistableScripts, u = Ga(l), n = a.get(u);
      n || (n = e.querySelector(Uu(u)), n || (l = _({ src: l, async: !0 }, t), (t = _t.get(u)) && sf(l, t), n = e.createElement("script"), Ql(n), Wl(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(u, n));
    }
  }
  function kd(l, t) {
    ne.M(l, t);
    var e = Ba;
    if (e && l) {
      var a = na(e).hoistableScripts, u = Ga(l), n = a.get(u);
      n || (n = e.querySelector(Uu(u)), n || (l = _({ src: l, async: !0, type: "module" }, t), (t = _t.get(u)) && sf(l, t), n = e.createElement("script"), Ql(n), Wl(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(u, n));
    }
  }
  function fr(l, t, e, a) {
    var u = (u = $.current) ? jn(u) : null;
    if (!u) throw Error(f(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof e.precedence == "string" && typeof e.href == "string" ? (t = La(e.href), e = na(
          u
        ).hoistableStyles, a = e.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, e.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (e.rel === "stylesheet" && typeof e.href == "string" && typeof e.precedence == "string") {
          l = La(e.href);
          var n = na(
            u
          ).hoistableStyles, i = n.get(l);
          if (i || (u = u.ownerDocument || u, i = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, n.set(l, i), (n = u.querySelector(
            Du(l)
          )) && !n._p && (i.instance = n, i.state.loading = 5), _t.has(l) || (e = {
            rel: "preload",
            as: "style",
            href: e.href,
            crossOrigin: e.crossOrigin,
            integrity: e.integrity,
            media: e.media,
            hrefLang: e.hrefLang,
            referrerPolicy: e.referrerPolicy
          }, _t.set(l, e), n || Wd(
            u,
            l,
            e,
            i.state
          ))), t && a === null)
            throw Error(f(528, ""));
          return i;
        }
        if (t && a !== null)
          throw Error(f(529, ""));
        return null;
      case "script":
        return t = e.async, e = e.src, typeof e == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ga(e), e = na(
          u
        ).hoistableScripts, a = e.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, e.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(f(444, l));
    }
  }
  function La(l) {
    return 'href="' + Tt(l) + '"';
  }
  function Du(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function or(l) {
    return _({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function Wd(l, t, e, a) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = l.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), Wl(t, "link", e), Ql(t), l.head.appendChild(t));
  }
  function Ga(l) {
    return '[src="' + Tt(l) + '"]';
  }
  function Uu(l) {
    return "script[async]" + l;
  }
  function sr(l, t, e) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = l.querySelector(
            'style[data-href~="' + Tt(e.href) + '"]'
          );
          if (a)
            return t.instance = a, Ql(a), a;
          var u = _({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null
          });
          return a = (l.ownerDocument || l).createElement(
            "style"
          ), Ql(a), Wl(a, "style", u), wn(a, e.precedence, l), t.instance = a;
        case "stylesheet":
          u = La(e.href);
          var n = l.querySelector(
            Du(u)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, Ql(n), n;
          a = or(e), (u = _t.get(u)) && of(a, u), n = (l.ownerDocument || l).createElement("link"), Ql(n);
          var i = n;
          return i._p = new Promise(function(c, o) {
            i.onload = c, i.onerror = o;
          }), Wl(n, "link", a), t.state.loading |= 4, wn(n, e.precedence, l), t.instance = n;
        case "script":
          return n = Ga(e.src), (u = l.querySelector(
            Uu(n)
          )) ? (t.instance = u, Ql(u), u) : (a = e, (u = _t.get(n)) && (a = _({}, e), sf(a, u)), l = l.ownerDocument || l, u = l.createElement("script"), Ql(u), Wl(u, "link", a), l.head.appendChild(u), t.instance = u);
        case "void":
          return null;
        default:
          throw Error(f(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, wn(a, e.precedence, l));
    return t.instance;
  }
  function wn(l, t, e) {
    for (var a = e.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), u = a.length ? a[a.length - 1] : null, n = u, i = 0; i < a.length; i++) {
      var c = a[i];
      if (c.dataset.precedence === t) n = c;
      else if (n !== u) break;
    }
    n ? n.parentNode.insertBefore(l, n.nextSibling) : (t = e.nodeType === 9 ? e.head : e, t.insertBefore(l, t.firstChild));
  }
  function of(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function sf(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var Qn = null;
  function rr(l, t, e) {
    if (Qn === null) {
      var a = /* @__PURE__ */ new Map(), u = Qn = /* @__PURE__ */ new Map();
      u.set(e, a);
    } else
      u = Qn, a = u.get(e), a || (a = /* @__PURE__ */ new Map(), u.set(e, a));
    if (a.has(l)) return a;
    for (a.set(l, null), e = e.getElementsByTagName(l), u = 0; u < e.length; u++) {
      var n = e[u];
      if (!(n[Za] || n[Vl] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
        var i = n.getAttribute(t) || "";
        i = l + i;
        var c = a.get(i);
        c ? c.push(n) : a.set(i, [n]);
      }
    }
    return a;
  }
  function hr(l, t, e) {
    l = l.ownerDocument || l, l.head.insertBefore(
      e,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function Fd(l, t, e) {
    if (e === 1 || t.itemProp != null) return !1;
    switch (l) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        return t.rel === "stylesheet" ? (l = t.disabled, typeof t.precedence == "string" && l == null) : !0;
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function dr(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function $d(l, t, e, a) {
    if (e.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (e.state.loading & 4) === 0) {
      if (e.instance === null) {
        var u = La(a.href), n = t.querySelector(
          Du(u)
        );
        if (n) {
          t = n._p, t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++, l = Zn.bind(l), t.then(l, l)), e.state.loading |= 4, e.instance = n, Ql(n);
          return;
        }
        n = t.ownerDocument || t, a = or(a), (u = _t.get(u)) && of(a, u), n = n.createElement("link"), Ql(n);
        var i = n;
        i._p = new Promise(function(c, o) {
          i.onload = c, i.onerror = o;
        }), Wl(n, "link", a), e.instance = n;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(e, t), (t = e.state.preload) && (e.state.loading & 3) === 0 && (l.count++, e = Zn.bind(l), t.addEventListener("load", e), t.addEventListener("error", e));
    }
  }
  var rf = 0;
  function Id(l, t) {
    return l.stylesheets && l.count === 0 && Kn(l, l.stylesheets), 0 < l.count || 0 < l.imgCount ? function(e) {
      var a = setTimeout(function() {
        if (l.stylesheets && Kn(l, l.stylesheets), l.unsuspend) {
          var n = l.unsuspend;
          l.unsuspend = null, n();
        }
      }, 6e4 + t);
      0 < l.imgBytes && rf === 0 && (rf = 62500 * Nd());
      var u = setTimeout(
        function() {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && Kn(l, l.stylesheets), l.unsuspend)) {
            var n = l.unsuspend;
            l.unsuspend = null, n();
          }
        },
        (l.imgBytes > rf ? 50 : 800) + t
      );
      return l.unsuspend = e, function() {
        l.unsuspend = null, clearTimeout(a), clearTimeout(u);
      };
    } : null;
  }
  function Zn() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Kn(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        this.unsuspend = null, l();
      }
    }
  }
  var Vn = null;
  function Kn(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Vn = /* @__PURE__ */ new Map(), t.forEach(Pd, l), Vn = null, Zn.call(l));
  }
  function Pd(l, t) {
    if (!(t.state.loading & 4)) {
      var e = Vn.get(l);
      if (e) var a = e.get(null);
      else {
        e = /* @__PURE__ */ new Map(), Vn.set(l, e);
        for (var u = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), n = 0; n < u.length; n++) {
          var i = u[n];
          (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") && (e.set(i.dataset.precedence, i), a = i);
        }
        a && e.set(null, a);
      }
      u = t.instance, i = u.getAttribute("data-precedence"), n = e.get(i) || a, n === a && e.set(null, u), e.set(i, u), this.count++, a = Zn.bind(this), u.addEventListener("load", a), u.addEventListener("error", a), n ? n.parentNode.insertBefore(u, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(u, l.firstChild)), t.state.loading |= 4;
    }
  }
  var _u = {
    $$typeof: El,
    Provider: null,
    Consumer: null,
    _currentValue: q,
    _currentValue2: q,
    _threadCount: 0
  };
  function lm(l, t, e, a, u, n, i, c, o) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = ni(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ni(0), this.hiddenUpdates = ni(null), this.identifierPrefix = a, this.onUncaughtError = u, this.onCaughtError = n, this.onRecoverableError = i, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = o, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function mr(l, t, e, a, u, n, i, c, o, m, p, E) {
    return l = new lm(
      l,
      t,
      e,
      i,
      o,
      m,
      p,
      E,
      c
    ), t = 1, n === !0 && (t |= 24), n = ht(3, null, null, t), l.current = n, n.stateNode = l, t = Qi(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: a,
      isDehydrated: e,
      cache: t
    }, Ji(n), l;
  }
  function gr(l) {
    return l ? (l = ga, l) : ga;
  }
  function vr(l, t, e, a, u, n) {
    u = gr(u), a.context === null ? a.context = u : a.pendingContext = u, a = ye(t), a.payload = { element: e }, n = n === void 0 ? null : n, n !== null && (a.callback = n), e = Se(l, a, t), e !== null && (ft(e, l, t), cu(e, l, t));
  }
  function yr(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var e = l.retryLane;
      l.retryLane = e !== 0 && e < t ? e : t;
    }
  }
  function hf(l, t) {
    yr(l, t), (l = l.alternate) && yr(l, t);
  }
  function Sr(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = je(l, 67108864);
      t !== null && ft(t, l, 67108864), hf(l, 67108864);
    }
  }
  function pr(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = yt();
      t = ii(t);
      var e = je(l, t);
      e !== null && ft(e, l, t), hf(l, t);
    }
  }
  var Jn = !0;
  function tm(l, t, e, a) {
    var u = S.T;
    S.T = null;
    var n = U.p;
    try {
      U.p = 2, df(l, t, e, a);
    } finally {
      U.p = n, S.T = u;
    }
  }
  function em(l, t, e, a) {
    var u = S.T;
    S.T = null;
    var n = U.p;
    try {
      U.p = 8, df(l, t, e, a);
    } finally {
      U.p = n, S.T = u;
    }
  }
  function df(l, t, e, a) {
    if (Jn) {
      var u = mf(a);
      if (u === null)
        Ic(
          l,
          t,
          a,
          kn,
          e
        ), Tr(l, a);
      else if (um(
        u,
        l,
        t,
        e,
        a
      ))
        a.stopPropagation();
      else if (Tr(l, a), t & 4 && -1 < am.indexOf(l)) {
        for (; u !== null; ) {
          var n = ua(u);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var i = Be(n.pendingLanes);
                  if (i !== 0) {
                    var c = n;
                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; i; ) {
                      var o = 1 << 31 - st(i);
                      c.entanglements[1] |= o, i &= ~o;
                    }
                    Xt(n), (rl & 6) === 0 && (Rn = Il() + 500, Eu(0));
                  }
                }
                break;
              case 31:
              case 13:
                c = je(n, 2), c !== null && ft(c, n, 2), Nn(), hf(n, 2);
            }
          if (n = mf(a), n === null && Ic(
            l,
            t,
            a,
            kn,
            e
          ), n === u) break;
          u = n;
        }
        u !== null && a.stopPropagation();
      } else
        Ic(
          l,
          t,
          a,
          null,
          e
        );
    }
  }
  function mf(l) {
    return l = gi(l), gf(l);
  }
  var kn = null;
  function gf(l) {
    if (kn = null, l = aa(l), l !== null) {
      var t = Q(l);
      if (t === null) l = null;
      else {
        var e = t.tag;
        if (e === 13) {
          if (l = J(t), l !== null) return l;
          l = null;
        } else if (e === 31) {
          if (l = Z(t), l !== null) return l;
          l = null;
        } else if (e === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return kn = l, null;
  }
  function br(l) {
    switch (l) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (ai()) {
          case Bu:
            return 2;
          case Xa:
            return 8;
          case ta:
          case ui:
            return 32;
          case _f:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var vf = !1, _e = null, Re = null, Oe = null, Ru = /* @__PURE__ */ new Map(), Ou = /* @__PURE__ */ new Map(), Ne = [], am = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Tr(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        _e = null;
        break;
      case "dragenter":
      case "dragleave":
        Re = null;
        break;
      case "mouseover":
      case "mouseout":
        Oe = null;
        break;
      case "pointerover":
      case "pointerout":
        Ru.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Ou.delete(t.pointerId);
    }
  }
  function Nu(l, t, e, a, u, n) {
    return l === null || l.nativeEvent !== n ? (l = {
      blockedOn: t,
      domEventName: e,
      eventSystemFlags: a,
      nativeEvent: n,
      targetContainers: [u]
    }, t !== null && (t = ua(t), t !== null && Sr(t)), l) : (l.eventSystemFlags |= a, t = l.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), l);
  }
  function um(l, t, e, a, u) {
    switch (t) {
      case "focusin":
        return _e = Nu(
          _e,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "dragenter":
        return Re = Nu(
          Re,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "mouseover":
        return Oe = Nu(
          Oe,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "pointerover":
        var n = u.pointerId;
        return Ru.set(
          n,
          Nu(
            Ru.get(n) || null,
            l,
            t,
            e,
            a,
            u
          )
        ), !0;
      case "gotpointercapture":
        return n = u.pointerId, Ou.set(
          n,
          Nu(
            Ou.get(n) || null,
            l,
            t,
            e,
            a,
            u
          )
        ), !0;
    }
    return !1;
  }
  function zr(l) {
    var t = aa(l.target);
    if (t !== null) {
      var e = Q(t);
      if (e !== null) {
        if (t = e.tag, t === 13) {
          if (t = J(e), t !== null) {
            l.blockedOn = t, qf(l.priority, function() {
              pr(e);
            });
            return;
          }
        } else if (t === 31) {
          if (t = Z(e), t !== null) {
            l.blockedOn = t, qf(l.priority, function() {
              pr(e);
            });
            return;
          }
        } else if (t === 3 && e.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function Wn(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var e = mf(l.nativeEvent);
      if (e === null) {
        e = l.nativeEvent;
        var a = new e.constructor(
          e.type,
          e
        );
        mi = a, e.target.dispatchEvent(a), mi = null;
      } else
        return t = ua(e), t !== null && Sr(t), l.blockedOn = e, !1;
      t.shift();
    }
    return !0;
  }
  function Er(l, t, e) {
    Wn(l) && e.delete(t);
  }
  function nm() {
    vf = !1, _e !== null && Wn(_e) && (_e = null), Re !== null && Wn(Re) && (Re = null), Oe !== null && Wn(Oe) && (Oe = null), Ru.forEach(Er), Ou.forEach(Er);
  }
  function Fn(l, t) {
    l.blockedOn === t && (l.blockedOn = null, vf || (vf = !0, g.unstable_scheduleCallback(
      g.unstable_NormalPriority,
      nm
    )));
  }
  var $n = null;
  function Ar(l) {
    $n !== l && ($n = l, g.unstable_scheduleCallback(
      g.unstable_NormalPriority,
      function() {
        $n === l && ($n = null);
        for (var t = 0; t < l.length; t += 3) {
          var e = l[t], a = l[t + 1], u = l[t + 2];
          if (typeof a != "function") {
            if (gf(a || e) === null)
              continue;
            break;
          }
          var n = ua(e);
          n !== null && (l.splice(t, 3), t -= 3, dc(
            n,
            {
              pending: !0,
              data: u,
              method: e.method,
              action: a
            },
            a,
            u
          ));
        }
      }
    ));
  }
  function Ya(l) {
    function t(o) {
      return Fn(o, l);
    }
    _e !== null && Fn(_e, l), Re !== null && Fn(Re, l), Oe !== null && Fn(Oe, l), Ru.forEach(t), Ou.forEach(t);
    for (var e = 0; e < Ne.length; e++) {
      var a = Ne[e];
      a.blockedOn === l && (a.blockedOn = null);
    }
    for (; 0 < Ne.length && (e = Ne[0], e.blockedOn === null); )
      zr(e), e.blockedOn === null && Ne.shift();
    if (e = (l.ownerDocument || l).$$reactFormReplay, e != null)
      for (a = 0; a < e.length; a += 3) {
        var u = e[a], n = e[a + 1], i = u[et] || null;
        if (typeof n == "function")
          i || Ar(e);
        else if (i) {
          var c = null;
          if (n && n.hasAttribute("formAction")) {
            if (u = n, i = n[et] || null)
              c = i.formAction;
            else if (gf(u) !== null) continue;
          } else c = i.action;
          typeof c == "function" ? e[a + 1] = c : (e.splice(a, 3), a -= 3), Ar(e);
        }
      }
  }
  function xr() {
    function l(n) {
      n.canIntercept && n.info === "react-transition" && n.intercept({
        handler: function() {
          return new Promise(function(i) {
            return u = i;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      u !== null && (u(), u = null), a || setTimeout(e, 20);
    }
    function e() {
      if (!a && !navigation.transition) {
        var n = navigation.currentEntry;
        n && n.url != null && navigation.navigate(n.url, {
          state: n.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, u = null;
      return navigation.addEventListener("navigate", l), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(e, 100), function() {
        a = !0, navigation.removeEventListener("navigate", l), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), u !== null && (u(), u = null);
      };
    }
  }
  function yf(l) {
    this._internalRoot = l;
  }
  In.prototype.render = yf.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(f(409));
    var e = t.current, a = yt();
    vr(e, a, l, t, null, null);
  }, In.prototype.unmount = yf.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      vr(l.current, 2, null, l, null, null), Nn(), t[ea] = null;
    }
  };
  function In(l) {
    this._internalRoot = l;
  }
  In.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = Hf();
      l = { blockedOn: null, target: l, priority: t };
      for (var e = 0; e < Ne.length && t !== 0 && t < Ne[e].priority; e++) ;
      Ne.splice(e, 0, l), e === 0 && zr(l);
    }
  };
  var Mr = A.version;
  if (Mr !== "19.2.0")
    throw Error(
      f(
        527,
        Mr,
        "19.2.0"
      )
    );
  U.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(f(188)) : (l = Object.keys(l).join(","), Error(f(268, l)));
    return l = T(t), l = l !== null ? M(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var im = {
    bundleType: 0,
    version: "19.2.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: S,
    reconcilerVersion: "19.2.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Pn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Pn.isDisabled && Pn.supportsFiber)
      try {
        ja = Pn.inject(
          im
        ), ot = Pn;
      } catch {
      }
  }
  return Hu.createRoot = function(l, t) {
    if (!N(l)) throw Error(f(299));
    var e = !1, a = "", u = C0, n = H0, i = q0;
    return t != null && (t.unstable_strictMode === !0 && (e = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (u = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (i = t.onRecoverableError)), t = mr(
      l,
      1,
      !1,
      null,
      null,
      e,
      a,
      null,
      u,
      n,
      i,
      xr
    ), l[ea] = t.current, $c(l), new yf(t);
  }, Hu.hydrateRoot = function(l, t, e) {
    if (!N(l)) throw Error(f(299));
    var a = !1, u = "", n = C0, i = H0, c = q0, o = null;
    return e != null && (e.unstable_strictMode === !0 && (a = !0), e.identifierPrefix !== void 0 && (u = e.identifierPrefix), e.onUncaughtError !== void 0 && (n = e.onUncaughtError), e.onCaughtError !== void 0 && (i = e.onCaughtError), e.onRecoverableError !== void 0 && (c = e.onRecoverableError), e.formState !== void 0 && (o = e.formState)), t = mr(
      l,
      1,
      !0,
      t,
      e ?? null,
      a,
      u,
      o,
      n,
      i,
      c,
      xr
    ), t.context = gr(null), e = t.current, a = yt(), a = ii(a), u = ye(a), u.callback = null, Se(e, u, a), e = a, t.current.lanes = e, Qa(t, e), Xt(t), l[ea] = t.current, $c(l), new In(t);
  }, Hu.version = "19.2.0", Hu;
}
var Br;
function vm() {
  if (Br) return bf.exports;
  Br = 1;
  function g() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(g);
      } catch (A) {
        console.error(A);
      }
  }
  return g(), bf.exports = gm(), bf.exports;
}
var ym = vm();
const Sm = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`, pm = `#version 300 es
precision highp float;
uniform sampler2D uLogo;
uniform sampler2D uText;
uniform vec2 uResolution;
uniform float uDpr;
uniform float uUnit;
uniform vec2 uLogoBox;
uniform vec2 uTextBox;
uniform float uTextWidth;
uniform float uTime;
uniform float uSettle;
uniform float uArtScale;
uniform float uWordmarkEnabled;
uniform vec3 uTile;
uniform float uTileEnabled;
// 0 on a dark page, 1 on a pale one.
uniform float uPageLight;
uniform float uDepth;
uniform float uDispersion;
uniform float uRelief;
uniform float uCaustics;
uniform float uHighlights;
// How much the faint line outside the rim takes the plate color.
uniform float uEchoTint;
// 0 draws the full inner wall; 1 keeps it to the upper-left and lower-right arcs.
uniform float uInnerWallFocus;
uniform float uDropSize;
uniform float uDropStrength;
uniform float uDecay;
// Second drop: radius, core radius, rim stretch, center factor (negative inverts).
uniform vec4 uDrop;
// Second drop: core edge magnification, profile exponent, ripple amplitude, wavelength.
uniform vec4 uDropLens;
// Second drop: ripple phase, share of ripples inside the core, dispersion, unused.
uniform vec4 uDropWave;
out vec4 outColor;
const float PI = 3.14159265359;
const int BANDS = 32;

float sq(float x) { return x * x; }
float bell(float x, float width) { return exp(-sq(x / max(width, 0.001))); }
float ease(float a, float b, float x) { return smoothstep(a, b, x); }

// Smooth overlapping spectral sensitivities, normalized in the integration below.
vec3 spectrum(float s) {
  float wavelength = 400.0 + 300.0 * s;
  vec3 rgb = vec3(0.0);
  if (wavelength < 440.0) rgb = vec3((440.0 - wavelength) / 120.0, 0.0, 1.0);
  else if (wavelength < 490.0) rgb = vec3(0.0, (wavelength - 440.0) / 50.0, 1.0);
  else if (wavelength < 510.0) rgb = vec3(0.0, 1.0, (510.0 - wavelength) / 20.0);
  else if (wavelength < 580.0) rgb = vec3((wavelength - 510.0) / 70.0, 1.0, 0.0);
  else if (wavelength < 645.0) rgb = vec3(1.0, (645.0 - wavelength) / 65.0, 0.0);
  else rgb = vec3(1.0, 0.0, 0.0);
  return rgb * mix(0.2, 1.0, ease(400.0, 430.0, wavelength)) * mix(1.0, 0.65, ease(650.0, 700.0, wavelength));
}
float glassIor(float s, float spread) {
  float wavelength = 0.4 + 0.3 * s;
  return 1.38 + (0.04 / (wavelength * wavelength) - 0.12) * spread;
}

vec4 imageAt(sampler2D image, vec2 p, vec2 box) {
  vec2 uv = 0.5 + p / box;
  // Transparent outside the image, including images that touch their texture edges.
  // Explicit LOD is stable inside the back-face branch; implicit derivatives are
  // undefined there and can make the same sought frame change after another draw.
  vec2 footprint = vec2(textureSize(image, 0)) / max(box * uDpr, vec2(1.0));
  float lod = max(0.0, log2(max(footprint.x, footprint.y)));
  // The first sphere comes into focus as it flattens into a plate.
  lod += (1.0 - ease(0.20, 0.36, uTime)) * 2.2;
  vec4 ink = textureLod(image, uv, lod);
  return ink * step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0);
}

float superRadius(vec2 p, float n) {
  vec2 a = max(abs(p), vec2(0.00001));
  return pow(pow(a.x, n) + pow(a.y, n), 1.0 / n);
}
vec2 superNormal(vec2 p, float n) {
  return normalize(sign(p) * pow(max(abs(p), vec2(0.00001)), vec2(n - 1.0)) + vec2(0.000001));
}

float hash1(float n) { return fract(sin(n * 127.1 + 311.7) * 43758.5453); }

// Real glass is not a perfect stroke. Along an edge (u = arc length in pixels) its
// light varies slowly and breaks into short glints where the surface is uneven.
float contourNoise(float u) {
  float i = floor(u);
  float f = fract(u);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash1(i), hash1(i + 1.0), f);
}
float specks(float u, float d, float size, float seed) {
  float spacing = size * 22.0;
  float cell = floor(u / spacing);
  float on = step(0.7, hash1(cell + seed));
  float center = (cell + 0.2 + 0.6 * hash1(cell + seed + 17.0)) * spacing;
  float offset = (hash1(cell + seed + 31.0) - 0.5) * size * 0.6;
  // Glints are dashes along the edge, several times longer than they are wide.
  float dash = size * (2.5 + 4.0 * hash1(cell + seed + 53.0));
  return on * bell(u - center, dash) * bell(d - offset, size * 0.35);
}
// The same glints as particles held by the liquid: each one bobs across the edge
// on its own period and barely sways along it, so nothing slides sideways.
// Neighboring cells are included so a moving glint is not clipped at its cell.
float driftingSpecks(float u, float d, float size, float seed, float t) {
  float spacing = size * 22.0;
  float cell = floor(u / spacing);
  float glints = 0.0;
  for (int j = -1; j <= 1; j++) {
    float id = cell + float(j);
    float on = step(0.7, hash1(id + seed));
    float rate = 2.5 + 3.0 * hash1(id + seed + 71.0);
    float phase = 6.2832 * hash1(id + seed + 89.0);
    float center = (id + 0.2 + 0.6 * hash1(id + seed + 17.0)) * spacing + sin(t * rate * 0.5 + phase) * spacing * 0.05;
    float offset = (hash1(id + seed + 31.0) - 0.5) * size * 0.6 + sin(t * rate + phase) * size * 1.6;
    float dash = size * (2.5 + 4.0 * hash1(id + seed + 53.0));
    glints += on * bell(u - center, dash) * bell(d - offset, size * 0.35);
  }
  return min(glints, 1.0);
}

// Material-space relief: neighboring glass walls share the slow undulation but
// have different fine thickness variations. It stays attached as the lens grows.
float edgeWarp(float arc, float seed) {
  float broad = contourNoise(arc / (uUnit * 0.037) + seed) - 0.5;
  float fine = contourNoise(arc / (uUnit * 0.008) + seed + 29.0) - 0.5;
  return uUnit * (broad * 0.0017 + fine * 0.0008);
}

// Small flattened air pockets in the glass channel. x is the dark cavity;
// y is its light-catching lip. Three cells avoid popping at cell boundaries.
vec2 glassPores(float arc, float d, float seed) {
  if (abs(d) > uUnit * 0.011) return vec2(0.0);
  float pitch = uUnit * 0.022;
  float cell = floor(arc / pitch);
  vec2 pores = vec2(0.0);
  for (int j = -1; j <= 1; j++) {
    float id = cell + float(j) + seed;
    float visible = step(0.63, hash1(id));
    float center = (cell + float(j) + 0.15 + 0.7 * hash1(id + 17.0)) * pitch;
    float across = (hash1(id + 31.0) - 0.5) * uUnit * 0.009;
    float span = uUnit * (0.0022 + 0.0035 * hash1(id + 53.0));
    float height = max(0.35 / uDpr, uUnit * (0.0007 + 0.0012 * hash1(id + 71.0)));
    vec2 q = vec2((arc - center) / span, (d - across) / height);
    // A slight skew keeps the cavities from forming identical ellipses.
    q.x += q.y * (hash1(id + 89.0) - 0.5) * 0.55;
    float radius = length(q);
    float aa = max(0.18, 0.4 / (uDpr * height));
    float cavity = bell(radius, 0.65);
    float lip = bell(radius - 1.0, aa);
    float glint = 0.25 + 0.75 * max(dot(q / max(radius, 0.001), normalize(vec2(-0.4, 0.8))), 0.0);
    pores += vec2(cavity, lip * glint) * visible;
  }
  return min(pores, vec2(1.0));
}

// Light reflected off the ripples outside the glass is invisible on a pale page.
// There the same ripples bend the page away and read as cool shadows, as in the
// light reference. Coverage is unchanged, so a dark page renders as before.
vec3 exteriorColor(vec3 light, float coverage) {
  // The shadow leans toward the plate's own tone, a little deeper, so it belongs
  // to the glass instead of reading as a gray smudge on the page.
  vec3 shade = mix(vec3(0.40, 0.46, 0.56), uTile * 0.86, uEchoTint);
  return mix(light, shade * coverage, uPageLight);
}

// Per-channel coverage of the last refracted image. Each wavelength band lands
// on the artwork at its own offset, so a dark logo over a light plate blocks red,
// green and blue at slightly different places and its edges split into color.
vec3 refractedCoverage;

// A refracted image behind a glass lens, with a little light focused onto its ink.
vec4 refractedLogo(vec2 p, vec2 normalXY, float lensScale, float glass, float chromaticScale, float surfaceDistance) {
  vec3 normal = normalize(vec3(normalXY, 1.0));
  vec3 color = vec3(0.0);
  vec3 weights = vec3(0.0);
  float alpha = 0.0;
  float minCoverage = 1.0;
  float maxCoverage = 0.0;
  refractedCoverage = vec3(0.0);
  float spread = uDispersion * chromaticScale * mix(0.85, mix(2.2, 1.5, ease(0.28, 0.9, uTime)), ease(0.25, 0.33, uTime));
  vec3 neutralRay = refract(vec3(0.0, 0.0, -1.0), normal, 1.0 / glassIor(0.5, spread));
  vec2 neutralOffset = neutralRay.xy / max(-neutralRay.z, 0.25) * uUnit * uDepth * 0.80 * lensScale;
  for (int i = 0; i < BANDS; i++) {
    float s = float(i) / float(BANDS - 1);
    // Shorter wavelengths bend more. Dispersion is intentionally visible at the bevel.
    // The young sphere splits light only at its rim; the settled bevel splits it strongly.
    float ior = glassIor(s, spread);
    vec3 ray = refract(vec3(0.0, 0.0, -1.0), normal, 1.0 / ior);
    vec2 offset = ray.xy / max(-ray.z, 0.25) * uUnit * uDepth * 0.80 * lensScale;
    // Measured artwork scale over time; see artworkScale in the renderer.
    float artworkScale = uArtScale;
    float magnification = 1.0;
    // The opening focus folds the edge of the image into a partial crescent.
    // It opens into barrel distortion before the sphere flattens into the plate.
    float sphereRadius = uUnit * lensScale * 0.5;
    float sphereFocus = 1.0 - ease(0.225, 0.335, uTime);
    float bubbleQ = min(length(p) / max(sphereRadius, 1.0), 1.0);
    float openingFocus = 1.0 - ease(0.19, 0.265, uTime);
    float focusProfile = mix(0.7 + 0.6 * sq(bubbleQ), 1.0 - 0.9 * sq(bubbleQ), openingFocus);
    vec2 bubbleSample = p * focusProfile + offset * mix(0.35, 0.12, openingFocus);
    bubbleSample += vec2(0.025, 0.10) * uUnit * openingFocus;
    bubbleSample += (offset - neutralOffset) * openingFocus * 1.6;
    vec2 sourcePoint = mix(p + offset, bubbleSample, sphereFocus);
    vec4 ink = imageAt(uLogo, sourcePoint, uLogoBox * artworkScale * magnification);
    // Focus is inside the young dome, leaving clear glass between the enlarged
    // fragment and the rim. The aperture opens as the rest of the logo appears.
    ink *= mix(1.0, 1.0 - ease(0.72, 0.86, bubbleQ), openingFocus);
    // The rim is an optical aperture too. Giving each wavelength its own boundary
    // creates a red/yellow outer edge and cyan/blue inner edge without tinting the ink.
    float edgeShift = (s - 0.5) * uUnit * lensScale * 0.018 * uDispersion * chromaticScale;
    ink *= 1.0 - smoothstep(-0.8 / uDpr, 0.8 / uDpr, surfaceDistance - edgeShift);
    minCoverage = min(minCoverage, ink.a);
    maxCoverage = max(maxCoverage, ink.a);
    vec3 w = spectrum(s);
    color += ink.rgb * w;
    alpha += ink.a * (w.r + w.g + w.b);
    refractedCoverage += ink.a * w;
    weights += w;
  }
  color /= weights;
  refractedCoverage /= weights;
  // A coated glass shoulder has a cooler spectral response at a split image edge.
  // Coverage variance keeps solid areas and original-color artwork free of a tint.
  float coating = ease(-uUnit * lensScale * 0.022, 0.0, surfaceDistance);
  color.g *= 1.0 - 0.65 * coating * (maxCoverage - minCoverage);
  // The young curved face catches a violet interference fringe at internal ink
  // edges. Its outer lip stays cyan; opaque artwork keeps its original color.
  float youngFilm = (maxCoverage - minCoverage) * (1.0 - ease(0.19, 0.30, uTime));
  youngFilm *= 1.0 - ease(-uUnit * lensScale * 0.08, -uUnit * lensScale * 0.025, surfaceDistance);
  color.r += color.b * youngFilm * 0.80;
  color.b += color.r * youngFilm * 0.60;
  color.g *= 1.0 - youngFilm * 0.55;
  alpha /= weights.r + weights.g + weights.b;
  // This lift belongs to the image's edges, not a painted rainbow on the lens.
  float diffuse = max(dot(normal, normalize(vec3(-0.4, 0.6, 1.0))), 0.0);
  vec3 earlyWhite = mix(vec3(0.90, 0.93, 0.95), vec3(0.84, 0.86, 0.89), ease(0.21, 0.40, uTime));
  vec3 whiteBalance = mix(earlyWhite, vec3(0.87, 0.88, 0.885), ease(0.75, 1.22, uTime));
  color *= whiteBalance * ((0.90 + 0.10 * diffuse + glass * uCaustics * 0.04) * ((0.975 + 0.025 * sin(p.y / uUnit * PI)) * (1.0 + 0.09 * ease(0.75, 1.22, uTime) + 0.03 * (1.0 - ease(0.2, 0.5, uTime)))));
  return vec4(color, alpha);
}

vec4 iconLens(vec2 p) {
  float t = uTime;
  float settle = ease(0.0, 1.0, uSettle);
  float enter = ease(0.025, 0.16, t);
  vec4 source = imageAt(uLogo, p, uLogoBox * uArtScale);
  if (t > 1.58) return source * settle;
  if (enter < 0.001) return vec4(0.0);
  float shape = 2.0 + 3.0 * ease(0.29, 0.36, t);
  // The sphere appears quickly, then the glass continues expanding after the
  // corners have squared off. Completing both motions at once feels abrupt.
  float expand = enter * (0.64 + 0.41 * (1.0 - exp(-max(t - 0.16, 0.0) * 5.8)));
  float collapse = 1.0 - ease(1.33, 1.52, t);
  float lensScale = max(0.001, mix(expand * mix(0.48, 1.0, collapse), 1.0, settle));
  float halfSize = uUnit * 0.5 * lensScale;
  float radius = superRadius(p / halfSize, shape);
  float sd = (radius - 1.0) * halfSize;
  float aa = max(fwidth(sd), 0.65);
  float mask = (1.0 - smoothstep(-aa, aa, sd));
  float glass = (1.0 - ease(1.05, 1.4, t)) * collapse * (1.0 - settle);
  float shown = ease(0.12, 0.165, t) * (1.0 - ease(1.39, 1.53, t));
  // Nothing is drawn beyond the thin echo just outside the rim.
  if (sd > uUnit * 0.10) return vec4(0.0);
  vec2 outward = superNormal(p / halfSize, shape);
  // A flat center rolls into a thick, curved shoulder. The normal continuously bends
  // source rays into the plate and folds them at its rim, whatever the source image.
  vec2 radial = normalize(p + vec2(0.001));
  float diagonal = max(0.0, 2.0 * radial.x * radial.y);
  float shoulderStart = 0.6 + 0.18 * ease(0.66, 1.15, t) * (1.0 - diagonal) + 0.16 * ease(1.0, 1.22, t) * diagonal;
  float shoulder = ease(shoulderStart, 1.0, radius);
  float slope = (0.04 * radius + (0.85 + 0.2 * (1.0 - ease(0.28, 0.75, t))) * shoulder * shoulder) * glass * uDropStrength;
  // The early sphere is rounder and more strongly magnifying than the settled tile.
  slope += (1.0 - ease(0.18, 0.42, t)) * radius * 0.32 * uDropStrength;
  vec2 opticalDirection = normalize(mix(outward, normalize(p + vec2(0.001)), 0.95));
  // A mild astigmatic shoulder carries the image into opposite corners.
  float astigmatism = 0.8 + 0.4 * radial.x * radial.y;
  vec2 n = opticalDirection * slope * astigmatism * (1.0 - settle);
  vec4 ink = refractedLogo(p, n, lensScale, glass, 1.0, sd);
  float illumination = 0.5 + 0.5 * dot(outward, normalize(vec2(-0.5, 0.9)));
  vec3 inkCoverage = refractedCoverage;
  // A dark plate deepens toward its rim; a pale frosted plate stays nearly even.
  float plateLight = ease(0.3, 0.8, dot(uTile, vec3(0.299, 0.587, 0.114)));
  vec3 body = uTile * (mix(0.55, 0.96, plateLight) + mix(0.45, 0.04, plateLight) * (1.0 - min(radius, 1.0)));
  body += vec3(0.004, 0.007, 0.01) * bell(radius - 0.75, 0.5);
  vec3 color = ink.rgb + body * (1.0 - inkCoverage) * glass * uTileEnabled;
  // On a pale page the plate's coverage follows the glass exactly, so its color
  // keeps the same hue while it melts into the page instead of dipping and
  // flaring. A dark page keeps its original fade.
  float plateFade = mix((1.0 - ease(1.08, 1.36, t)) * (1.0 - settle), glass, uPageLight);
  float alpha = max(ink.a, plateFade * uTileEnabled);
  // A broad studio light is reflected by the curved front face of the sphere.
  // It fades as the face flattens, revealing the dark glass beneath the artwork.
  vec2 spherePoint = p / halfSize;
  vec3 sphereNormal = normalize(vec3(spherePoint, sqrt(max(0.001, 1.0 - dot(spherePoint, spherePoint)))));
  vec3 sphereRay = reflect(vec3(0.0, 0.0, -1.0), sphereNormal);
  float lightTravel = mix(-0.12, 0.20, ease(0.13, 0.30, t));
  float softbox = bell(sphereRay.x - lightTravel, 1.05) * bell(sphereRay.y - 0.56, 0.52);
  float sphericalLight = softbox * (1.0 - ease(0.245, 0.36, t)) * glass * uHighlights * 0.70;
  color += vec3(0.50, 0.61, 0.72) * sphericalLight * (1.0 - ink.a * 0.85);
  alpha = max(alpha, sphericalLight);

  // Thin nested surface reflections, with asymmetric key light and a dim cool fill.
  // Material coordinates stay fixed during expansion and deterministic seeking.
  float arc = atan(p.y, p.x) * uUnit * 0.5;
  float grainScale = uUnit * 0.03;
  float developed = ease(0.23, 0.48, t);
  float cornerExposure = ease(0.12, 0.8, -2.0 * radial.x * radial.y);
  float reliefScale = lensScale * developed * (0.2 + 0.8 * cornerExposure);
  float sharedWarp = edgeWarp(arc, 0.0) * reliefScale;
  float rimSd = sd + sharedWarp;
  float innerSd = sd + sharedWarp * 0.7 + edgeWarp(arc, 41.0) * reliefScale * 0.4;
  float inner2Sd = sd + sharedWarp * 0.45 + edgeWarp(arc, 83.0) * reliefScale * 0.6;
  float thickness = 0.75 + 0.5 * contourNoise(arc / (uUnit * 0.013) + 13.0);
  // The bright rim line is a liquid edge, not an etched one. Its segments shimmer
  // in place and it bobs slightly across the edge as standing waves, so nothing
  // slides along it; its glints move as separate particles.
  float around = arc / (uUnit * 0.5);
  float rimBob = uUnit * 0.0025 * developed * (0.6 * sin(7.0 * around + 0.4) * sin(t * 6.3 + 1.0) + 0.4 * sin(3.0 * around + 2.0) * sin(t * 4.1));
  float rimLineSd = rimSd + rimBob;
  float shimmer = mix(contourNoise(arc / grainScale), contourNoise(arc / grainScale + 211.0), 0.5 + 0.5 * sin(t * 5.0 + 6.2832 * contourNoise(arc / (grainScale * 3.0) + 7.0)));
  float rim = bell(rimLineSd + uUnit * 0.002, uUnit * 0.0018 * thickness + aa * 0.3) * (0.6 + 0.8 * shimmer);
  // The nested lines nearer the center clear first; the outer rim lingers.
  float centerFade = 1.0 - ease(0.62, 0.92, t);
  float inner = centerFade * bell(innerSd + uUnit * 0.012, uUnit * 0.0025 / thickness + aa * 0.2) * (0.55 + 0.9 * contourNoise(arc / grainScale + 41.0));
  float inner2 = centerFade * bell(inner2Sd + uUnit * 0.022, uUnit * 0.0018 * thickness + aa * 0.1) * (0.5 + contourNoise(arc / grainScale + 83.0));
  float key = pow(illumination, 5.0);
  float rimVisibility = 1.0 - 0.55 * ease(0.75, 1.22, t);
  float lowerRight = pow(0.5 + 0.5 * dot(outward, normalize(vec2(0.8, -0.6))), 5.0);
  lowerRight *= ease(-0.25, -0.05, p.x / uUnit) * (1.0 - ease(-0.22, -0.02, p.y / uUnit));
  // Two separated walls, not two strokes at the same edge. The back wall is
  // inset by 7% of a tile edge, leaving a curved transmission channel between them.
  vec2 insetPoint = p - vec2(0.002, -0.002) * uUnit * lensScale;
  float wallGap = (0.055 - 0.023 * ease(0.18, 0.34, t)) + 0.050 * ease(0.14, 0.50, t) * (1.0 - 0.5 * ease(0.80, 1.22, t));
  float insetHalf = halfSize - wallGap * uUnit * lensScale;
  // The back face rounds off slightly later, giving the sphere and tile two visible
  // moving boundaries rather than scaling a second outline with the front face.
  float insetShape = max(2.0, 2.0 + (shape - 2.0) * ease(0.20, 0.55, t) - 0.45);
  float insetRadius = superRadius(insetPoint / insetHalf, insetShape);
  float insetSd = (insetRadius - 1.0) * insetHalf + sharedWarp * 0.4 + edgeWarp(arc, 151.0) * reliefScale * 0.7;
  float channel = ease(-uUnit * 0.008, uUnit * 0.025, insetSd) * mask;
  float echoMask = channel * lowerRight * glass * (1.0 - settle);
  vec3 backFace = vec3(0.0);
  float logoLight = 0.0;
  if (echoMask * uRelief > 0.002) {
    vec2 backNormal = normalize(mix(superNormal(insetPoint / insetHalf, insetShape), radial, 0.6));
    float backSlope = ease(0.90, 1.10, insetRadius) * 1.55 * glass * uDropStrength;
    // Sample a separate transmitted image across the whole bevel channel. Its
    // changing normal pulls a second, chromatically split copy of the logo into it.
    // A thick rim magnifies whatever lies closest behind it. Walk inward from the
    // wall until the ray meets ink and refract from there, so every logo lights
    // this corner from its own nearest shape; a logo with ink at the corner (like
    // X) is found on the first step and keeps its direct image.
    // The search starts where the wall already sends the ray, not at the wall.
    vec2 inward = -normalize(insetPoint + vec2(0.001));
    vec3 backRay = refract(vec3(0.0, 0.0, -1.0), normalize(vec3(backNormal * backSlope, 1.0)), 1.0 / 1.38);
    vec2 landing = insetPoint + backRay.xy / max(-backRay.z, 0.25) * uUnit * uDepth * 0.80 * lensScale;
    float reach = 0.0;
    for (int i = 0; i < 20; i++) {
      reach = float(i) * uUnit * lensScale * 0.03;
      if (imageAt(uLogo, landing + inward * reach, uLogoBox * uArtScale).a > 0.2) break;
    }
    vec4 backImage = refractedLogo(insetPoint + inward * reach, backNormal * backSlope, lensScale, glass, 1.6, sd);
    backFace = backImage.rgb * vec3(0.03, 0.65, 1.0) * echoMask * 0.48 * uRelief * (1.0 - 0.70 * ease(0.75, 1.12, t));
    // The lower-right light is this same refracted image, not a fixed lamp: it
    // only lights where the back wall bends logo ink into the bevel, and takes
    // that ink's shape as the logo or the refraction changes.
    logoLight = ease(0.05, 0.6, backImage.a);
  }
  lowerRight *= logoLight;
  float wallRim = centerFade * bell(insetSd, uUnit * 0.0028 + aa * 0.25);
  float wallShadow = centerFade * bell(insetSd + uUnit * 0.008, uUnit * 0.005);
  vec2 pores = vec2(0.0);
  if (developed * cornerExposure > 0.001) {
    pores = glassPores(arc, (rimSd + uUnit * 0.003) / lensScale, 313.0);
    pores += glassPores(arc, insetSd / lensScale, 617.0) * 0.6 * centerFade;
    pores += glassPores(arc, (inner2Sd + uUnit * 0.027) / lensScale, 919.0) * 0.8 * centerFade;
    pores *= developed * cornerExposure;
  }
  float angle = atan(p.y, p.x);
  float upperSliver = 0.12 + 1.15 * bell(angle - 2.18, 0.32);
  float lowerSliver = 0.12 + 1.10 * bell(angle + 0.85, 0.30);
  // The inner wall holds a brighter line around the upper-left and lower-right
  // corners, whatever the key light does. Each arc runs farther along the top or
  // bottom edge than down the side: its window is wider toward the horizontal.
  float tlOffset = angle - 0.75 * PI;
  float brOffset = angle + 0.25 * PI;
  float tlReach = tlOffset < 0.0 ? 0.65 : 0.42;
  float brReach = brOffset < 0.0 ? 0.65 : 0.42;
  float wallCorner = max(
    1.0 - ease(0.6 * tlReach, tlReach, abs(tlOffset)),
    1.0 - ease(0.6 * brReach, brReach, abs(brOffset))
  );
  vec3 insetLight = vec3(0.60, 0.78, 0.91) * wallRim * (key * key * 0.8 * upperSliver + lowerRight * lowerRight * 0.75 * lowerSliver + 0.005 + 0.35 * wallCorner * uInnerWallFocus);
  // The caustic follows the curved channel: a white-cyan core with blue lips, streaked
  // by the glass it passes through.
  // Filaments run parallel to the edge; their brightness drifts slowly along it.
  float drift = 0.7 + 0.6 * contourNoise(arc / (uUnit * 0.09) + 7.0);
  float filaments = (bell(innerSd + uUnit * 0.021, uUnit * 0.0035 * thickness) * 0.9 + bell(inner2Sd + uUnit * 0.028, uUnit * 0.004 / thickness) * 0.7) * centerFade + bell(rimSd + uUnit * 0.035, uUnit * 0.003 * thickness) * 0.5;
  vec3 lowerRelief = (
    vec3(0.03, 0.32, 1.0) * bell(sd + uUnit * 0.038, uUnit * 0.022 + aa * 0.2) * 0.55 +
    vec3(0.22, 0.62, 1.0) * bell(sd + uUnit * 0.027, uUnit * 0.012 + aa * 0.1) * 0.7 +
    vec3(0.75, 0.97, 1.0) * filaments * 1.35
  ) * drift * lowerRight * glass * uHighlights * uRelief * (1.0 - 0.85 * ease(0.6, 1.0, t)) * (1.0 - settle);
  lowerRelief *= 1.0 - pores.x * 0.22;
  lowerRelief += vec3(0.45, 0.85, 1.0) * pores.y * 0.10 * lowerRight * glass * uHighlights * uRelief * (1.0 - settle);
  // With focus at 0 the inner wall is drawn whole. Raising it keeps the wall on a
  // pale plate to its strongly lit segments and its upper-left and lower-right
  // arcs, since there its weak light clips to white and its shadow would
  // otherwise outline the full contour.
  float wallLit = clamp(key * key * 0.8 * upperSliver + lowerRight * lowerRight * 0.75 * lowerSliver, 0.0, 1.0);
  float wallGate = mix(1.0, max(ease(0.2, 0.7, wallLit), wallCorner), uPageLight * uInnerWallFocus);
  color *= 1.0 - wallShadow * wallGate * uRelief * 0.12 * (1.0 - ink.a);
  color += backFace + lowerRelief + insetLight * wallGate * glass * uHighlights * uRelief * (1.0 - ink.a) * mix(rimVisibility, 0.9, key);
  alpha = max(alpha, max(lowerRelief.r, max(lowerRelief.g, lowerRelief.b)));
  float rimLight = rim * (0.07 + key * 0.55) + inner * (0.025 + key * 0.16) + inner2 * 0.025;
  // Micro-bubbles along the lit edges, strongest where the key and the lower fill land.
  float speckSize = max(uUnit * 0.0042, 0.8 / uDpr);
  float bubbles = driftingSpecks(arc, rimLineSd + uUnit * 0.002, speckSize, 0.0, t) * 0.9;
  bubbles += specks(arc, innerSd + uUnit * 0.012, speckSize * 0.8, 97.0) * 0.6 * centerFade;
  bubbles += specks(arc, insetSd, speckSize * 0.9, 191.0) * 0.5 * centerFade;
  rimLight += bubbles * (0.04 + key * 0.5 + lowerRight * 0.45);
  rimLight = rimLight * (1.0 - pores.x * 0.35) + pores.y * (key * 0.16 + lowerRight * 0.12);
  vec3 spectralRim = vec3(0.0);
  vec3 spectralWeights = vec3(0.0);
  for (int i = 0; i < BANDS; i++) {
    float s = float(i) / float(BANDS - 1);
    vec3 w = spectrum(s);
    spectralRim += w * bell(rimSd + (s - 0.5) * uUnit * 0.011 * uDispersion + uUnit * 0.003, uUnit * 0.002 * thickness);
    spectralWeights += w;
  }
  spectralRim /= spectralWeights;
  vec3 reflection = (vec3(0.6, 0.76, 0.9) * rimLight * 1.15 + spectralRim * (0.02 + ink.a * 0.32)) * uHighlights * glass * mix(rimVisibility, 1.2, key);
  float sphericalRim = (
    bell(sd + uUnit * lensScale * 0.008, uUnit * lensScale * 0.009) * 0.60 +
    bell(insetSd, uUnit * lensScale * 0.008) * 0.40
  ) * (0.25 + 0.75 * abs(outward.y)) * (1.0 - ease(0.235, 0.34, t));
  reflection += vec3(0.65, 0.80, 0.90) * sphericalRim * 1.4 * uHighlights * glass;
  float cyanKey = pow(max(0.0, -outward.x), 8.0) * (1.0 - ease(0.235, 0.34, t));
  float cyanLip = bell(sd + uUnit * lensScale * 0.020, uUnit * lensScale * 0.009);
  cyanLip += bell(insetSd, uUnit * lensScale * 0.005) * 0.35;
  reflection += vec3(0.015, 0.68, 1.0) * cyanLip * cyanKey * glass * uHighlights * 0.85;
  // The young drop is full of scattered light: a milky glow behind the artwork.
  float youth = 1.0 - ease(0.25, 0.37, t);
  reflection += vec3(0.78, 0.84, 0.9) * youth * 0.07 * (0.5 + 0.5 * radius) * (1.0 - ink.a) * glass;
  vec3 film = mix(vec3(0.32, 0.0, 0.20), vec3(0.32, 0.08, 0.02), ease(0.75, 1.12, t)) * bell(sd + uUnit * 0.001, uUnit * 0.002) * ink.a * glass * uHighlights;
  color += reflection + film;
  alpha = max(alpha, max(reflection.r, max(reflection.g, reflection.b)));
  vec4 result = vec4(color * mask, alpha * mask);

  // Reflections outside the body are faint glass echoes, not solid colored outlines.
  float outer = bell(rimSd - uUnit * 0.012, uUnit * 0.0028 * thickness) * (0.04 + key * 0.2) * (0.5 + contourNoise(arc / grainScale + 131.0));
  outer += specks(arc, rimSd - uUnit * 0.012, speckSize, 277.0) * (0.03 + key * 0.3 + lowerRight * 0.25);
  // A single wave leaves the rim as the plate forms, stays close to it and fades.
  float waveAge = ease(0.36, 1.1, t);
  float wave = bell(sd - uUnit * (0.014 + 0.03 * waveAge), uUnit * 0.004 + aa * 0.3) * 0.05 * ease(0.34, 0.42, t) * (1.0 - waveAge);
  // The echo is lit through the plate, so it can carry the plate's hue and, on a
  // dark page, stay quieter than the rim it echoes.
  vec3 echoTint = mix(vec3(0.43, 0.62, 0.79), uTile + (1.0 - uTile) * 0.4, 0.5 * uEchoTint);
  float echoLevel = mix(1.0, mix(0.6, 1.0, uPageLight), uEchoTint);
  // The echo line runs around all four sides. The wave stays faint on the left
  // and right, where a full ring would read as streaks beside the glass.
  float waveSides = mix(1.0, 0.10, ease(0.25, 0.80, abs(outward.x)));
  vec3 ghost = (echoTint + ink.rgb * 0.6) * (outer + wave * waveSides) * glass * uHighlights * rimVisibility * echoLevel;
  float exterior = max(ghost.r, max(ghost.g, ghost.b)) * 1.8;
  result.rgb += exteriorColor(ghost * 1.8, exterior);
  result.a = max(result.a, exterior);
  // Resolve directly to the source, retaining its full size after the glass fades.
  return mix(result * shown, source, settle);
}

// The second drop is a radial lens with spherical aberration. Its core magnifies the
// wordmark (inverting it while the drop is tall), so between center and edge the image
// runs through focus and floods the drop; across its rim a thin ring of the image is
// stretched outward, and ripples crossing the rim repeat that ring in bands.
vec4 wordmarkLens(vec2 p) {
  float t = uTime;
  if (uWordmarkEnabled < 0.5) return vec4(0.0);
  if (t < 1.46) return vec4(0.0);
  if (t >= 3.3) return imageAt(uText, p, uTextBox);
  float radius = max(uDrop.x, 1.0);
  float r = length(p);
  if (r > radius + uUnit * 0.6) return vec4(0.0);
  vec2 outward = p / max(r, 0.001);
  float q = r / radius;
  float aa = 1.0 / uDpr;
  float edge = radius - r;
  float mask = ease(-aa, aa, edge);
  float young = 1.0 - ease(1.72, 2.02, t);

  float core = min(uDrop.y, radius);
  float coreQ = r / max(core, 1.0);
  float edgeLanding = core / max(uDropLens.x, 0.01);
  float center = uDrop.w;
  float landing = r < core
    ? edgeLanding * coreQ * (center + (1.0 - center) * pow(coreQ, uDropLens.y))
    : edgeLanding + (r - core) * uDrop.z;
  float rimZone = ease(core * 0.9, core, r);
  float k = 2.0 * PI / max(uDropLens.w, 1.0);
  landing += uDropLens.z * sin(k * r - uDropWave.x) * ease(0.0, uDropLens.w, r) * mix(uDropWave.y, 1.0, rimZone);
  vec2 bend = outward * (landing - r);
  float spread = uDropWave.z * uDispersion * (0.15 + 0.85 * rimZone);

  vec3 color = vec3(0.0);
  vec3 weights = vec3(0.0);
  float alpha = 0.0;
  float opacity = ease(1.46, 1.49, t);
  for (int i = 0; i < BANDS; i++) {
    float s = float(i) / float(BANDS - 1);
    vec2 source = p + bend * (1.0 + spread * (s - 0.5));
    vec4 ink = imageAt(uText, source, uTextBox);
    vec3 w = spectrum(s);
    color += ink.rgb * w;
    alpha += ink.a * (w.r + w.g + w.b);
    weights += w;
  }
  color /= weights;
  alpha /= weights.r + weights.g + weights.b;
  color *= 1.0 + uCaustics * bell(edge, uUnit * 0.06) * 0.15;
  color *= mask;
  alpha *= mask;
  // A fresh drop is full of scattered light: overexposed ink, a milky body and a cool
  // spill around it, all fading as it flattens.
  float fresh = 1.0 - ease(1.62, 1.95, t);
  color = min(color * (1.0 + 0.6 * fresh), vec3(1.0));
  float milk = mask * fresh * 0.30 * (0.6 + 0.4 * q) * uCaustics;
  color += vec3(0.75, 0.82, 0.9) * milk * (1.0 - alpha);
  float spill = exp(-max(r - radius, 0.0) / (uUnit * 0.17)) * (1.0 - mask) * fresh * 0.12;
  // As it spreads, the drop keeps a faint blue haze that dies with the waves.
  spill += exp(-max(r - radius, 0.0) / (uUnit * 0.4)) * (1.0 - fresh) * 0.035 * exp(-max(t - 1.95, 0.0) / 0.45) * (1.0 - ease(2.8, 3.1, t));
  color += vec3(0.32, 0.6, 1.0) * spill;
  alpha = max(alpha, max(milk, spill));
  vec3 sphereNormal = normalize(vec3(p / radius, sqrt(max(0.005, 1.0 - q * q))));
  vec3 reflected = reflect(vec3(0.0, 0.0, -1.0), sphereNormal);
  float softbox = bell(reflected.x + 0.3, 0.2) * bell(reflected.y - 0.55, 0.15);
  float smallLight = bell(reflected.x - 0.25, 0.14) * bell(reflected.y - 0.65, 0.08);
  float broadLight = bell(reflected.x + 0.35, 0.65) * bell(reflected.y - 0.6, 0.45);
  float surface = (softbox * 0.8 + smallLight * 0.6 + broadLight * 0.22) * young * uHighlights * mask;
  color += vec3(0.85, 0.95, 1.0) * surface;
  alpha = max(alpha, surface);

  float key = pow(0.5 + 0.5 * dot(outward, normalize(vec2(-0.6, 0.8))), 7.0);
  float rings = 0.0;
  for (int i = 0; i < 4; i++) {
    float j = float(i);
    float ringRadius = radius + (j - 1.0) * uUnit * 0.022 * (1.0 + 0.55 * ease(1.8, 3.1, t));
    rings += bell(r - ringRadius, uUnit * (0.003 + j * 0.001)) * (0.11 / (1.0 + j));
  }
  float age = max(0.0, t - 1.46);
  float fade = exp(-age / max(uDecay, 0.1)) * (1.0 - ease(2.65, 3.3, t));
  // Only the drop's own nested rims are lit; no broad glow or crest travels out
  // beyond it.
  float sideLight = pow(abs(outward.x), 10.0) * mix(1.0, 0.72, step(0.0, p.x));
  vec3 reflection = vec3(0.4, 0.62, 0.79) * rings * (0.3 + key * 2.0 + sideLight * 1.8) * fade * uHighlights;
  color += reflection;
  alpha = max(alpha, max(reflection.r, max(reflection.g, reflection.b)));
  return vec4(color, alpha) * opacity;
}

void main() {
  vec2 p = (gl_FragCoord.xy - uResolution * 0.5) / uDpr;
  vec4 icon = iconLens(p);
  vec4 wordmark = wordmarkLens(p);
  vec4 result = wordmark + icon * (1.0 - wordmark.a);
  // RGB and alpha use the same coverage; preserve saturated spectral fringes when
  // compositing onto transparent or colored backgrounds.
  result.a = clamp(max(result.a, max(result.r, max(result.g, result.b))), 0.0, 1.0);
  float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  outColor = vec4(clamp(result.rgb + dither * result.a, vec3(0.0), vec3(result.a)), result.a);
}
`, bm = `#version 300 es
precision highp float;
uniform sampler2D uScene;
uniform vec2 uResolution;
uniform float uDpr;
uniform float uUnit;
uniform float uSettle;
uniform float uBloom;
uniform float uTime;
uniform float uFinish;
uniform float uPageLight;
out vec4 outColor;

// Filter premultiplied color and coverage together. The footprint is in CSS
// pixels, so the glass has the same optical softness on normal and retina screens.
vec4 softenedWaves(vec2 uv, float lod) {
  vec2 d = vec2(uDpr * 0.90) / uResolution;
  vec4 blurred = textureLod(uScene, uv, lod) * 0.25;
  blurred += textureLod(uScene, uv + vec2(d.x, 0.0), lod) * 0.125;
  blurred += textureLod(uScene, uv - vec2(d.x, 0.0), lod) * 0.125;
  blurred += textureLod(uScene, uv + vec2(0.0, d.y), lod) * 0.125;
  blurred += textureLod(uScene, uv - vec2(0.0, d.y), lod) * 0.125;
  blurred += textureLod(uScene, uv + d, lod) * 0.0625;
  blurred += textureLod(uScene, uv - d, lod) * 0.0625;
  blurred += textureLod(uScene, uv + vec2(d.x, -d.y), lod) * 0.0625;
  blurred += textureLod(uScene, uv + vec2(-d.x, d.y), lod) * 0.0625;
  return blurred;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 base = textureLod(uScene, uv, 0.0);
  float offset = log2(max(uDpr, 0.5));
  // Only the exterior liquid is softened. The artwork and its final resting
  // silhouette retain their native sharpness and original coverage.
  float wavePhase = smoothstep(0.29, 0.41, uTime) * (1.0 - smoothstep(1.25, 1.50, uTime));
  float waveMask = 0.0;
  if (wavePhase > 0.001) {
    float enter = smoothstep(0.025, 0.16, uTime);
    float expand = enter * (0.64 + 0.41 * (1.0 - exp(-max(uTime - 0.16, 0.0) * 5.8)));
    float collapse = 1.0 - smoothstep(1.33, 1.52, uTime);
    float lensScale = mix(expand * mix(0.48, 1.0, collapse), 1.0, smoothstep(0.0, 1.0, uSettle));
    float halfSize = max(0.001, uUnit * lensScale * 0.5);
    float shape = 2.0 + 3.0 * smoothstep(0.29, 0.36, uTime);
    vec2 p = abs((gl_FragCoord.xy - uResolution * 0.5) / uDpr) / halfSize;
    float radius = pow(pow(p.x, shape) + pow(p.y, shape), 1.0 / shape);
    float distance = (radius - 1.0) * halfSize;
    waveMask = smoothstep(0.0, max(0.75, uUnit * 0.004), distance) * wavePhase;
    if (waveMask > 0.001) {
      base = mix(base, softenedWaves(uv, max(0.0, offset + 0.15)), waveMask * 0.94);
    }
  }
  vec3 diffused = textureLod(uScene, uv, offset + 2.5).rgb * 0.50;
  diffused += textureLod(uScene, uv, offset + 4.1).rgb * 0.32;
  diffused += textureLod(uScene, uv, offset + 5.4).rgb * 0.18;
  float light = max(base.r, max(base.g, base.b));
  // Bright ink retains its calibrated color; light diffuses into its surroundings.
  float effect = 1.0 - smoothstep(0.0, 1.0, uFinish);
  // Bloom is light spilling onto a dark page. A pale page already holds that
  // light, and adding it where the plate thins out reads as a flash.
  vec3 glow = diffused * uBloom * 0.20 * (1.0 - min(1.0, light * 1.2)) * effect * (1.0 - uPageLight);
  float alpha = clamp(max(base.a, max(glow.r, max(glow.g, glow.b))), 0.0, 1.0);
  float grain = fract(sin(dot(gl_FragCoord.xy + floor(uTime * 24.0), vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  vec3 color = base.rgb + glow + grain * 0.009 * base.a * clamp(light * 3.0 + 0.05, 0.05, 1.0) * effect * (1.0 - waveMask * 0.85);
  outColor = vec4(clamp(color, vec3(0.0), vec3(alpha)), alpha);
}
`;
const Tm = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 104"><path fill="#fff" d="M35 24c0-2.6 1.7-4.8 4.2-5.5L79.6 7.6C82.6 6.8 85 9 85 12.1V64c0 8.9-7.3 17-16.5 19.2C59.3 85.4 52 81 52 73.2c0-9 7.5-16.9 16.7-19.1 3.3-.8 6.3-.9 8.3-.2V28.8L43 38.1V77c0 8.9-7.3 17-16.5 19.2C17.3 98.4 10 94 10 86.2c0-9 7.5-16.9 16.7-19.1 3.3-.8 6.3-.9 8.3-.2V24Z"/></svg>'
)}`, zm = "../../assets/favicon.svg", Xr = {
  logo: Tm,
  mark: zm,
  text: "music",
  ending: "logo",
  logoSize: 256,
  logoScale: 0.72,
  finalLogoScale: 1,
  tile: !0,
  fontSize: 64,
  fontFamily: 'system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
  fontWeight: 850,
  fontStretch: "expanded",
  letterSpacing: -0.01,
  markGap: 0.12,
  theme: "dark",
  logoColor: "#ffffff",
  logoRelief: 1,
  textColor: "#e2e6ee",
  tileColor: "#060c18",
  background: "#000000",
  depth: 1.2,
  dispersion: 1,
  relief: 1,
  caustics: 1,
  highlights: 1,
  bloom: 0.55,
  dropSize: 0.32,
  dropStrength: 1,
  echoTint: 0.5,
  innerWallFocus: 0,
  decay: 1.4,
  speed: 1,
  loop: !1,
  loopDelay: 1.6,
  paused: !1,
  maxDpr: 2
}, li = 3.3, qu = 1.8;
function la(g, A) {
  if (A <= g[0][0]) return g[0][1];
  const D = g[g.length - 1];
  if (A >= D[0]) return D[1];
  let f = 0;
  for (; A > g[f + 1][0]; ) f++;
  const [N, Q] = g[f], [J, Z] = g[f + 1], [x, T] = g[f - 1] ?? [N - (J - N), Q], [M, _] = g[f + 2] ?? [J + (J - N), Z], L = J - N, hl = (Z - T) / (J - x) * L, cl = (_ - Q) / (M - N) * L, P = (A - N) / L, zl = P * P, ul = zl * P;
  return (2 * ul - 3 * zl + 1) * Q + (ul - 2 * zl + P) * hl + (-2 * ul + 3 * zl) * Z + (ul - zl) * cl;
}
const Lr = [
  [0.12, 1.4],
  [0.33, 1.45],
  [0.46, 1.44],
  [0.63, 1.33],
  [0.79, 1.24],
  [0.96, 1.2],
  [1.13, 1.11],
  [1.25, 1],
  [1.335, 0.865],
  [1.376, 0.81],
  [1.418, 0.735],
  [1.46, 0.41]
], Em = [
  [1.46, 0.32],
  [1.55, 0.36],
  [1.67, 0.49],
  [1.75, 0.52],
  [1.84, 0.56],
  [1.92, 0.68],
  [2, 0.88],
  [2.15, 0.95],
  [2.4, 1.06],
  [2.95, 1.3]
], Am = [
  [1.46, 1.5],
  [1.84, 1.5],
  [1.92, 0.55],
  [2, 0.6],
  [2.09, 0.68],
  [2.17, 0.78],
  [2.3, 0.85],
  [2.5, 0.9],
  [2.75, 0.93],
  [2.95, 0.97],
  [3.02, 1.03]
], xm = [
  [1.46, 0.3],
  [1.84, 0.3],
  [2, 0.25],
  [2.1, 0.2],
  [2.2, 0.2],
  [2.4, 0.25],
  [2.7, 0.3],
  [2.85, 0.45],
  [2.95, 0.8],
  [3.02, 1]
], Mm = [
  [1.46, -0.6],
  [1.6, -0.5],
  [1.75, -0.3],
  [1.8, 0.4],
  [1.84, 1]
], Dm = [
  [1.46, 1.5],
  [1.6, 1.5],
  [1.75, 2.2],
  [1.84, 1.4],
  [1.92, 1.2],
  [2, 1.05],
  [2.1, 1]
], ie = (g, A, D) => {
  const f = Math.min(1, Math.max(0, (D - g) / (A - g)));
  return f * f * (3 - 2 * f);
}, Um = {
  dark: { logoColor: "#ffffff", textColor: "#e2e6ee", tileColor: "#060c18", background: "#000000" },
  light: {
    logoColor: "#09111b",
    textColor: "#09111b",
    tileColor: "#e4e6ea",
    background: "#e2e2e5"
  }
};
function _m(g) {
  const A = (f, N, Q, J) => Number.isFinite(f) ? Math.min(J, Math.max(Q, f)) : N, D = Xr;
  return {
    ...g,
    ending: g.ending === "wordmark" ? "wordmark" : "logo",
    theme: g.theme === "light" ? "light" : "dark",
    logoSize: A(g.logoSize, D.logoSize, 24, 1024),
    logoScale: A(g.logoScale, D.logoScale, 0.1, 1),
    finalLogoScale: A(g.finalLogoScale, D.finalLogoScale, 0.1, 1),
    fontSize: A(g.fontSize, D.fontSize, 8, 400),
    fontWeight: A(g.fontWeight, D.fontWeight, 100, 1e3),
    letterSpacing: A(g.letterSpacing, D.letterSpacing, -0.3, 1),
    markGap: A(g.markGap, D.markGap, 0, 2),
    depth: A(g.depth, D.depth, 0, 6),
    dispersion: A(g.dispersion, D.dispersion, 0, 4),
    relief: A(g.relief, D.relief, 0, 3),
    caustics: A(g.caustics, D.caustics, 0, 4),
    highlights: A(g.highlights, D.highlights, 0, 4),
    bloom: A(g.bloom, D.bloom, 0, 2),
    dropSize: A(g.dropSize, D.dropSize, 0.05, 1.5),
    dropStrength: A(g.dropStrength, D.dropStrength, 0, 4),
    echoTint: A(g.echoTint, D.echoTint, 0, 1),
    logoRelief: A(g.logoRelief, D.logoRelief, 0, 1),
    innerWallFocus: A(g.innerWallFocus, D.innerWallFocus, 0, 1),
    decay: A(g.decay, D.decay, 0.1, 10),
    speed: A(g.speed, D.speed, 0.1, 4),
    loopDelay: A(g.loopDelay, D.loopDelay, 0, 30),
    maxDpr: A(g.maxDpr, D.maxDpr, 0.5, 4)
  };
}
function Gr(g) {
  return new Promise((A) => {
    if (!g) return A(null);
    const D = new Image();
    D.crossOrigin = "anonymous", D.decoding = "async", D.onload = () => A(D), D.onerror = () => A(null), D.src = g;
  });
}
const Mf = (g) => 2 ** Math.ceil(Math.log2(Math.max(2, g)));
function jr(g, A, D, f, N, Q, J) {
  if (J === "original") {
    g.drawImage(A, D, f, N, Q);
    return;
  }
  const Z = document.createElement("canvas");
  Z.width = Math.max(1, Math.ceil(N)), Z.height = Math.max(1, Math.ceil(Q));
  const x = Z.getContext("2d");
  x.drawImage(A, 0, 0, Z.width, Z.height), x.globalCompositeOperation = "source-in", x.fillStyle = J, x.fillRect(0, 0, Z.width, Z.height), g.drawImage(Z, D, f, N, Q);
}
function wr(g) {
  const A = g.naturalWidth || g.width || 1, D = g.naturalHeight || g.height || 1;
  return { width: A, height: D };
}
function Qr(g, A, D) {
  if (D <= 0) return;
  const f = g.getContext("2d"), { width: N, height: Q } = g, J = f.getImageData(0, 0, N, Q), Z = J.data, x = new Float32Array(N * Q);
  for (let M = 0; M < x.length; M++) x[M] = Z[M * 4 + 3] > 127 ? 1e6 : 0;
  const T = Math.SQRT2;
  for (let M = 1; M < Q - 1; M++)
    for (let _ = 1; _ < N - 1; _++) {
      const L = M * N + _;
      x[L] = Math.min(
        x[L],
        x[L - 1] + 1,
        x[L - N] + 1,
        x[L - N - 1] + T,
        x[L - N + 1] + T
      );
    }
  for (let M = Q - 2; M > 0; M--)
    for (let _ = N - 2; _ > 0; _--) {
      const L = M * N + _;
      x[L] = Math.min(
        x[L],
        x[L + 1] + 1,
        x[L + N] + 1,
        x[L + N - 1] + T,
        x[L + N + 1] + T
      );
    }
  for (let M = 0; M < x.length; M++) {
    const _ = Math.max(0, 1 - x[M] / A);
    x[M] = Math.sqrt(Math.max(0, 1 - _ * _)) * A * 0.4;
  }
  for (let M = 1; M < Q - 1; M++)
    for (let _ = 1; _ < N - 1; _++) {
      const L = M * N + _;
      if (!Z[L * 4 + 3]) continue;
      const hl = (x[L - 1] - x[L + 1]) * 0.5, cl = (x[L - N] - x[L + N]) * 0.5, ul = 1 + ((0.74 + Math.max(0, (-hl * 0.45 - cl * 0.6 + 0.8) / Math.hypot(hl, cl, 1)) * 0.26) / (0.74 + 0.8 * 0.26) - 1) * D;
      for (let gl = 0; gl < 3; gl++) Z[L * 4 + gl] *= ul;
    }
  f.putImageData(J, 0, 0);
}
function Rm(g, A, D) {
  const f = Math.min(2048, Mf(A.logoSize * D * 2)), N = document.createElement("canvas");
  N.width = N.height = f;
  const Q = N.getContext("2d");
  if (g) {
    const { width: J, height: Z } = wr(g), x = f * A.logoScale / Math.max(J, Z), T = J * x, M = Z * x;
    jr(Q, g, (f - T) / 2, (f - M) / 2, T, M, A.logoColor);
  }
  return g && A.logoColor !== "original" && Qr(N, N.width * 0.03, A.logoRelief), { canvas: N, box: [A.logoSize, A.logoSize] };
}
function Df(g) {
  return `${g.fontWeight} ${g.fontSize}px ${g.fontFamily}`;
}
function Om(g, A, D) {
  const f = document.createElement("canvas").getContext("2d");
  f.font = Df(A), f.fontStretch = A.fontStretch;
  const N = A.letterSpacing * A.fontSize;
  f.letterSpacing = `${N}px`;
  const Q = Math.max(0, f.measureText(A.text).width), J = f.measureText(A.text || "x"), Z = J.actualBoundingBoxAscent || A.fontSize * 0.72, x = J.actualBoundingBoxDescent || A.fontSize * 0.2, T = f.measureText("x").actualBoundingBoxAscent || A.fontSize * 0.52;
  let M = 0, _ = 0;
  if (g) {
    const { width: Yl, height: O } = wr(g);
    _ = Math.max(Z, T * 1.3), M = Yl / O * _;
  }
  const L = g && A.text.length ? A.markGap * A.fontSize : 0, hl = M + L + Q, cl = A.fontSize * 0.5, P = [hl + cl * 2, A.fontSize * 2], zl = Math.min(D * 2, 4096 / P[0], 4096 / P[1]), ul = document.createElement("canvas");
  ul.width = Math.min(4096, Mf(P[0] * zl)), ul.height = Math.min(4096, Mf(P[1] * zl));
  const gl = ul.getContext("2d");
  gl.scale(ul.width / P[0], ul.height / P[1]);
  const El = P[1] / 2 + (Z - x) / 2;
  let k = cl;
  if (g) {
    const Yl = A.logoColor === "original" ? "original" : A.textColor;
    jr(gl, g, k, El - _, M, _, Yl), k += M + L;
  }
  return gl.font = Df(A), gl.fontStretch = A.fontStretch, gl.fillStyle = A.textColor, gl.textBaseline = "alphabetic", gl.letterSpacing = `${N}px`, gl.textAlign = "left", gl.fillText(A.text, k, El), A.logoColor !== "original" && Qr(ul, A.fontSize * 0.04 * ul.height / P[1], A.logoRelief), { canvas: ul, box: P, contentWidth: hl };
}
function Yr(g) {
  const A = document.createElement("canvas").getContext("2d");
  A.fillStyle = "#000", A.fillStyle = g;
  const D = String(A.fillStyle);
  if (D.startsWith("#")) {
    const N = parseInt(D.slice(1, 7), 16);
    return [(N >> 16) / 255, (N >> 8 & 255) / 255, (N & 255) / 255];
  }
  const f = D.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  return [f[0] / 255, f[1] / 255, f[2] / 255];
}
function Nm(g, A, D) {
  const f = g.getContext("webgl2", {
    premultipliedAlpha: !0,
    alpha: !0,
    antialias: !1
  });
  if (!f) return null;
  const N = (j, yl) => {
    const V = f.createShader(j);
    if (f.shaderSource(V, yl), f.compileShader(V), !f.getShaderParameter(V, f.COMPILE_STATUS)) {
      const Ol = f.getShaderInfoLog(V);
      throw f.deleteShader(V), new Error(Ol ?? "Liquid Glass Logo shader failed to compile.");
    }
    return V;
  }, Q = (j) => {
    const yl = f.createProgram(), V = N(f.VERTEX_SHADER, Sm), Ol = N(f.FRAGMENT_SHADER, j);
    if (f.attachShader(yl, V), f.attachShader(yl, Ol), f.bindAttribLocation(yl, 0, "aPosition"), f.linkProgram(yl), f.deleteShader(V), f.deleteShader(Ol), !f.getProgramParameter(yl, f.LINK_STATUS)) {
      const Ot = f.getProgramInfoLog(yl);
      throw f.deleteProgram(yl), new Error(Ot ?? "Liquid Glass Logo program failed to link.");
    }
    return yl;
  }, J = Q(pm), Z = Q(bm), x = Object.fromEntries(
    [
      "uScene",
      "uResolution",
      "uDpr",
      "uUnit",
      "uSettle",
      "uBloom",
      "uTime",
      "uFinish",
      "uPageLight"
    ].map((j) => [j, f.getUniformLocation(Z, j)])
  ), T = /* @__PURE__ */ new Map(), M = (j) => (T.has(j) || T.set(j, f.getUniformLocation(J, j)), T.get(j)), _ = f.createVertexArray();
  f.bindVertexArray(_);
  const L = f.createBuffer();
  f.bindBuffer(f.ARRAY_BUFFER, L), f.bufferData(f.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), f.STATIC_DRAW), f.enableVertexAttribArray(0), f.vertexAttribPointer(0, 2, f.FLOAT, !1, 0, 0);
  const hl = () => {
    const j = f.createTexture();
    return f.bindTexture(f.TEXTURE_2D, j), f.texImage2D(f.TEXTURE_2D, 0, f.RGBA, 1, 1, 0, f.RGBA, f.UNSIGNED_BYTE, new Uint8Array(4)), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MIN_FILTER, f.LINEAR_MIPMAP_LINEAR), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MAG_FILTER, f.LINEAR), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_S, f.CLAMP_TO_EDGE), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_T, f.CLAMP_TO_EDGE), j;
  }, cl = hl(), P = hl(), zl = hl(), ul = f.createFramebuffer();
  f.bindFramebuffer(f.FRAMEBUFFER, ul), f.framebufferTexture2D(f.FRAMEBUFFER, f.COLOR_ATTACHMENT0, f.TEXTURE_2D, zl, 0), f.bindFramebuffer(f.FRAMEBUFFER, null);
  let gl = 0, El = 0;
  const k = () => {
    gl === g.width && El === g.height || (gl = g.width, El = g.height, f.activeTexture(f.TEXTURE0), f.bindTexture(f.TEXTURE_2D, zl), f.texImage2D(
      f.TEXTURE_2D,
      0,
      f.RGBA8,
      gl,
      El,
      0,
      f.RGBA,
      f.UNSIGNED_BYTE,
      null
    ));
  }, Yl = (j, yl) => {
    f.activeTexture(f.TEXTURE0), f.bindTexture(f.TEXTURE_2D, j), f.pixelStorei(f.UNPACK_FLIP_Y_WEBGL, !0), f.pixelStorei(f.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), f.texImage2D(f.TEXTURE_2D, 0, f.RGBA, f.RGBA, f.UNSIGNED_BYTE, yl), f.generateMipmap(f.TEXTURE_2D);
  };
  let O = A, w = 1, vl = 1, lt = 1, qt = [1, 1], $l = 0, Xl = !1, St = !1, pt = "", tt = 0, S = null, U = 0, q = 0, nl = !A.paused, sl = !0, r = 0;
  const z = window.matchMedia?.("(prefers-reduced-motion: reduce)"), R = () => Math.min(
    1,
    // Reserve room for the side reflections as they travel away from the plate.
    vl / Math.max(O.logoSize * 1.9, O.ending === "wordmark" ? $l * 1.22 : 0),
    lt / (O.logoSize * 1.5)
  ), C = () => {
    if (!Xl || St) return;
    const j = R();
    k(), f.bindFramebuffer(f.FRAMEBUFFER, ul), f.viewport(0, 0, g.width, g.height), f.useProgram(J), f.bindVertexArray(_), [cl, P].forEach((ta, ui) => {
      f.activeTexture(f.TEXTURE0 + ui), f.bindTexture(f.TEXTURE_2D, ta);
    }), f.uniform1i(M("uLogo"), 0), f.uniform1i(M("uText"), 1), f.uniform2f(M("uResolution"), g.width, g.height), f.uniform1f(M("uDpr"), g.width / vl), f.uniform1f(M("uUnit"), O.logoSize * j), f.uniform2f(M("uLogoBox"), O.logoSize * j, O.logoSize * j), f.uniform2f(M("uTextBox"), qt[0] * j, qt[1] * j), f.uniform1f(M("uTextWidth"), $l * j);
    const yl = O.ending === "logo" ? qu : li, V = z?.matches ? yl : U, Ol = O.ending === "logo" ? Math.min(qu, V) : V;
    f.uniform1f(M("uTime"), Ol), f.uniform1f(M("uWordmarkEnabled"), O.ending === "wordmark" ? 1 : 0);
    const Ot = O.ending === "logo" ? Math.max(0, Math.min(1, (V - 1.16) / (1.4 - 1.16))) : 0, fe = O.logoSize * j, qe = Math.max($l * j / 2, fe * 0.3), Ul = Ol, jt = 1 - ie(2.85, 3.02, Ul);
    f.uniform4f(
      M("uDrop"),
      qe * la(Em, Ul),
      qe * la(Am, Ul),
      Math.max(0.02, Math.min(1, la(xm, Ul))),
      1 + (la(Mm, Ul) - 1) * O.dropStrength
    ), f.uniform4f(
      M("uDropLens"),
      1 + (la(Dm, Ul) - 1) * O.dropStrength,
      2 + 4 * ie(1.74, 1.84, Ul),
      fe * (9e-3 * Math.exp(-Math.max(Ul - 1.46, 0) / 0.5) * (1 - ie(1.85, 1.95, Ul)) + 0.012 * ie(2.2, 2.4, Ul)) * jt,
      fe * (0.07 + (0.03 - 0.07) * ie(1.9, 2.4, Ul))
    ), f.uniform4f(
      M("uDropWave"),
      (Ul - 1.45) * 42,
      1 - ie(1.85, 2, Ul),
      2 * (0.12 + 1.6 * ie(1.86, 2, Ul) - 0.9 * ie(2.25, 2.5, Ul)) * jt,
      0
    );
    const Bt = ie(1.13, 1.28, V), ti = O.ending === "logo" && V > 1.13 ? la(Lr, 1.13) * (1 - Bt) + O.finalLogoScale * Bt : la(Lr, Ol);
    f.uniform1f(M("uArtScale"), ti), f.uniform1f(M("uSettle"), Ot), f.uniform3fv(M("uTile"), Yr(O.tileColor));
    const [ei, Il, ai] = Yr(O.background), Bu = 0.299 * ei + 0.587 * Il + 0.114 * ai, Xa = Math.min(1, Math.max(0, (Bu - 0.35) / 0.4));
    f.uniform1f(M("uPageLight"), Xa), f.uniform1f(M("uTileEnabled"), O.tile ? 1 : 0), f.uniform1f(M("uDepth"), O.depth), f.uniform1f(M("uDispersion"), O.dispersion), f.uniform1f(M("uRelief"), O.relief), f.uniform1f(M("uCaustics"), O.caustics), f.uniform1f(M("uHighlights"), O.highlights), f.uniform1f(M("uEchoTint"), O.echoTint), f.uniform1f(M("uInnerWallFocus"), O.innerWallFocus), f.uniform1f(M("uDropSize"), O.dropSize), f.uniform1f(M("uDropStrength"), O.dropStrength), f.uniform1f(M("uDecay"), O.decay), f.drawArrays(f.TRIANGLES, 0, 3), f.bindFramebuffer(f.FRAMEBUFFER, null), f.useProgram(Z), f.activeTexture(f.TEXTURE0), f.bindTexture(f.TEXTURE_2D, zl), f.generateMipmap(f.TEXTURE_2D), f.uniform1i(x.uScene, 0), f.uniform2f(x.uResolution, g.width, g.height), f.uniform1f(x.uDpr, g.width / vl), f.uniform1f(x.uUnit, fe), f.uniform1f(x.uSettle, Ot), f.uniform1f(x.uBloom, O.bloom), f.uniform1f(x.uPageLight, Xa), f.uniform1f(x.uTime, Ol), f.uniform1f(
      x.uFinish,
      O.ending === "logo" ? Math.max(0, Math.min(1, (V - 1.05) / (qu - 1.05))) : Math.max(0, Math.min(1, (V - 2.8) / (li - 2.8)))
    ), f.drawArrays(f.TRIANGLES, 0, 3);
  }, X = async () => {
    const j = JSON.stringify([
      O.logo,
      O.mark,
      O.text,
      O.logoSize,
      O.logoScale,
      O.fontSize,
      O.fontFamily,
      O.fontWeight,
      O.fontStretch,
      O.letterSpacing,
      O.markGap,
      O.logoColor,
      O.logoRelief,
      O.textColor,
      w
    ]);
    if (j === pt) return;
    pt = j;
    const yl = ++tt, V = { ...O }, Ol = V.mark === "logo" ? V.logo : V.mark, [Ot, fe] = await Promise.all([
      Gr(V.logo),
      Ol === V.logo ? null : Gr(Ol),
      document.fonts?.load(Df(V), V.text || "x").catch(() => {
      })
    ]);
    if (St || yl !== tt) return;
    const qe = Ol === V.logo ? Ot : fe, Ul = JSON.stringify([
      V.logo,
      V.logoSize,
      V.logoScale,
      V.logoColor,
      V.logoRelief,
      w
    ]), jt = S?.key === Ul ? S.raster : Rm(Ot, V, w);
    S = { key: Ul, raster: jt };
    const Bt = Om(Ol ? qe : null, V, w);
    Yl(cl, jt.canvas), Yl(P, Bt.canvas), qt = Bt.box, $l = Bt.contentWidth, Xl || (Xl = !0, q = 0, D?.()), C(), I();
  }, $ = (j) => {
    r = 0;
    const yl = q ? Math.min(0.05, (j - q) / 1e3) : 0;
    q = j;
    const V = nl && sl && !z?.matches && Xl;
    if (V) {
      U += yl * O.speed;
      const Ol = (O.ending === "logo" ? qu : li) + O.loopDelay;
      O.loop && U >= Ol && (U %= Ol);
    }
    C(), V && (O.loop || U < (O.ending === "logo" ? qu : li)) ? I() : q = 0;
  };
  function I() {
    !r && !St && (r = requestAnimationFrame($));
  }
  const jl = () => {
    const j = getComputedStyle(g);
    vl = Math.max(1, Number.parseFloat(j.width) || g.clientWidth), lt = Math.max(1, Number.parseFloat(j.height) || g.clientHeight);
    const yl = Math.min(window.devicePixelRatio || 1, O.maxDpr);
    g.width = Math.max(1, Math.round(vl * yl)), g.height = Math.max(1, Math.round(lt * yl)), yl !== w && (w = yl, X()), C(), I();
  }, Ml = new ResizeObserver(jl);
  Ml.observe(g);
  const ce = new IntersectionObserver(([j]) => {
    sl = j?.isIntersecting ?? !0, q = 0, sl && I();
  });
  ce.observe(g);
  const He = () => {
    q = 0, I();
  };
  return z?.addEventListener?.("change", He), jl(), X(), {
    update(j) {
      const yl = nl;
      O = j, nl = !j.paused, !yl && nl && (q = 0), jl(), X();
    },
    replay() {
      U = 0, q = 0, C(), I();
    },
    seek(j) {
      U = Number.isFinite(j) ? Math.max(0, Math.min(3600, j)) : 0, q = 0, C();
    },
    pause() {
      nl = !1, q = 0;
    },
    play() {
      nl = !0, q = 0, I();
    },
    dispose() {
      St = !0, S = null, cancelAnimationFrame(r), Ml.disconnect(), ce.disconnect(), z?.removeEventListener?.("change", He), f.deleteTexture(cl), f.deleteTexture(P), f.deleteTexture(zl), f.deleteFramebuffer(ul), f.deleteBuffer(L), f.deleteVertexArray(_), f.deleteProgram(J), f.deleteProgram(Z);
    }
  };
}
const Cm = Rt.forwardRef(
  function({
    height: A,
    backgroundImage: D,
    backgroundX: f = 0,
    backgroundY: N = 0,
    backgroundScale: Q = 1,
    backgroundTint: J = "#000000",
    backgroundTintOpacity: Z = 0,
    className: x = "",
    style: T,
    "aria-label": M,
    ..._
  }, L) {
    const hl = Rt.useRef(null), cl = Rt.useRef(null), [P, zl] = Rt.useState(!1), [ul, gl] = Rt.useState(!1), El = Um[_.theme === "light" ? "light" : "dark"], k = _m({
      ...Xr,
      ...El,
      ..._,
      ...D ? { tile: !1 } : {}
    }), Yl = JSON.stringify(k), O = Rt.useRef(k);
    O.current = k, Rt.useImperativeHandle(
      L,
      () => ({
        replay: () => cl.current?.replay(),
        seek: (vl) => cl.current?.seek(vl),
        pause: () => cl.current?.pause(),
        play: () => cl.current?.play()
      }),
      []
    ), Rt.useEffect(() => {
      if (!hl.current) return;
      let vl = null;
      try {
        vl = Nm(
          hl.current,
          O.current,
          () => zl(!0)
        );
      } catch {
        vl = null;
      }
      return vl || gl(!0), cl.current = vl, () => {
        vl?.dispose(), cl.current = null;
      };
    }, []), Rt.useLayoutEffect(() => cl.current?.update(O.current), [Yl]);
    const w = k.mark === "logo" ? k.logo : k.mark;
    return /* @__PURE__ */ Hl.jsxs(
      "div",
      {
        className: `liquid-glass-logo ${x}`.trim(),
        style: {
          height: A,
          background: k.background,
          ...T
        },
        role: "img",
        "aria-label": M ?? (k.ending === "logo" ? "Logo" : k.text),
        "data-liquid-glass-ready": P || void 0,
        children: [
          D && /* @__PURE__ */ Hl.jsxs(Hl.Fragment, { children: [
            /* @__PURE__ */ Hl.jsx(
              "div",
              {
                className: "liquid-glass-logo-background",
                "aria-hidden": "true",
                style: {
                  background: `url(${JSON.stringify(D)}) center / cover no-repeat`,
                  transform: `translate(${Math.max(-100, Math.min(100, f))}%, ${Math.max(-100, Math.min(100, N))}%) scale(${Math.max(1, Math.min(3, Q))})`
                }
              }
            ),
            /* @__PURE__ */ Hl.jsx(
              "div",
              {
                className: "liquid-glass-logo-background",
                "aria-hidden": "true",
                style: {
                  backgroundColor: J,
                  opacity: Math.max(0, Math.min(1, Z))
                }
              }
            )
          ] }),
          /* @__PURE__ */ Hl.jsx("canvas", { ref: hl, "aria-hidden": "true" }),
          ul && /* @__PURE__ */ Hl.jsx(
            "span",
            {
              className: "liquid-glass-logo-fallback",
              "aria-hidden": "true",
              style: {
                color: k.textColor,
                fontFamily: k.fontFamily,
                fontWeight: k.fontWeight,
                fontSize: k.fontSize,
                letterSpacing: `${k.letterSpacing}em`,
                gap: `${k.markGap}em`
              },
              children: k.ending === "logo" ? /* @__PURE__ */ Hl.jsx(
                "img",
                {
                  src: k.logo,
                  alt: "",
                  style: {
                    width: k.logoSize * k.logoScale * k.finalLogoScale,
                    height: k.logoSize * k.logoScale * k.finalLogoScale,
                    maxWidth: "80%",
                    maxHeight: "80%",
                    objectFit: "contain"
                  }
                }
              ) : /* @__PURE__ */ Hl.jsxs(Hl.Fragment, { children: [
                w && /* @__PURE__ */ Hl.jsx("img", { src: w, alt: "" }),
                k.text
              ] })
            }
          )
        ]
      }
    );
  }
);
const Af = new URL("./logo.svg", window.location.href).href, xf = window.matchMedia("(prefers-reduced-motion: reduce)");
function Hm() {
  const g = Rt.useRef(null), [A, D] = Rt.useState(xf.matches);
  return Rt.useEffect(() => {
    const f = (N) => D(N.matches);
    return xf.addEventListener("change", f), () => xf.removeEventListener("change", f);
  }, []), /* @__PURE__ */ Hl.jsxs(Hl.Fragment, { children: [
    /* @__PURE__ */ Hl.jsx("div", { className: "logo-stage", children: A ? /* @__PURE__ */ Hl.jsx("img", { className: "static-logo", src: Af, alt: "计划李：方框与橙色圆点", width: "184", height: "184" }) : /* @__PURE__ */ Hl.jsx(
      Cm,
      {
        ref: g,
        logo: Af,
        mark: Af,
        ending: "logo",
        theme: "light",
        background: "#f4f4f0",
        tileColor: "#f4f4f0",
        logoColor: "#0a0a0a",
        textColor: "#0a0a0a",
        maxDpr: 1.5,
        loop: !1,
        height: "100%",
        "aria-label": "计划李液态玻璃 Logo"
      }
    ) }),
    /* @__PURE__ */ Hl.jsxs("div", { className: "playback", children: [
      /* @__PURE__ */ Hl.jsx("p", { "aria-live": "polite", children: A ? "已跟随系统偏好，显示静态 Logo。" : "一滴玻璃，凝成一个标记。" }),
      /* @__PURE__ */ Hl.jsxs("button", { type: "button", disabled: A, onClick: () => g.current?.replay(), children: [
        "重新播放 ",
        /* @__PURE__ */ Hl.jsx("span", { "aria-hidden": "true", children: "↗" })
      ] })
    ] })
  ] });
}
ym.createRoot(document.getElementById("liquid-logo")).render(/* @__PURE__ */ Hl.jsx(Hm, {}));
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/*!
ReactDrops Component License 1.0

Copyright (c) 2026 ReactDrops

1. Scope and definitions

This license applies to ReactDrops software and associated documentation that
expressly carry this license or are distributed under a LICENSE file containing
it (the "Software"). "Licensor" means the copyright holder granting rights in
the Software, and only to the extent that holder has authority to grant them.
"You" means the individual or entity exercising these rights.

An "End Product" is a website, application, service, or other finished project
whose primary purpose is something other than providing reusable components,
source code, templates, or development assets to others.

2. Permitted uses

Subject to this license, Licensor grants You a worldwide, non-exclusive,
royalty-free license to use, copy, modify, and incorporate the Software into
unlimited personal, internal, and commercial End Products. You may charge for
End Products, subscriptions, development services, and work for clients.

You may distribute the Software as an integrated part of an End Product,
including in browser-delivered JavaScript. You may provide End Product source
code to a client, and share the Software with employees and contractors who
need it to develop or maintain End Products. Those recipients may use the
Software for those purposes subject to this license. This permission does not
authorize them to redistribute the Software as a reusable development asset.

3. Restricted redistribution

Unless You obtain separate written permission from Licensor, You may not sell,
sublicense, publish, share, or otherwise redistribute the Software, or a
substantial portion of it, whether unchanged or modified:

(a) as a standalone component, component library, UI kit, source-code bundle,
    registry, or other collection of reusable development assets;
(b) as part of a theme, template, starter project, or similar product offered
    to multiple recipients for reuse in their own projects; or
(c) through a builder or generation service that offers the Software as
    reusable blocks or source-code exports for others' projects.

These restrictions apply to paid and free redistribution. Renaming, restyling,
repackaging, translating, or modifying the Software does not remove them.
Building separate finished websites or applications for multiple clients is
permitted; offering a reusable template or kit containing the Software is not.

Public source-code hosting by Licensor is not permission to republish the
Software under another license. This license does not override any separate
rights granted directly by Licensor or applicable code-hosting terms.

4. Notices and ownership

Retain this license and applicable copyright and third-party notices in source
copies of the Software and permitted source distributions. No visible credit
or ReactDrops logo is required in an End Product's user interface.

Licensor retains ownership of its Software. You retain rights in Your own
contributions, subject to the license for any incorporated Software. No rights
to trademarks, trade names, or logos are granted by this license.

5. Third-party materials and separate grants

Dependencies, fonts, images, videos, and other third-party materials remain
subject to their respective licenses. Separately identified third-party code
is licensed under its stated terms, and these restrictions do not limit rights
granted by its copyright holders. Retain all required third-party notices.
Demo media are not licensed by this document; obtain Your own permission or
replace them with media You are entitled to use.

This license does not revoke rights granted under other valid licenses. It does
not assert ownership of third-party work or grant rights Licensor lacks.

6. Termination

The permissions granted here continue unless terminated for a material breach.
If You fail to cure a material breach within 30 days after receiving written
notice from Licensor, Your permissions terminate. On termination, cease uses
and distributions requiring this license. Rights under independently granted
licenses and rights that applicable law does not allow to be restricted remain
unaffected. Sections 3 through 7 survive termination.

7. Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. TO THE MAXIMUM EXTENT
PERMITTED BY APPLICABLE LAW, LICENSOR AND CONTRIBUTORS SHALL NOT BE LIABLE FOR
ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT, OR OTHERWISE,
ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR ITS USE.

This license does not limit rights or exceptions that applicable law makes
non-waivable. No other permissions are granted by implication.
*/
