import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DashboardGrid({ children }: Props) {
  return (
    <section className="grid gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {children}
    </section>
  );
}
