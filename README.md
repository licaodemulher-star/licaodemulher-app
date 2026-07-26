# licaodemulher-app

App de finanças **Lição de Mulher** — um PWA (aplicativo instalável) para mulheres:
controle de metas, envelopes digitais, Desafio 52 semanas, a conselheira "Sofia" e o plano Premium.
No ar em **https://www.licaodemulher.com.br**

## ⚠️ ANTES DE EDITAR: leia isto

**Edite o `app-fonte.html`, nunca o `index.html`.**

O `index.html` é **gerado automaticamente** e qualquer alteração feita direto nele
se perde no próximo build. Depois de editar a fonte, rode:

```bash
node build.js
```

e só então faça o commit dos dois arquivos.

**Por quê:** o app é escrito em JSX (React). Até 26/07/2026 o próprio celular da
usuária baixava 3 MB do compilador Babel e compilava o app a cada abertura — em
celular popular isso dava **13 a 21 segundos de espera** antes de a tela aparecer.
Agora a compilação acontece uma vez aqui, e o celular recebe o código pronto:
**o app abre em menos de 1 segundo**.

O `build.js` precisa só do Node instalado. Ele baixa o compilador na primeira vez
e guarda em `.cache/` (fora do repositório).

## Deploy
Publicação automática pela **Vercel** a cada push na branch `main`.

## Estrutura
| Arquivo | Para quê |
|---------|----------|
| `app-fonte.html` | **O arquivo que você edita** (app em JSX, legível). |
| `build.js` | Gera o `index.html` a partir da fonte: `node build.js`. |
| `index.html` | **Gerado — não edite.** É o que vai para o ar. |
| `manifest.json` · `sw.js` · `icon-192.png` · `icon-512.png` | PWA (instalação e ícones). |
| `privacy.html` · `termos.html` | Política de privacidade e termos de uso. |
| `robots.txt` · `sitemap.xml` · `ads.txt` · `googlee562d3a8db29193a.html` | SEO e verificação. |
| `vercel.json` | Cabeçalhos de segurança (HSTS, X-Frame-Options, etc.). |

---
© Lição de Mulher — finanças com propósito para mulheres.
