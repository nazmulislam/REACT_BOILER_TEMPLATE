

const navigateToPage = (navigate: any, path: string) => {
  navigate(path);
};

/**
 * This is the main top menu, after user is logged in
 * @param navigate
 * @param projects
 * @param clients
 * @param events
 * @returns
 */
// //isActive = 1 means this menu will visible
// //isActive = 0 means this menu will hidden
export const SampleMenu = (navigate?: any, t?:any) => {

  
  return [
  

  
  {

    icon: "pi pi-fw pi-exclamation-triangle",
    module_identifier:"module_scope",
    label: t('Sample'),
    isPrivate: true,
    isActive: 0,
    command: () => navigateToPage(navigate, "/ROUTE")

  }
]};
