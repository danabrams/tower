export function makeLibraryKey(moduleKey: any, brickKey: any) {
    return moduleKey + "::" + brickKey;
}

export function importModulesIntoLibrary(modules: any, library: any) {
    Object.keys(modules).map((moduleKey) => {
        const bricks = modules[moduleKey].bricks;
        Object.keys(bricks).map((brickKey) => {
            library[makeLibraryKey(moduleKey, brickKey)] = {
                brickKey,
                moduleKey
            };
        });
    });
}

export function getBrickFromModules(moduleKey: string, brickKey: string, modules: any) {
    return modules[moduleKey].bricks[brickKey];
}

export function maybeLookUpModule(libraryItem: any, modules: object) {
    if (libraryItem.moduleKey && libraryItem.brickKey) {
        return getBrickFromModules(
            libraryItem.moduleKey,
            libraryItem.brickKey,
            modules
        )
    } else {
        return libraryItem;
    }
}