import { loadRemote } from "@module-federation/runtime";
import { ElementType, useEffect, useState } from "react";

interface DynamicImportProps {
  module: string;
  scope: string;
}

export const useFederatedComponent = ({
  scope,
  module,
}: DynamicImportProps) => {
  const [component, setComponent] = useState<ElementType | null>(null);

  useEffect(() => {
    console.log("Loading component");

    if (!module || !scope) return;

    let isMounted = true; // Flag to track if the component is still mounted

    const loadComponent = async () => {
      try {
        const { default: Component } = (await loadRemote(
          `${scope}/${module}`
        )) as {
          default: ElementType;
        };

        if (isMounted) {
          setComponent(() => Component);
        }
      } catch (error) {
        if (isMounted) {
          console.error(
            `Error loading remote module ${scope}/${module}:`,
            error
          );
        }
      }
    };

    loadComponent();

    // Cleanup function
    return () => {
      isMounted = false;
      console.log("Unloading component");
    };
  }, [module, scope]);

  return component;
};

// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// import { loadRemote } from "@module-federation/runtime";
// import React, { ElementType, useEffect, useState } from "react";

// interface DynamicImportProps {
//   module: string;
//   scope: string;
// }
// type RemoteProxy = {
//   get: (
//     request: string
//   ) => () => Promise<{ default: React.ComponentType<unknown> }>;
//   init: <T>(arg: T) => Promise<number>;
// };

// function loadComponent(scope, module) {
//   return async () => {
//     // Initializes the share scope. This fills it with known provided modules from this build and all remotes
//     const Module = await loadRemote(`${scope}/${module}`);
//     console.log("`LOAD REMOTE`", `${scope}/${module}`, Module);
//     return Module;
//   };
// }
// function loadComp(scope, module) {
//   return async () => {
//     const container = window[scope];
//     const factory = await container?.get(`./${module}`);
//     return factory();
//   };
// }

// const useDynamicScript = (url, name) => {
//   const [ready, setReady] = useState(false);
//   const [errorLoading, setErrorLoading] = useState(false);

//   useEffect(() => {
//     if (!url) {
//       return () => {};
//     }

//     if (!(name in window)) {
//       setReady(false);
//       setErrorLoading(false);

//       const element = document.createElement("script");

//       element.src = url;
//       element.type = "text/javascript";
//       element.async = true;

//       element.onload = () => {
//         setReady(true);
//         const proxy: RemoteProxy = {
//           get: (request) => {
//             return window[name].get(request);
//           },
//           init: (arg) => {
//             try {
//               return window[name].init(arg);
//             } catch (e) {
//               console.error(`Failed to initialize remote: ${name}`);
//               reject(e);
//             }
//           },
//         };
//         resolve(proxy);
//       };

//       element.onerror = () => {
//         setReady(false);
//         setErrorLoading(true);
//       };

//       document.head.appendChild(element);
//     }

//     return () => {
//       document.head.removeChild(element);
//     };
//   }, [url, name]);

//   return {
//     errorLoading,
//     ready,
//   };
// };

// export const useFederatedComponent = (remoteUrl, scope, module) => {
//   // const key = `${remoteUrl}-${scope}-${module}`;
//   const [Component, setComponent] = useState(null);

//   const { ready, errorLoading } = useDynamicScript(remoteUrl, scope);
//   useEffect(() => {
//     // if (Component) {
//     setComponent(null);
//     // }
//     // Only recalculate when key changes
//   }, [remoteUrl, scope, module]);

//   useEffect(() => {
//     if (ready && !Component) {
//       // const Comp = React.lazy(loadComponent(scope, module));
//       const Comp = React.lazy(loadComp(scope, module));
//       setComponent(Comp);
//     }
//     // key includes all dependencies (scope/module)
//   }, [Component, ready, remoteUrl, scope, module]);

//   return { errorLoading, Component };
// };
