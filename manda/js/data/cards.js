/* =========================================================
 * ¡MANDA! — カード（ガチャで出る島の生き物・人・物）
 *
 *  手に入れると、島の景色に絵文字で現れる。カードには、その子に言う命令のフレーズが付く
 *  （聞き取り・並べ替えの練習に使う）。
 *
 *  { id, L, r, icon, name, es, ja, tag }
 *    r     レアリティ N / R / SR / SSR / UR（各レッスン N×2・R×1・SR×1・SSR×1）
 *    es    そのレッスンまでに習った形の命令文。命令の形は {…}、呼びかけは […]
 *    tag   'tú' / 'usted' / 'vosotros' / 'ustedes' / 'no' / 'くっつく'
 *  UR は、ボスを倒した証（boss: 'B1' など。L は持たない）。
 * ========================================================= */
window.MQ = window.MQ || {};

MQ.cards = [
  /* ---- L1 tú への命令 ---- */
  { id: 'c1-1', L: 1, r: 'N', icon: '🐟', name: 'さかな', es: '[Pez], {escucha} la música.', ja: '魚よ、音楽を聞け。', tag: 'tú' },
  { id: 'c1-2', L: 1, r: 'N', icon: '🐓', name: 'にわとり', es: '[Gallo], {canta} una canción.', ja: 'にわとりよ、歌を歌え。', tag: 'tú' },
  { id: 'c1-3', L: 1, r: 'R', icon: '🐕', name: 'いぬ', es: '[Perro], {come} el pan.', ja: '犬よ、パンを食べろ。', tag: 'tú' },
  { id: 'c1-4', L: 1, r: 'SR', icon: '🦜', name: 'おうむ', es: '[Loro], {habla} con Pepe.', ja: 'オウムよ、ペペと話せ。', tag: 'tú' },
  { id: 'c1-5', L: 1, r: 'SSR', icon: '🦄', name: 'ユニコーン', es: '[Unicornio], {baila} con Lola.', ja: 'ユニコーンよ、ロラと踊れ。', tag: 'tú' },

  /* ---- L2 つづりが変わる動詞 ---- */
  { id: 'c2-1', L: 2, r: 'N', icon: '🐑', name: 'ひつじ', es: '[Oveja], {duerme} en el campo.', ja: 'ひつじよ、野原で寝なさい。', tag: 'tú' },
  { id: 'c2-2', L: 2, r: 'N', icon: '🐇', name: 'うさぎ', es: '[Conejo], {juega} con Lola.', ja: 'うさぎよ、ロラと遊べ。', tag: 'tú' },
  { id: 'c2-3', L: 2, r: 'R', icon: '🐢', name: 'かめ', es: '[Tortuga], {cierra} la puerta, por favor.', ja: 'かめよ、ドアを閉めて、お願い。', tag: 'tú' },
  { id: 'c2-4', L: 2, r: 'SR', icon: '🦊', name: 'きつね', es: '[Zorro], {empieza} la fiesta.', ja: 'きつねよ、お祭りを始めろ。', tag: 'tú' },
  { id: 'c2-5', L: 2, r: 'SSR', icon: '🧚', name: 'ようせい', es: '[Hada], {juega} con Pepe, por favor.', ja: '妖精よ、ペペと遊んで、お願い。', tag: 'tú' },

  /* ---- L3 ven・ten・pon・sal ---- */
  { id: 'c3-1', L: 3, r: 'N', icon: '🐝', name: 'みつばち', es: '[Abeja], {ven} aquí, por favor.', ja: 'みつばちよ、ここに来て、お願い。', tag: 'tú' },
  { id: 'c3-2', L: 3, r: 'N', icon: '🦀', name: 'かに', es: '[Cangrejo], {sal} de la casa.', ja: 'かにさん、家から出なさい。', tag: 'tú' },
  { id: 'c3-3', L: 3, r: 'R', icon: '🐻', name: 'くま', es: '[Oso], {ten} cuidado, por favor.', ja: 'くまさん、気をつけて、お願い。', tag: 'tú' },
  { id: 'c3-4', L: 3, r: 'SR', icon: '🦅', name: 'わし', es: '[Águila], {pon} la carta en la mesa.', ja: 'わしよ、手紙をテーブルに置け。', tag: 'tú' },
  { id: 'c3-5', L: 3, r: 'SSR', icon: '🐉', name: 'ドラゴン', es: '[Dragón], {ten} cuidado con Pepe.', ja: 'ドラゴンよ、ペペに気をつけて。', tag: 'tú' },

  /* ---- L4 haz・di・ve・sé ---- */
  { id: 'c4-1', L: 4, r: 'N', icon: '🐴', name: 'うま', es: '[Caballo], {ve} a la playa.', ja: '馬よ、浜へ行け。', tag: 'tú' },
  { id: 'c4-2', L: 4, r: 'N', icon: '🐮', name: 'うし', es: '[Vaca], {di} la verdad.', ja: '牛よ、本当のことを言え。', tag: 'tú' },
  { id: 'c4-3', L: 4, r: 'R', icon: '🐘', name: 'ぞう', es: '[Elefante], {sé} bueno, por favor.', ja: 'ぞうさん、いい子でいてね。', tag: 'tú' },
  { id: 'c4-4', L: 4, r: 'SR', icon: '🦁', name: 'ライオン', es: '[León], {di} la verdad, Lola.', ja: 'ライオンよ、ロラに本当のことを言え。', tag: 'tú' },
  { id: 'c4-5', L: 4, r: 'SSR', icon: '🏰', name: 'おしろ', es: '[Pepe], {haz} un castillo grande.', ja: 'ペペ、大きなお城を作りなさい。', tag: 'tú' },

  /* ---- L5 usted ---- */
  { id: 'c5-1', L: 5, r: 'N', icon: '🐙', name: 'たこ', es: '[Señor Pulpo], {coma} el pan.', ja: 'タコさん、パンを召し上がってください。', tag: 'usted' },
  { id: 'c5-2', L: 5, r: 'N', icon: '🐬', name: 'イルカ', es: '[Delfín], {cante} una canción, por favor.', ja: 'イルカさん、歌を歌ってください。', tag: 'usted' },
  { id: 'c5-3', L: 5, r: 'R', icon: '🐳', name: 'くじら', es: '[Señora Ballena], {escuche} la música.', ja: 'くじらさん、音楽を聞いてください。', tag: 'usted' },
  { id: 'c5-4', L: 5, r: 'SR', icon: '🦈', name: 'サメ', es: '[Tiburón], {abra} la puerta, por favor.', ja: 'サメさん、ドアを開けてください。', tag: 'usted' },
  { id: 'c5-5', L: 5, r: 'SSR', icon: '🔱', name: 'うみの三つまた槍', es: '[Marina], {abra} la puerta, por favor.', ja: 'マリーナさま、ドアを開けてください。', tag: 'usted' },

  /* ---- L6 yo の形から ---- */
  { id: 'c6-1', L: 6, r: 'N', icon: '🐒', name: 'さる', es: '[Mono], {venga} conmigo, por favor.', ja: 'おさるさん、わたしと来てください。', tag: 'usted' },
  { id: 'c6-2', L: 6, r: 'N', icon: '🦌', name: 'しか', es: '[Ciervo], {vuelva} pronto, por favor.', ja: 'しかさん、すぐ帰ってきてください。', tag: 'usted' },
  { id: 'c6-3', L: 6, r: 'R', icon: '🌺', name: 'ハイビスカス', es: '{Tenga} una flor, por favor.', ja: 'どうぞ、お花を持っていってください。', tag: 'usted' },
  { id: 'c6-4', L: 6, r: 'SR', icon: '🦋', name: 'ちょう', es: '[Mariposa], {salga} de la casa.', ja: 'ちょうさん、家から出てください。', tag: 'usted' },
  { id: 'c6-5', L: 6, r: 'SSR', icon: '🦚', name: 'くじゃく', es: '[Pavo real], {diga} la verdad, por favor.', ja: 'くじゃくさん、本当のことを言ってください。', tag: 'usted' },

  /* ---- L7 ir・ser・estar・dar／ustedes ---- */
  { id: 'c7-1', L: 7, r: 'N', icon: '🐧', name: 'ペンギン', es: '[Pingüinos], {vengan} conmigo, por favor.', ja: 'ペンギンのみなさん、いっしょに来てください。', tag: 'ustedes' },
  { id: 'c7-2', L: 7, r: 'N', icon: '🐪', name: 'らくだ', es: '[Camellos], {vayan} por esta calle.', ja: 'らくだのみなさん、この道を行ってください。', tag: 'ustedes' },
  { id: 'c7-3', L: 7, r: 'R', icon: '🦩', name: 'フラミンゴ', es: '[Flamencos], {estén} aquí, por favor.', ja: 'フラミンゴのみなさん、ここにいてください。', tag: 'ustedes' },
  { id: 'c7-4', L: 7, r: 'SR', icon: '🦢', name: 'はくちょう', es: '[Cisnes], {sean} amables, por favor.', ja: 'はくちょうのみなさん、仲よくしてください。', tag: 'ustedes' },
  { id: 'c7-5', L: 7, r: 'SSR', icon: '🧞', name: 'ランプの精', es: '[Genios], {den} un regalo a Lola.', ja: '精霊のみなさん、ロラにプレゼントをあげてください。', tag: 'ustedes' },

  /* ---- L8 vosotros ---- */
  { id: 'c8-1', L: 8, r: 'N', icon: '🐦', name: 'とり', es: '[Pájaros], {cantad} una canción.', ja: '鳥たちよ、歌を歌え。', tag: 'vosotros' },
  { id: 'c8-2', L: 8, r: 'N', icon: '🐿️', name: 'りす', es: '[Ardillas], {comed} el pan, amigos.', ja: 'りすたちよ、パンを食べなさい。', tag: 'vosotros' },
  { id: 'c8-3', L: 8, r: 'R', icon: '🐸', name: 'かえる', es: '[Ranas], {bailad} con la música.', ja: 'かえるたちよ、音楽に合わせて踊れ。', tag: 'vosotros' },
  { id: 'c8-4', L: 8, r: 'SR', icon: '🐺', name: 'おおかみ', es: '[Lobos], {venid} aquí, amigos.', ja: 'おおかみたちよ、ここに来なさい。', tag: 'vosotros' },
  { id: 'c8-5', L: 8, r: 'SSR', icon: '🎆', name: 'はなび', es: '[Amigos], {escuchad} la música.', ja: 'みんな、音楽を聞け。', tag: 'vosotros' },

  /* ---- L9 くっつく命令 ---- */
  { id: 'c9-1', L: 9, r: 'N', icon: '🐷', name: 'ぶた', es: '[Cerdo], {cómelo}, por favor.', ja: 'ぶたさん、それを食べて、お願い。', tag: 'くっつく' },
  { id: 'c9-2', L: 9, r: 'N', icon: '🐥', name: 'ひよこ', es: '[Pollito], {levántate}, por favor.', ja: 'ひよこさん、起きて、お願い。', tag: 'くっつく' },
  { id: 'c9-3', L: 9, r: 'R', icon: '🐈', name: 'ねこ', es: '[Gato], {dime} la verdad.', ja: 'ねこよ、私に本当のことを言って。', tag: 'くっつく' },
  { id: 'c9-4', L: 9, r: 'SR', icon: '🐼', name: 'パンダ', es: '[Señor Panda], {siéntese}, por favor.', ja: 'パンダさん、おすわりください。', tag: 'くっつく' },
  { id: 'c9-5', L: 9, r: 'SSR', icon: '🌅', name: 'あさやけ', es: '[Sol], {levántate} en la mañana.', ja: 'お日さま、朝にのぼれ。', tag: 'くっつく' },

  /* ---- L10 「〜するな」 ---- */
  { id: 'c10-1', L: 10, r: 'N', icon: '🐭', name: 'ねずみ', es: '[Ratón], no {salgas} de casa.', ja: 'ねずみよ、家から出るな。', tag: 'no' },
  { id: 'c10-2', L: 10, r: 'N', icon: '🐞', name: 'てんとうむし', es: '[Mariquita], no {hables} más.', ja: 'てんとうむしよ、もう話すな。', tag: 'no' },
  { id: 'c10-3', L: 10, r: 'R', icon: '🦔', name: 'はりねずみ', es: '[Erizo], no {tengas} miedo.', ja: 'はりねずみよ、こわがるな。', tag: 'no' },
  { id: 'c10-4', L: 10, r: 'SR', icon: '🦉', name: 'ふくろう', es: '[Búho], no {abras} la puerta.', ja: 'ふくろうよ、ドアを開けるな。', tag: 'no' },
  { id: 'c10-5', L: 10, r: 'SSR', icon: '🛡️', name: 'まもりのたて', es: '[Pepe], no {tengas} miedo, por favor.', ja: 'ペペ、こわがらないで、お願い。', tag: 'no' },

  /* ---- UR：ボスを倒した証 ---- */
  { id: 'u-B1', boss: 'B1', r: 'UR', icon: '🌈', name: '虹のかけら', es: '[Arcoíris], {ven} aquí, por favor.', ja: '虹よ、ここに来て、お願い。', tag: 'tú' },
  { id: 'u-B2', boss: 'B2', r: 'UR', icon: '🌋', name: 'しずまった火山', es: '[Volcán], {sea} amable, por favor.', ja: '火山よ、おだやかでいてください。', tag: 'usted' },
  { id: 'u-B3', boss: 'B3', r: 'UR', icon: '🌌', name: 'ほしぞらのかけら', es: '[Noche], no {tengas} miedo, Pepe.', ja: '夜よ、こわがらないで、ペペ。', tag: 'no' }
];
