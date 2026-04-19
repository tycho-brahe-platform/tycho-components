import { Struct, Token } from '../../configs/types/Struct';

const getTag = (token: Token): string => {
  if (token.split) return token.split.t || '';
  return token.t ?? '';
};

const skipToken = (token: Token, splits?: boolean) => {
  if (token.ec) return true;
  if (!token.v) return false;
  if (!splits && token.v.startsWith('@') && token.split) return true;
  return false;
};

const getColspan = (thisToken: Token) => {
  return thisToken.splits ? thisToken.splits.length : 1;
};

const getAsText = (struct: Struct, displayTags?: boolean): string => {
  const tokens = sort(struct);
  let value: string = '';
  tokens.forEach((token: Token, idx: number) => {
    if (!isVisible(token)) return;
    value += `${getValue(token, displayTags)} `;
  });
  return value.trim();
};

const getAsTextWithTags = (struct: Struct): string => {
  const tokens = sort(struct);
  let value: string = '';
  tokens.forEach((token: Token) => {
    if (!isVisible(token)) return;
    let tokenValue = token.split !== undefined ? token.split.v || '' : token.v;
    const tag = getTag(token);
    if (tag) {
      tokenValue = `${tokenValue}/${tag}`;
    }
    value += `${tokenValue} `;
  });
  return value.trim();
};

const getValue = (token: Token, displayTags?: boolean): string => {
  return token.split !== undefined && token.ec === undefined && !displayTags
    ? token.split.v || ''
    : token.v;
};

const sort = (struct: Struct): Token[] => {
  if (!struct?.tokens) return [];
  return struct?.tokens.sort((a: Token, b: Token) =>
    a.p > b.p ? 1 : b.p > a.p ? -1 : 0
  );
};

const isVisible = (token: Token) => {
  if (token.ec) return false;
  if (token.split && !isFirstFromSplit(token)) return false;
  return true;
};

const isFirstFromSplit = (token: Token) => {
  if (!token.split) return false;
  return token.split.idx !== undefined && token.split.idx === 0;
};

const SentenceUtils = {
  sort,
  getAsText,
  getAsTextWithTags,
  isVisible,
  isFirstFromSplit,
  getColspan,
  skipToken,
  getTag,
};

export default SentenceUtils;
