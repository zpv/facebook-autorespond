const filters = [
  {
    msg: 'Mitsuku',
    replace: 'Steven'
  },
  {
    msg: 'chatbot',
    replace: 'human'
  },
  {
    msg: 'mitsuku',
    replace: 'steven'
  },
  {
    msg: "Sorry, you can't code directly into me.",
    replace: 'Huh?! What are you trying to do...?'
  }
];

export const filterMessage = str => {
  if (!str) {
    return '';
  }
  return filters.reduce((prev, cur) => {
    return prev.replace(cur.msg, cur.replace);
  }, str);
};
