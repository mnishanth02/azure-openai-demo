import ThemeToggle from "@/components/common/theme-toggle";

import HeaderLayout from "./header-layout";

export function Header() {
  return (
    <HeaderLayout>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start">
          <p>ADM Azure AI</p>
        </div>
        <div className="flex items-center justify-between gap-5">
          <ThemeToggle />
        </div>
      </div>
    </HeaderLayout>
  );
}
