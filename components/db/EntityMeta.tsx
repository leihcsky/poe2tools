type Props = {
  title: string;
  subtitle?: string;
};

export default function EntityMeta({ title, subtitle }: Props) {
  return (
    <div>
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {subtitle ?? "数据库"}
      </div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {title}
      </h1>
    </div>
  );
}

