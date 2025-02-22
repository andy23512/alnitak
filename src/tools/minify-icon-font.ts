import { ast, query } from '@phenomnomnominal/tsquery';
import { subset } from '@web-alchemy/fonttools';
import { Font, openSync as fontkitOpenSync } from 'fontkit';
import { readFileSync, writeFileSync } from 'fs';

(async () => {
  const iconTypesAst = ast(
    readFileSync('./src/app/types/icon.types.ts', { encoding: 'utf-8' }),
  );

  const icons = query(
    iconTypesAst,
    'Identifier[name="Icon"] ~ UnionType StringLiteral',
  ).map((node) => (node as any).text);
  const font = fontkitOpenSync(
    './src/assets/material-symbols-rounded-latin-full-normal.woff2',
  ) as Font;

  const glyphs = ['5f-7a', '30-39'];

  for (const icon of icons) {
    const iconGlyphs = font.layout(icon).glyphs;
    if (iconGlyphs.length === 0) {
      console.error(`${icon} not found in font.`);
      process.exit(-1);
    }
    const codePoints = iconGlyphs
      .flatMap((it) => font.stringsForGlyph(it.id))
      .flatMap((it) => [...it])
      .map((it) => it.codePointAt(0)?.toString(16) as string);

    glyphs.push(...codePoints);
  }

  glyphs.sort();

  const inputFileBuffer = readFileSync(
    './src/assets/material-symbols-rounded-latin-full-normal.woff2',
  );
  const outputFileBuffer = await subset(inputFileBuffer, {
    unicodes: glyphs.join(','),
    'no-layout-closure': true,
    flavor: 'woff2',
  });
  writeFileSync(
    './src/assets/material-symbols-rounded-latin-full-normal.min.woff2',
    outputFileBuffer,
  );
})();
