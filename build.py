#!/usr/bin/env python3
"""GK Academy demo: surenka puslapius iš src/templates + src/data/site.json į šakninius *.html.

Naudojimas:  python3 build.py
Reikia:      Python 3 + jinja2 (pip install jinja2)

Kas generuojama:
  index.html                          pradžios puslapis
  mokymai-ilgalaikis-makiazas.html    mokymų puslapis (ilgalaikis makiažas: antakiai, lūpos, akys)
  mokymai-antakiu-dizainas.html       mokymų puslapis (antakių dizainas, architektūra ir laminavimas)
  mokymai-makiazas-sau.html           mokymų puslapis (makiažas sau)
Visi trys mokymų puslapiai surenkami iš vieno šablono (src/templates/mokymas.html).
Redaguojami tik failai kataloguose src/ ir assets/.
"""
import datetime as dt
import json
import re
import struct
import zlib
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, StrictUndefined
from markupsafe import Markup, escape

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
NBSP = " "

MONTHS_GEN = ["sausio", "vasario", "kovo", "balandžio", "gegužės", "birželio", "liepos", "rugpjūčio", "rugsėjo", "spalio", "lapkričio", "gruodžio"]
MONTHS_NOM = ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"]
WEEKDAYS = ["pirmadienis", "antradienis", "trečiadienis", "ketvirtadienis", "penktadienis", "šeštadienis", "sekmadienis"]

# programos, kurios turi vieną kainą (kortelėje rodoma be žodžio „nuo“)
SINGLE_PRICE = {"pmu-akys-lupos", "pmu-removeriai", "new-trend", "kuno-auskarai", "vyru-depiliacija", "randai"}


# ------------------------------------------------------------------ ikonų rinkinys (Phosphor Light, MIT)
def used_icons():
    """Į rinkinį dedamos tik šablonuose ir scenarijuose naudojamos ikonos."""
    names = set()
    for f in list((SRC / "templates").rglob("*.html")) + list((ROOT / "assets" / "js").glob("*.js")):
        text = f.read_text(encoding="utf-8")
        names.update(re.findall(r"icon\('([a-z0-9-]+)'", text))
        names.update(re.findall(r"#i-([a-z0-9-]+)", text))
    return names


def sprite():
    out, used = [], used_icons()
    for f in sorted((SRC / "icons").glob("*.svg")):
        if f.stem not in used:
            continue
        inner = re.search(r"<svg[^>]*>(.*)</svg>", f.read_text(encoding="utf-8"), re.S).group(1)
        out.append('<symbol id="i-%s" viewBox="0 0 256 256">%s</symbol>' % (f.stem, inner.strip()))
    missing = used - {f.stem for f in (SRC / "icons").glob("*.svg")}
    if missing:
        raise SystemExit("Trūksta ikonų src/icons: %s" % ", ".join(sorted(missing)))
    return Markup(
        '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">\n%s\n</svg>'
        % "\n".join(out)
    )


def icon(name, cls=""):
    return Markup('<svg class="ico %s" aria-hidden="true" focusable="false"><use href="#i-%s"/></svg>' % (cls, name))


# ------------------------------------------------------------------ nuotraukų matmenys (WebP antraštė, be papildomų bibliotekų)
def webp_size(path):
    b = path.read_bytes()[:40]
    kind = b[12:16]
    if kind == b"VP8 ":
        w, h = struct.unpack("<HH", b[26:30])
        return w & 0x3FFF, h & 0x3FFF
    if kind == b"VP8L":
        n = struct.unpack("<I", b[21:25])[0]
        return (n & 0x3FFF) + 1, ((n >> 14) & 0x3FFF) + 1
    if kind == b"VP8X":
        return int.from_bytes(b[24:27], "little") + 1, int.from_bytes(b[27:30], "little") + 1
    raise ValueError("Neatpažintas WebP: %s" % path)


def photo_sizes():
    return {f.stem: webp_size(f) for f in (ROOT / "assets" / "img" / "photos").glob("*.webp")}


# ------------------------------------------------------------------ filtrai
def eur(v):
    """1200 -> „1 200 €“ (su nepertraukiamais tarpais)."""
    s = "%d" % round(float(v))
    s = re.sub(r"(?<=\d)(?=(\d{3})+$)", NBSP, s)
    return s + NBSP + "€"


def plural(n, one, few, many):
    """Lietuviška daugiskaita: 1 programa, 2 programos, 10 programų, 21 programa."""
    n = int(n)
    if n % 10 == 1 and n % 100 != 11:
        return one
    if 2 <= n % 10 <= 9 and not 11 <= n % 100 <= 19:
        return few
    return many


def split_words(text):
    """Antraštės žodžiai apgaubiami, kad galėtų iškilti po vieną (CSS, be scenarijaus tekstas lieka matomas)."""
    words = str(text).split(" ")
    return Markup(" ".join('<span class="w"><span class="w__i" style="--i:%d">%s</span></span>' % (i, escape(w)) for i, w in enumerate(words)))


def date_range(start, end=None, short=False):
    """„gruodžio 7–11 d.“, „lapkričio 27 d.“; short=True -> „gruod. 7–11 d.“ nenaudojama, palikta pilna forma."""
    s = dt.date.fromisoformat(start)
    e = dt.date.fromisoformat(end) if end else s
    if s == e:
        return "%s %d%sd." % (MONTHS_GEN[s.month - 1], s.day, NBSP)
    if s.month == e.month:
        return "%s %d–%d%sd." % (MONTHS_GEN[s.month - 1], s.day, e.day, NBSP)
    return "%s %d%sd. – %s %d%sd." % (MONTHS_GEN[s.month - 1], s.day, NBSP, MONTHS_GEN[e.month - 1], e.day, NBSP)


def typo(html):
    """Smulki tipografija teksto mazguose: brūkšnys neprasideda eilutės pradžioje, skaičius nelūžta nuo vieneto."""
    out, skip = [], False
    for part in re.split(r"(<[^>]+>)", html):
        if part.startswith("<"):
            low = part.lower()
            if re.match(r"<(title|script|style|textarea)\b", low):
                skip = True
            elif re.match(r"</(title|script|style|textarea)\b", low):
                skip = False
            out.append(part)
        elif skip:
            out.append(part)
        else:
            part = part.replace(" – ", NBSP + "– ")
            part = re.sub(r"(\d) (€|%|d\.|val\.|m\.|dien|valand|mokin|program|srit)", r"\1" + NBSP + r"\2", part)
            out.append(part)
    return "".join(out)


# ------------------------------------------------------------------ duomenų paruošimas
def seats_left(course_id, start, cap, fixed=None):
    """DEMO: laisvų vietų skaičius išvedamas iš programos ir datos (visada tas pats), kad puslapiai sutaptų tarpusavyje.
    Trijų sukurtų programų datoms skaičiai nurodyti site.json („seats_demo“). Tikroje svetainėje tai WooCommerce varianto likutis."""
    key = "%s|%s" % (course_id, start)
    if fixed and key in fixed:
        return min(cap, fixed[key])
    h = zlib.crc32(key.encode("utf-8"))
    table = {1: [1, 1, 0, 1], 2: [2, 1, 1, 2, 0, 1], 3: [3, 2, 1, 2, 3, 0, 1], 8: [5, 3, 6, 2]}.get(cap, [cap])
    return table[h % len(table)]


def prepare(data, today):
    cats = {c["id"]: c for c in data["categories"]}
    courses = data["courses"]
    by_id = {c["id"]: c for c in courses}

    for c in courses:
        prices = [c[k] for k in ("group", "ind", "from") if c.get(k)]
        c["price"] = min(prices)
        c["single"] = c["id"] in SINGLE_PRICE
        c["cat_name"] = cats[c["cat"]]["name"]
        c["img"] = c.get("img") or cats[c["cat"]]["img"]
        fmt = c["fmt"]
        c["fmt_label"] = (
            "Grupėje arba individualiai" if fmt == ["g", "i"] else "Individualūs mokymai" if fmt == ["i"] else "Mažoje grupėje" if fmt == ["g"] else ""
        )
        c["cap"] = c.get("group_size") or (1 if fmt == ["i"] else 2)
        c["page"] = c.get("page")
        for key, default in (("note", ""), ("was", 0), ("qual", "")):
            c.setdefault(key, default)
        c["sessions"] = []

    sessions = []
    for cid, items in data["schedule"].items():
        c = by_id[cid]
        for item in items:
            start, _, end = item.partition("/")
            end = end or start
            if dt.date.fromisoformat(end) < today:
                continue
            s = dt.date.fromisoformat(start)
            ses = {
                "course": cid,
                "start": start,
                "end": end,
                "day": s.day if start == end else "%d–%d" % (s.day, dt.date.fromisoformat(end).day),
                "month": s.month,
                "month_gen": MONTHS_GEN[s.month - 1],
                "weekday": WEEKDAYS[s.weekday()],
                "label": date_range(start, end),
                "cap": c["cap"],
                "left": seats_left(cid, start, c["cap"], data.get("seats_demo")),
            }
            sessions.append(ses)
            c["sessions"].append(ses)
    order = {c["id"]: i for i, c in enumerate(courses)}
    sessions.sort(key=lambda s: (s["start"], order[s["course"]]))

    for c in courses:
        c["next"] = c["sessions"][0] if c["sessions"] else None

    for cat in data["categories"]:
        own = [c for c in courses if c["cat"] == cat["id"]]
        cat["count"] = len(own)
        cat["price"] = min(c["price"] for c in own)

    months = []
    for s in sessions:
        if s["month"] not in [m["n"] for m in months]:
            months.append({"n": s["month"], "name": MONTHS_NOM[s["month"] - 1]})
    return cats, by_id, sessions, months


def client_data(data, sessions):
    """Duomenys scenarijams (paieška, filtrai, tvarkaraštis, registracijos blokas, krepšelis)."""
    courses = []
    for c in data["courses"]:
        courses.append(
            {
                "id": c["id"], "cat": c["cat"], "catName": c["cat_name"], "title": c["title"], "short": c["short"],
                "price": c["price"], "single": c["single"], "dur": c["dur"], "days": c["days"], "fmt": c["fmt"],
                "aud": c["aud"], "img": c["img"], "page": c["page"], "cap": c["cap"],
            }
        )
    details = {}
    for cid, d in data["details"].items():
        details[cid] = {"options": d["options"], "defaultOption": d["default_option"], "groupLabel": d["group_label"]}
    return {
        "courses": courses,
        "cats": [{"id": c["id"], "name": c["name"], "img": c["img"], "pos": c["pos"]} for c in data["categories"]],
        "sessions": [{k: s[k] for k in ("course", "start", "end", "label", "weekday", "cap", "left")} for s in sessions],
        "details": details,
        "deposit": data["deposit_percent"],
        "months": MONTHS_GEN,
    }


def course_schema(c, d, site):
    """schema.org „Course“ žymėjimas mokymų puslapiui (SEO ir DI paieškai)."""
    offers = []
    for o in d["options"]:
        for key, name in (("group", "grupiniai"), ("ind", "individualūs")):
            if o.get(key):
                offers.append({"@type": "Offer", "name": "%s, %s" % (o["label"], name), "price": o[key], "priceCurrency": "EUR", "category": "Paid"})
    obj = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": d["h1"],
        "description": d["lead"],
        "inLanguage": ["lt", "en", "ru"],
        "provider": {"@type": "EducationalOrganization", "name": site["brand"]["name"], "address": "%s, %s" % (site["contacts"]["street"], site["contacts"]["city"])},
        "offers": offers,
        "hasCourseInstance": [
            {"@type": "CourseInstance", "courseMode": "Onsite", "startDate": s["start"], "endDate": s["end"], "location": site["contacts"]["place"]}
            for s in c["sessions"]
        ],
    }
    if d.get("qualification"):
        obj["educationalCredentialAwarded"] = d["qualification"]
    return Markup(json.dumps(obj, ensure_ascii=False, indent=1).replace("</", "<\\/"))


def org_schema(site):
    obj = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": site["brand"]["name"],
        "legalName": site["brand"]["legal"],
        "foundingDate": str(site["brand"]["since"]),
        "telephone": site["contacts"]["phone"],
        "email": site["contacts"]["email"],
        "address": {"@type": "PostalAddress", "streetAddress": site["contacts"]["street"], "addressLocality": site["contacts"]["city"], "postalCode": site["contacts"]["zip"], "addressCountry": "LT"},
        "sameAs": [site["contacts"]["instagram"], site["contacts"]["facebook"]],
    }
    return Markup(json.dumps(obj, ensure_ascii=False, indent=1).replace("</", "<\\/"))


def build():
    data = json.loads((SRC / "data" / "site.json").read_text(encoding="utf-8"))
    today = dt.date.today()
    cats, by_id, sessions, months = prepare(data, today)
    sizes = photo_sizes()

    env = Environment(
        loader=FileSystemLoader(str(SRC / "templates")),
        autoescape=True,
        undefined=StrictUndefined,
        trim_blocks=True,
        lstrip_blocks=True,
    )
    env.filters.update(eur=eur, split=split_words, plural=plural)
    env.globals.update(
        icon=icon,
        sprite=sprite(),
        site=data,
        cats=cats,
        courses=data["courses"],
        courses_by_id=by_id,
        sessions=sessions,
        months=months,
        psize=sizes,
        date_range=date_range,
        gk_json=Markup(json.dumps(client_data(data, sessions), ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")),
        org_schema=org_schema(data),
        build_date=today.isoformat(),
    )

    pages = [("index.html", "index.html", {"page": "home"})]
    for c in data["courses"]:
        if c["page"]:
            d = data["details"][c["id"]]
            ctx = {
                "page": "course",
                "course": c,
                "d": d,
                "cat": cats[c["cat"]],
                "related": [by_id[i] for i in d["related"]],
                "schema": course_schema(c, d, data),
            }
            pages.append(("mokymas.html", c["page"], ctx))

    for tpl, out, ctx in pages:
        html = env.get_template(tpl).render(**ctx)
        html = re.sub(r"\n[ \t]*\n(?:[ \t]*\n)+", "\n\n", html)
        html = typo(html)
        (ROOT / out).write_text(html, encoding="utf-8")
        print("%-36s %7.1f KB" % (out, len(html.encode("utf-8")) / 1024))
    print("Programų: %d, būsimų datų: %d, šiandien: %s" % (len(data["courses"]), len(sessions), today.isoformat()))


if __name__ == "__main__":
    build()
