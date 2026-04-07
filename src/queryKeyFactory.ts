export const menuDetailsKeys = {
  identifiedUser: () => ["user"],
  header: () => ["header"],
  footer: () => ["footer"],
  campaigns: (navId?: string | undefined) => ["campaigns", navId],
};
