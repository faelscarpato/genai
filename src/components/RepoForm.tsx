import { useMemo, useState } from "react";
import { parseRepoUrl } from "@/lib/analyzer";

interface Props {
  onSubmit: (v: { repoUrl: string; branch?: string; apiKey?: string }) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function RepoForm({
  onSubmit,
  disabled,
  placeholder = "https://github.com/facebook/react",
}: Props) {
  const [repoUrl, setRepoUrl] = useState("");
  const [touched, setTouched] = useState(false);

  const parsed = useMemo(() => parseRepoUrl(repoUrl.trim()), [repoUrl]);

  const urlError =
    touched && repoUrl.trim() && !parsed
      ? "Insira uma URL válida de repositório público."
      : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!parsed || disabled) return;

    onSubmit({
      repoUrl: repoUrl.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="repo-url" className="sr-only">
            Repository URL
          </label>
          <input
            id="repo-url"
            type="url"
            required
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            spellCheck={false}
            className="focus-ring h-12 w-full rounded-xl border border-input bg-surface px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {urlError && <p className="mt-2 text-xs text-destructive">{urlError}</p>}
        </div>

        <button
          type="submit"
          disabled={disabled || !repoUrl.trim()}
          className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {disabled ? "Analisando..." : "Iniciar análise"}
          <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}