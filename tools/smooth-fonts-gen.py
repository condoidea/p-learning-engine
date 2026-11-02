# shared/smooth-fonts.js の MAP（Windows 用ファイル → iPhone・Android 用ファイル）を作り直す。
# Google Fonts が書体を新しい版にしたら、これを実行して出てきた行で MAP を置き換える。
#   python tools/smooth-fonts-gen.py
import re, urllib.request

# アプリで使っている日本語の書体と太さ（入口の HTML・course.js・boot.js の Google Fonts の URL と合わせる）
FAMILIES = [
    'M+PLUS+Rounded+1c:wght@500;700;800',
    'Dela+Gothic+One',
    'Zen+Kaku+Gothic+New:wght@400;500;700',
    'Zen+Maru+Gothic:wght@500;700;900',
    'Zen+Old+Mincho:wght@400;700;900',
    'Shippori+Mincho:wght@500;700;800',
    'Shippori+Mincho+B1:wght@600;700;800',
]
UA = {
    'win': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'ios': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
}

def faces(fam, ua):
    """{(太さ, unicode-range): ファイル} を返す"""
    req = urllib.request.Request('https://fonts.googleapis.com/css2?family=' + fam + '&display=swap', headers={'User-Agent': ua})
    css = urllib.request.urlopen(req).read().decode()
    out = {}
    for block in css.split('}'):
        w = re.search(r'font-weight: (\d+)', block)
        u = re.search(r'fonts\.gstatic\.com/s/(\S+?)\.woff2', block)
        r = re.search(r'unicode-range: ([^;]+)', block)
        if w and u and r: out[(w.group(1), r.group(1))] = u.group(1)
    return out

# 日本語の部分（.0〜.119 の番号つき）は番号の前までを1行に、英字などの部分はファイルごとに1行
for fam in FAMILIES:
    win, ios = faces(fam, UA['win']), faces(fam, UA['ios'])
    name = fam.split(':')[0].replace('+', ' ')
    rows = {}
    for k in win:
        a, b = win[k], ios.get(k)
        if not b or a == b: continue
        ma, mb = re.match(r'(.+)\.\d+$', a), re.match(r'(.+)\.\d+$', b)
        if ma and mb: a, b = ma.group(1), mb.group(1)
        rows[a] = (b, k[0])
    for a in sorted(rows, key=lambda a: (rows[a][1], len(a))):
        print("    '%s': '%s',  // %s %s" % (a, rows[a][0], name, rows[a][1]))
