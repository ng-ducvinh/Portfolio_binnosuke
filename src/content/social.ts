export const social = [
  { url: "mailto:nguyenducvinh.contact@gmail.com", name: "mail" },
  { url: "https://github.com/ng-ducvinh", name: "github" },
  { url: "https://www.linkedin.com/in/ngducvinh/", name: "linkedin" },
  { url: "https://x.com/binnosukeee", name: "x" },
  //{ url: "https://www.instagram.com/davidhckh/", name: "instagram" },
] as const satisfies { url: string; name: "mail" | "github" | "instagram" | "linkedin" | "x" }[];
