/*
  BUILD DO APP — Lição de Mulher
  ================================
  Você edita:  app-fonte.html   (o arquivo de trabalho, legível)
  Este script gera:  index.html  (o que vai para o ar)

  Como rodar (dentro da pasta do repositório):

      node build.js

  Por que isso existe:
  o app é escrito em JSX (React). Antes, o próprio celular da usuária baixava
  3 MB do compilador Babel e compilava o app inteiro a cada abertura — em celular
  popular isso dava mais de 18 segundos de espera. Agora a compilação acontece
  UMA VEZ aqui no computador, e o celular recebe o código pronto.

  Só precisa de Node instalado. O compilador é baixado na primeira vez e fica
  guardado em .cache/ (essa pasta NÃO vai para o repositório).
*/

const fs = require('fs');
const path = require('path');

const FONTE = 'app-fonte.html';
const SAIDA = 'index.html';
const CACHE = path.join('.cache', 'babel.min.js');
const URL_BABEL = 'https://unpkg.com/@babel/standalone@7.29.7/babel.min.js';

const kb = n => (n / 1024).toFixed(0) + ' KB';

async function pegarBabel() {
  if (fs.existsSync(CACHE)) return require(path.resolve(CACHE));
  console.log('  baixando o compilador (só nesta primeira vez)...');
  const r = await fetch(URL_BABEL);
  if (!r.ok) throw new Error('não consegui baixar o compilador: HTTP ' + r.status);
  fs.mkdirSync('.cache', { recursive: true });
  fs.writeFileSync(CACHE, Buffer.from(await r.arrayBuffer()));
  return require(path.resolve(CACHE));
}

(async () => {
  if (!fs.existsSync(FONTE)) {
    console.error('ERRO: não achei ' + FONTE + '. Rode este script dentro da pasta do repositório.');
    process.exit(1);
  }

  const html = fs.readFileSync(FONTE, 'utf8');
  const m = html.match(/([ \t]*)<script type="text\/babel">([\s\S]*?)<\/script>/);
  if (!m) {
    console.error('ERRO: não achei o <script type="text/babel"> dentro de ' + FONTE + '.');
    process.exit(1);
  }

  const Babel = await pegarBabel();
  console.log('  compilando o app...');
  let compilado;
  try {
    compilado = Babel.transform(m[2], { presets: ['react'], compact: false, comments: false }).code;
  } catch (e) {
    console.error('\nERRO DE SINTAXE no ' + FONTE + (e.loc ? ' (linha ' + e.loc.line + ' do trecho do app)' : '') + ':');
    console.error('  ' + e.message.split('\n')[0]);
    console.error('\nNada foi gerado. Conserte o erro e rode de novo.');
    process.exit(1);
  }

  // ATENÇÃO: a substituição precisa ser por FUNÇÃO. O código do app tem "R$", e num
  // replace comum o cifrão vira comando especial e corta o arquivo no meio.
  let saida = html.replace(m[0], () => m[1] + '<script>\n' + compilado + '\n' + m[1] + '</script>');

  // o compilador não precisa mais ir junto para o celular
  const antesDoCorte = saida.length;
  saida = saida.replace(/[ \t]*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^>]*><\/script>\r?\n?/, '');
  const tirou = antesDoCorte - saida.length;

  const aviso = '<!--\n'
    + '  ATENÇÃO: este arquivo é GERADO automaticamente. NÃO edite aqui.\n'
    + '  Edite o app-fonte.html e depois rode:  node build.js\n'
    + '  (qualquer mudança feita direto neste arquivo se perde no próximo build)\n'
    + '-->\n';
  saida = saida.replace(/^<!DOCTYPE html>/i, '<!DOCTYPE html>\n' + aviso);

  fs.writeFileSync(SAIDA, saida);

  console.log('\n  pronto: ' + SAIDA);
  console.log('  fonte ..... ' + kb(Buffer.byteLength(html)));
  console.log('  publicado . ' + kb(Buffer.byteLength(saida)));
  console.log('  o celular deixa de baixar 3 MB do compilador' + (tirou ? '' : ' (aviso: não achei a linha do compilador para remover)'));
})();
