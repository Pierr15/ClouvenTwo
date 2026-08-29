import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DashboardGrid({
  children,
}: Props) {
  return (
    <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {children}
    </section>
  );
}