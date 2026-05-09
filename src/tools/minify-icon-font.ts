import { ast, query } from '@phenomnomnominal/tsquery';
import { subset } from '@web-alchemy/fonttools';
import { Font, openSync as fontkitOpenSync } from 'fontkit';
import { readFileSync, writeFileSync } from 'fs';

const codePointsMap: Record<string, string> = {
  no_sound: 'e710',
};

(async () => {
  const iconTypeFiles = [
    './src/app/types/icon.types.ts',
    './node_modules/tangent-cc-lib/dist/lib/type/key-label-icon.type.d.ts',
  ];
  let iconSet = new Set<string>();
  iconTypeFiles.forEach((iconTypeFile) => {
    const iconTypesAst = ast(readFileSync(iconTypeFile, { encoding: 'utf-8' }));
    query(iconTypesAst, 'UnionType StringLiteral')
      .map((node) => (node as any).text as string)
      .forEach((icon) => {
        iconSet.add(icon);
      });
  });
  console.log(iconSet);
  const font = fontkitOpenSync(
    './src/assets/material-symbols-rounded-latin-full-normal.woff2',
  ) as Font;

  const glyphs = ['5f-7a', '30-39'];

  for (const icon of iconSet) {
    const iconGlyphs = font.layout(icon).glyphs;
    if (iconGlyphs.length === 0) {
      console.error(`${icon} not found in font.`);
      process.exit(-1);
    }
    const codePoints = iconGlyphs
      .flatMap((it) => font.stringsForGlyph(it.id))
      .flatMap((it) => [...it])
      .map((it) => it.codePointAt(0)?.toString(16) as string);

    const codePoint = codePointsMap[icon];
    if (codePoint) {
      glyphs.push(codePoint);
    } else if (codePoints.length === 0) {
      console.error(`No code point found for ${icon}.`);
      process.exit(-1);
    }

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
