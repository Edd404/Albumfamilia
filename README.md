# Álbum de Memórias da Família

Projeto Next.js pronto para Vercel, com:
- login privado via Supabase Auth
- álbum com virada de página
- layouts emocionais
- editor visual
- upload de mídia para Cloudinary
- PWA básico

## Como usar

1. Instale dependências:
```bash
npm install
```

2. Crie o arquivo `.env.local` com os valores do `.env.example`.

3. No Supabase, rode o arquivo `supabase/schema.sql`.

4. Configure um upload signing no Cloudinary com:
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER`

5. Rode:
```bash
npm run dev
```

## Rotas principais
- `/` — abertura cinematográfica
- `/login` — acesso privado
- `/album` — leitura do álbum
- `/editor` — edição visual

## Observações
- O layout de uma página só pode ser alterado se ela estiver vazia.
- A mídia é enviada para o Cloudinary.
- As tabelas usam RLS para manter o álbum privado.

## Deploy
Suba este projeto para a Vercel e conecte as variáveis de ambiente.
