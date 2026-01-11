import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, onValue, runTransaction, update, remove, query, limitToLast, get, set, orderByChild, equalTo, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// --- КОНФИГУРАЦИЯ И ДАННЫЕ ---
const STICKERS_LIST = Array.from({length: 12}, (_, i) => `stick/${i+1}.png`); 

const COVER_COLLECTION = [
    {id:'cv_anim_1', name:'Anime', price:2500, val:'obloz/2.mp4'},
    {id:'cv_anim_2', name:'Собака', price:9000, val:'obloz/pes.gif'},
];

const THEME_COLLECTION = [
    {id:'th_space', name:'lll', price:1500, val:'themes/lll.jpg'},
    {id:'1', name:'preview', price:4000, val:'themes/gif_VSTHEMES-ORG (1).gif'},
    {id:'2', name:'preview', price:4000, val:'themes/gif_VSTHEMES-ORG (2).gif'},
    {id:'3', name:'preview', price:4000, val:'themes/gif_VSTHEMES-ORG (3).gif'},
    {id:'4', name:'preview', price:4000, val:'themes/gif_VSTHEMES-ORG (4).gif'},
];

const SHOP_DB = [
    {id:'st_prem', type:'badge', name:'Premium', price:5000, css:'badge-premium', cat:'badge'},
    {id:'bd_ver', type:'badge', name:'Verified', price:2000, val:'<i class="fas fa-check-circle text-primary"></i>', cat:'badge'},
    {id:'bd_vip', type:'badge', name:'VIP', price:3000, val:'<i class="fas fa-star text-warning"></i>', cat:'badge'},
    {id:'bd_bug', type:'badge', name:'Bug Hunter', price:1500, val:'<i class="fas fa-bug text-danger"></i>', cat:'badge'},
    {id:'bd_dev', type:'badge', name:'Dev', price:9999, val:'<i class="fas fa-code text-info"></i>', cat:'badge'},
    {id:'bd_king', type:'badge', name:'King', price:4000, val:'<i class="fas fa-chess-king text-warning"></i>', cat:'badge'},
    {id:'bd_love', type:'badge', name:'Lover', price:1000, val:'<i class="fas fa-heart text-danger"></i>', cat:'badge'},
    {id:'bd_rich', type:'badge', name:'Rich', price:5000, val:'<i class="fas fa-gem text-info"></i>', cat:'badge'},
    {id:'bd_toxic', type:'badge', name:'Toxic', price:500, val:'<i class="fas fa-biohazard text-success"></i>', cat:'badge'},
    {id:'bd_cool', type:'badge', name:'Cool', price:800, val:'<i class="fas fa-sunglasses text-dark"></i>', cat:'badge'},
    {id:'bd_fire', type:'badge', name:'Hot', price:900, val:'<i class="fas fa-fire text-warning"></i>', cat:'badge'},
    {id:'bd_bot', type:'badge', name:'Bot', price:100, val:'<i class="fas fa-robot text-secondary"></i>', cat:'badge'},
    {id:'bd_cat', type:'badge', name:'Cat', price:600, val:'<i class="fas fa-cat"></i>', cat:'badge'},
    {id:'bd_dog', type:'badge', name:'Dog', price:600, val:'<i class="fas fa-dog"></i>', cat:'badge'},
    {id:'bd_mus', type:'badge', name:'Music', price:700, val:'<i class="fas fa-music text-primary"></i>', cat:'badge'},
    {id:'bd_gam', type:'badge', name:'Gamer', price:800, val:'<i class="fas fa-gamepad text-success"></i>', cat:'badge'},
    {id:'bd_cam', type:'badge', name:'Photo', price:700, val:'<i class="fas fa-camera"></i>', cat:'badge'},
    {id:'bd_tv', type:'badge', name:'Streamer', price:2000, val:'<i class="fas fa-tv text-danger"></i>', cat:'badge'},
    {id:'bd_sec', type:'badge', name:'Security', price:1500, val:'<i class="fas fa-shield-alt text-primary"></i>', cat:'badge'},
    {id:'bd_rock', type:'badge', name:'Rocket', price:3000, val:'<i class="fas fa-rocket text-danger"></i>', cat:'badge'},
    {id:'bd_uni', type:'badge', name:'Unicorn', price:2500, val:'<i class="fas fa-horse text-info"></i>', cat:'badge'},
    {id:'bd_skull', type:'badge', name:'Skull', price:1200, val:'<i class="fas fa-skull"></i>', cat:'badge'},
    {id:'bd_ghost', type:'badge', name:'Ghost', price:1300, val:'<i class="fas fa-ghost"></i>', cat:'badge'},
    {id:'bd_alien', type:'badge', name:'Alien', price:1400, val:'<i class="fab fa-reddit-alien text-success"></i>', cat:'badge'},
    {id:'bd_wiz', type:'badge', name:'Wizard', price:1600, val:'<i class="fas fa-hat-wizard text-primary"></i>', cat:'badge'},
    {id:'bd_ninja', type:'badge', name:'Ninja', price:1500, val:'<i class="fas fa-user-ninja"></i>', cat:'badge'},
    {id:'bd_spy', type:'badge', name:'Spy', price:1500, val:'<i class="fas fa-user-secret"></i>', cat:'badge'},
    {id:'bd_doc', type:'badge', name:'Doc', price:2000, val:'<i class="fas fa-user-md text-info"></i>', cat:'badge'},
    {id:'bd_grad', type:'badge', name:'Student', price:500, val:'<i class="fas fa-user-graduate"></i>', cat:'badge'},
    {id:'bd_mod', type:'badge', name:'Moderator', price:8000, val:'<i class="fas fa-gavel text-warning"></i>', cat:'badge'},

    {id:'nm_grad', type:'name', name:'Blue Ocean', price:250, css:'nick-gradient', cat:'name'},
    {id:'nm_gold', type:'name', name:'Gold Luxury', price:500, css:'nick-gold', cat:'name'},
    {id:'nm_fire', type:'name', name:'Fire Storm', price:450, css:'nick-fire', cat:'name'},
    {id:'nm_neon', type:'name', name:'Neon Blue', price:400, css:'nick-neon-blue', cat:'name'},
    {id:'nm_mat', type:'name', name:'Matrix', price:350, css:'nick-matrix', cat:'name'},
    {id:'nm_rain', type:'name', name:'Rainbow', price:600, css:'nick-rainbow', cat:'name'},
    {id:'nm_cyb', type:'name', name:'Cyber', price:450, css:'nick-cyber', cat:'name'},
    {id:'nm_blood', type:'name', name:'Blood', price:400, css:'nick-blood', cat:'name'},
    {id:'nm_ice', type:'name', name:'Ice', price:300, css:'nick-ice', cat:'name'},
    {id:'nm_glitch', type:'name', name:'Glitch', price:550, css:'nick-glitch', cat:'name'},
    {id:'nm_shad', type:'name', name:'Shadow', price:300, css:'nick-shadow', cat:'name'},
    {id:'nm_sun', type:'name', name:'Sunset', price:350, css:'nick-sunset', cat:'name'},
    {id:'nm_tox', type:'name', name:'Toxic', price:400, css:'nick-toxic', cat:'name'},
    {id:'nm_roy', type:'name', name:'Royal', price:700, css:'nick-royal', cat:'name'},
    {id:'nm_goth', type:'name', name:'Gothic', price:300, css:'nick-goth', cat:'name'},
    {id:'nm_retro', type:'name', name:'Retro', price:350, css:'nick-retro', cat:'name'},
    {id:'nm_pix', type:'name', name:'Pixel', price:400, css:'nick-pixel', cat:'name'},
    {id:'nm_silv', type:'name', name:'Silver', price:450, css:'nick-silver', cat:'name'},
    {id:'nm_anim', type:'name', name:'Anime', price:500, css:'nick-anime', cat:'name'},
    {id:'nm_love', type:'name', name:'Lovely', price:250, css:'nick-love', cat:'name'},

    {id:'fr_neon', type:'frame', name:'Neon Circle', price:300, css:'frame-neon-blue', cat:'frame'},
    {id:'fr_gold', type:'frame', name:'Gold Border', price:800, css:'frame-premium', cat:'frame'},
    {id:'fr_plas', type:'frame', name:'Plasma', price:600, css:'frame-plasma', cat:'frame'},
    {id:'fr_glow', type:'frame', name:'Glow', price:400, css:'frame-glow', cat:'frame'},
    {id:'fr_fire', type:'frame', name:'Fire', price:500, css:'frame-fire', cat:'frame'},
    {id:'fr_cyb', type:'frame', name:'Cyber', price:450, css:'frame-cyber', cat:'frame'},
    {id:'fr_red', type:'frame', name:'Red Line', price:200, css:'frame-red', cat:'frame'},
    {id:'fr_green', type:'frame', name:'Green', price:200, css:'frame-green', cat:'frame'},
    {id:'fr_rain', type:'frame', name:'Rainbow', price:700, css:'frame-rainbow', cat:'frame'},
    {id:'fr_dash', type:'frame', name:'Dashed', price:150, css:'frame-dashed', cat:'frame'},
    {id:'fr_doub', type:'frame', name:'Double', price:250, css:'frame-double', cat:'frame'},
    {id:'fr_leaf', type:'frame', name:'Nature', price:300, css:'frame-leaf', cat:'frame'},
    {id:'fr_roy', type:'frame', name:'Royal', price:1000, css:'frame-royal', cat:'frame'},
    {id:'fr_ghost', type:'frame', name:'Ghost', price:600, css:'frame-ghost', cat:'frame'},
    {id:'fr_glit', type:'frame', name:'Glitch', price:550, css:'frame-glitch', cat:'frame'},
    {id:'fr_ice', type:'frame', name:'Ice', price:400, css:'frame-ice', cat:'frame'},
    {id:'fr_lav', type:'frame', name:'Lava', price:500, css:'frame-lava', cat:'frame'},
    {id:'fr_wood', type:'frame', name:'Wood', price:200, css:'frame-wood', cat:'frame'},
    {id:'fr_silv', type:'frame', name:'Silver', price:400, css:'frame-silver', cat:'frame'},
    {id:'fr_pink', type:'frame', name:'Pink', price:250, css:'frame-pink', cat:'frame'},
    {id:'fr_dark', type:'frame', name:'Dark', price:300, css:'frame-dark', cat:'frame'},
    {id:'fr_star', type:'frame', name:'Stars', price:600, css:'frame-star', cat:'frame'},
    {id:'fr_pixel', type:'frame', name:'Pixel', price:350, css:'frame-pixel', cat:'frame'},
    {id:'fr_hex', type:'frame', name:'Hexagon', price:450, css:'frame-hex', cat:'frame'},
    {id:'fr_love', type:'frame', name:'Hearts', price:300, css:'frame-love', cat:'frame'},

    {id:'pbg_mid', type:'post_bg', name:'Midnight', price:300, val:'linear-gradient(to bottom right, #232526, #414345)', cat:'post_bg'},
    {id:'pbg_sun', type:'post_bg', name:'Sunset', price:350, val:'linear-gradient(to right, #0b486b, #f56217)', cat:'post_bg'},
    {id:'pbg_for', type:'post_bg', name:'Forest', price:300, val:'linear-gradient(to bottom, #134e5e, #71b280)', cat:'post_bg'},
    {id:'pbg_oce', type:'post_bg', name:'Ocean', price:300, val:'linear-gradient(to top, #1a2980, #26d0ce)', cat:'post_bg'},
    {id:'pbg_pur', type:'post_bg', name:'Purple', price:320, val:'linear-gradient(to right, #8e2de2, #4a00e0)', cat:'post_bg'},
    {id:'pbg_red', type:'post_bg', name:'Red Alert', price:350, val:'linear-gradient(to right, #ed213a, #93291e)', cat:'post_bg'},
    {id:'pbg_gol', type:'post_bg', name:'Gold', price:500, val:'linear-gradient(to right, #f7971e, #ffd200)', cat:'post_bg'},
    {id:'pbg_dar', type:'post_bg', name:'Darkness', price:200, val:'linear-gradient(to bottom, #000000, #434343)', cat:'post_bg'},
    {id:'pbg_pin', type:'post_bg', name:'Pinky', price:250, val:'linear-gradient(to right, #ec008c, #fc6767)', cat:'post_bg'},
    {id:'pbg_sky', type:'post_bg', name:'Sky', price:300, val:'linear-gradient(to top, #2980b9, #6dd5fa, #ffffff)', cat:'post_bg'}
];
SHOP_DB.push(...COVER_COLLECTION.map(c => ({...c, cat: 'cover', type:'cover'})));
SHOP_DB.push(...THEME_COLLECTION.map(c => ({...c, cat: 'profile_bg', type:'profile_bg'})));

const GIFT_DB = [
    {id:'g_rose', name:'Роза', price:50, icon:'🌹', type:'emoji'},
    {id:'g_heart', name:'Сердце', price:100, icon:'❤️', type:'emoji'},
    {id:'g_crown', name:'Корона', price:1000, icon:'👑', type:'emoji'},
    {id:'g_cat', name:'Котик', price:500, icon:'🐱', type:'emoji'},
    {id:'g_star_old', name:'Звездочка', price:300, icon:'⭐', type:'emoji'},
    {id:'g_diam', name:'Алмаз', price:1500, icon:'💎', type:'emoji'},
    {id:'tg_star_blue', name:'Minions', price:2500, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/hangingstar/Minion.webp'},
    {id:'tg_cake', name:'Pepe', price:500, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/plushpepe/Ninja%20Mike.webp'},
    {id:'tg_perfume', name:'Gold Pepe', price:15500, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/plushpepe/Midas%20Pepe.webp'},
    {id:'tg_ring_box', name:'Cupid Charm', price:5000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/noupdate/Cupid%20Charm.webp'},
    {id:'tg_rocket', name:'Ice Glass', price:3000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/cupidcharm/Ice%20Glass.webp'},
    {id:'tg_giftbox', name:'Joyful Bundle', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/noupdate/Joyful%20Bundle.webp'},
    {id:'tg_duck', name:'Pure Gold', price:1400, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/joyfulbundle/Pure%20Gold.webp'},
    {id:'tg_crown_gold', name:'Power Line', price:8000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/partysparkler/Power%20Line.webp'},
    {id:'wan1', name:'Bulldog Bob', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/nekohelmet/Bulldog%20Bob.webp'},
    {id:'wan2', name:'Sky Diver', price:150, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/nekohelmet/Sky%20Diver.webp'},
    {id:'wan3', name:'Spidergirl', price:300, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/skystilettos/Spidergirl.webp'},
    {id:'wan4', name:'Molten Core', price:1000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/gemsignet/Molten%20Core.webp'},
    {id:'wan5', name:'Night King', price:3000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/gemsignet/Night%20King.webp'},
    {id:'wan6', name:'Blueprint', price:200, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/toybear/Blueprint.webp'},
    {id:'wan7', name:'Lunaris', price:300, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/toybear/Lunaris.webp'},
    {id:'wan8', name:'Gin & Jewels', price:500, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/swagbag/Gin%20&%20Jewels.webp'},
    {id:'wan9', name:'King Snoop', price:1000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/snoopdogg/King%20Snoop.webp'},
    {id:'wan10', name:'Doberman', price:7000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/snoopdogg/Doberman.webp'},
    {id:'wan11', name:'Sapphire', price:800, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/snoopdogg/Sapphire.webp'},
    {id:'wan12', name:'Heartbreaker', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/magicpotion/Heartbreaker.webp'},
    {id:'wan13', name:'Love Cyberpunk', price:500, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/lovecandle/Cyberpunk.webp'},
    {id:'wan14', name:'Бицепс Icebreaker', price:250, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/mightyarm/Icebreaker.webp'},
    {id:'wan15', name:'Бицепс Crystal Fist', price:270, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/mightyarm/Crystal%20Fist.webp'},
    {id:'wan16', name:'Ion Gem Pink Floyd', price:50, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/iongem/Pink%20Floyd.webp'},
    {id:'wan17', name:'Какашка Kinky Stinky', price:300, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/happybrownie/Kinky%20Stinky.webp'},
    {id:'wan18', name:'Emerald Plush', price:13300, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/plushpepe/Emerald%20Plush.webp'},
    {id:'wan19', name:'Polka Dots', price:23000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/plushpepe/Polka%20Dots.webp'},
    {id:'wan20', name:'Kung Fu Pepe', price:100000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/plushpepe/Kung%20Fu%20Pepe.webp'},
    {id:'wan21', name:'Frozen', price:200000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/plushpepe/Frozen.webp'},
    {id:'wan22', name:'Pink Galaxy', price:300000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/plushpepe/Pink%20Galaxy.webp'},
    {id:'wan23', name:'Princess', price:600000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/plushpepe/Princess.webp'},
    {id:'wan24', name:'Artificial', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/jellybunny/Artificial.webp'},
    {id:'wan25', name:'Guava Gel', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/jellybunny/Guava%20Gel.webp'},
    {id:'wan26', name:'Commando', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/jellybunny/Commando.webp'},
    {id:'wan27', name:'Dr. Jelly', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/jellybunny/Dr.%20Jelly.webp'},
    {id:'wan28', name:'Fruity', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/jellybunny/Fruity.webp'},
    {id:'wan29', name:'Gelatin Girl', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/jellybunny/Gelatin%20Girl.webp'},
    {id:'wan30', name:'Jaxy-Boy', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/jellybunny/Jaxy-Boy.webp'},
    {id:'wan31', name:'Jevil', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/jellybunny/Jevil.webp'},
    {id:'wan32', name:'Ninjell', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/jellybunny/Ninjell.webp'},
    {id:'wan33', name:'Skibidi Toilet', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/moneypot/Skibidi%20Toilet.webp'},
    {id:'wan34', name:'Ammunition', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/moneypot/Ammunition.webp'},
    {id:'wan35', name:'Hot Sauna', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/moneypot/Hot%20Sauna.webp'},
    {id:'wan36', name:'Bondage', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/springbasket/Bondage.webp'},
    {id:'wan37', name:'Mission Uranus', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/stellarrocket/Mission%20Uranus.webp'},
    {id:'wan38', name:'Seraphim', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/minioscar/Seraphim.webp'},
    {id:'wan39', name:'Priestly', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/lootbag/Priestly.webp'},
    {id:'wan40', name:'Angel', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/toybear/Angel.webp'},
    {id:'wan41', name:'Angel Dust', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/snoopcigar/Angel%20Dust.webp'},
    {id:'wan42', name:'Martian', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/minioscar/Martian.webp'},
    {id:'wan43', name:'Alien Script', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/starnotepad/Alien%20Script.webp'},
    {id:'wan44', name:'Aliens', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/jack-in-the-box/Aliens.webp'},
    {id:'wan45', name:'Spectral Smoke', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/vintagecigar/Spectral%20Smoke.webp'},
    {id:'wan46', name:'Goldfinger', price:3700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/freshsocks/Goldfinger.webp'},
    {id:'wan47', name:'Monsters', price:300, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/freshsocks/Monsters.webp'},
    {id:'wan48', name:'Biohazard', price:50, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/freshsocks/Biohazard.webp'},
    {id:'wan49', name:'Bartender', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/freshsocks/Bartender.webp'},
    {id:'wan50', name:'Fracture', price:200, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/eternalrose/Fracture.webp'},
    {id:'wan51', name:'Golden Lock', price:1700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/eternalrose/Golden%20Lock.webp'},
    {id:'wan52', name:'Inferno', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/eternalrose/Inferno.webp'},
    {id:'wan53', name:'Pepe Pod', price:2100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/restlessjar/Pepe%20Pod.webp'},
    {id:'wan54', name:'Kittens', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/restlessjar/Kittens.webp'},
    {id:'wan55', name:'Meme God', price:7000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/springbasket/Meme%20God.webp'},
    {id:'wan56', name:'Bastet', price:200, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/springbasket/Bastet.webp'},
    {id:'wan57', name:'Blue Shark', price:200, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/springbasket/Blue%20Shark.webp'},
    {id:'wan58', name:'Nocturne', price:27000, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/springbasket/Nocturne.webp'},
    {id:'wan59', name:'Baked Beats', price:200, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/snoopcigar/Baked%20Beats.webp'},
    {id:'wan60', name:'Vinyl Vibes', price:700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/snoopcigar/Vinyl%20Vibes.webp'},
    {id:'wan61', name:'Lion King', price:3700, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/snoopcigar/Lion%20King.webp'},
    {id:'wan62', name:'Love Potion', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/trappedheart/Love%20Potion.webp'},
    {id:'wan63', name:'Vampie', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/trappedheart/Vampie.webp'},
    {id:'wan64', name:'Toxic Love', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/trappedheart/Toxic%20Love.webp'},
    {id:'wan65', name:'Fireball', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/santahat/Fireball.webp'},
    {id:'wan66', name:'Jingle Volts', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/santahat/Jingle%20Volts.webp'},
    {id:'wan67', name:'Let It Go', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/santahat/Let%20It%20Go.webp'},
    {id:'wan68', name:'Bubbly', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/santahat/Bubbly.webp'},
    {id:'wan69', name:'Rave', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/santahat/Rave.webp'},
    {id:'wan70', name:'Acid Witch', price:100, type:'img', icon:'https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/sharptongue/Acid%20Witch.webp'},
];

const DB_VER = 'pulse_rt_v6_'; 
const app = initializeApp({ apiKey: "AIzaSyBWdArSLBKMgWLAjq3DZ9xgcDUYsv10jvA", authDomain: "rodina-d57b8.firebaseapp.com", databaseURL: "https://rodina-d57b8-default-rtdb.firebaseio.com", projectId: "rodina-d57b8", storageBucket: "rodina-d57b8.firebasestorage.app", messagingSenderId: "102935590624", appId: "1:102935590624:web:4335fee01225bf018c0285" });
const db = getDatabase(app);

let me = null, fUser = null;
let tempPostImages = []; 
let newAva = null;
let attachedCommImg = null; 
let activeProfileTab = 'posts';
let activeShopTab = 'all';
let navigationHistory = [];
let curPostId = null;
let editingCommId = null;
let isGiftProcessing = false;
let selectedPostId = null; 
let isArchivedPost = false;
const userCache = {}; 
let modalResolve = null;

// === HELPERS ===
window.customAlert = (msg, title='Уведомление') => {
    document.getElementById('alertTitle').innerText = title;
    document.getElementById('alertMsg').innerText = msg;
    document.getElementById('alertBtns').innerHTML = `<button class="btn btn-light w-100 rounded-pill" onclick="closeCustomModal()">ОК</button>`;
    document.getElementById('modalAlert').classList.add('active');
}
window.customConfirm = (msg, title='Подтверждение') => {
    return new Promise((resolve) => {
        modalResolve = resolve;
        document.getElementById('alertTitle').innerText = title;
        document.getElementById('alertMsg').innerText = msg;
        document.getElementById('alertBtns').innerHTML = `
            <button class="btn btn-outline-light w-50 rounded-pill" onclick="closeCustomModal(false)">Отмена</button>
            <button class="btn btn-main w-50 rounded-pill" onclick="closeCustomModal(true)">Да</button>
        `;
        document.getElementById('modalAlert').classList.add('active');
    });
}
window.closeCustomModal = (res) => {
    document.getElementById('modalAlert').classList.remove('active');
    if(modalResolve) { modalResolve(res); modalResolve = null; }
}
function safeSet(id, val) { const el = document.getElementById(id); if(el) el.innerText = val; }
function safeSetHtml(id, val) { const el = document.getElementById(id); if(el) el.innerHTML = val; }
function throttle(func, limit) { let inThrottle; return function() { const args = arguments; const context = this; if (!inThrottle) { func.apply(context, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); } }; }

window.showAdminInfo = (e) => {
    e.stopPropagation(); 
    document.getElementById('modalAdminInfo').classList.add('active');
}

function applyProfileCover(elementId, src) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = '';
    
    if (!src) { 
        el.style.background = 'var(--bg-card)'; 
        return; 
    }
    
    // Если это видео
    if (src.endsWith('.mp4') || src.endsWith('.webm')) {
        const vid = document.createElement('video');
        vid.src = src; 
        vid.autoplay = true; 
        vid.loop = true; 
        vid.muted = true; 
        vid.playsInline = true;
        vid.className = 'cover-media'; 
        el.style.background = 'transparent'; 
        el.appendChild(vid);
    } 
    // ИСПРАВЛЕНИЕ: Если это градиент или css-картинка
    else if (src.includes('gradient') || src.includes('url(')) {
        el.style.background = src;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
    } 
    // Иначе это обычная ссылка на картинку
    else {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'cover-media';
        el.style.background = 'transparent';
        el.appendChild(img);
    }
}

function applyProfileTheme(containerId, src, viewId) {
    const el = document.getElementById(containerId);
    const view = document.getElementById(viewId);
    if(!el || !view) return;
    el.innerHTML = '';
    if(!src) {
        el.className = 'profile-theme-layer';
        view.classList.remove('has-theme');
        return;
    }
    view.classList.add('has-theme');
    el.classList.add('active');
    if (src.endsWith('.mp4') || src.endsWith('.webm')) {
        const vid = document.createElement('video');
        vid.src = src; vid.autoplay = true; vid.loop = true; vid.muted = true; vid.playsInline = true;
        vid.style.cssText = "width:100%;height:100%;object-fit:cover;";
        el.appendChild(vid);
    } else {
        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = "width:100%;height:100%;object-fit:cover;";
        el.appendChild(img);
    }
}

// === INIT ===
async function init() {
    const localId = localStorage.getItem('pm_uid');
    const localPass = localStorage.getItem('pm_pass');
    setTimeout(() => { if(!me && !localId) document.getElementById('loading').style.display='none'; }, 2000); 

    if (!localId) { 
        document.getElementById('loading').style.display='none';
        document.getElementById('regScreen').style.display = 'flex'; 
    } else {
        try {
            const s = await get(ref(db, `${DB_VER}users/${localId}`));
            if (!s.exists()) { 
                localStorage.removeItem('pm_uid'); 
                document.getElementById('loading').style.display='none';
                document.getElementById('regScreen').style.display = 'flex'; 
            } else {
                const userData = s.val();
                if (localPass && userData.password === localPass) startApp(userData);
                else { 
                    document.getElementById('loading').style.display='none';
                    showLoginScreen(userData); 
                }
            }
        } catch(e) { console.error(e); }
    }
    
    const sp = document.getElementById('stickerPicker');
    STICKERS_LIST.forEach(url => {
        sp.innerHTML += `<img src="${url}" class="sticker-opt" onclick="sendSticker('${url}')" onerror="this.style.display='none'">`;
    });
}

function showLoginScreen(u) {
    document.getElementById('loginAva').src = u.photo;
    document.getElementById('loginName').innerText = u.name;
    document.getElementById('loginScreen').style.display = 'flex';
}
function startApp(userObj) {
    me = userObj;
    userCache[me.id] = me;
    document.getElementById('loading').style.display='none'; 
    onValue(ref(db, `${DB_VER}users/${userObj.id}`), snap => {
        if(snap.exists()) { me = snap.val(); userCache[me.id] = me; updateUI(); }
    });
    document.getElementById('regScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'none';
    initFeedListener(); 
    listenNotifs();
}
function listenNotifs() { 
    if(!me) return; 
    onValue(ref(db, `${DB_VER}notifications/${me.id}`), s => { 
        const d = s.val(); 
        document.getElementById('notifBadge').style.display = (d && Object.values(d).some(x=>!x.read)) ? 'block' : 'none'; 
    }); 
}

// === AUTH LOGIC ===
window.handleRegFile=(i)=>procImg(i,b=>{ newAva=b; document.getElementById('regPrev').src=b; document.getElementById('regPrev').style.display='block'; document.getElementById('regIcon').style.display='none'; });
window.register=()=>{
    const n = document.getElementById('regName').value.trim();
    const p = document.getElementById('regPass').value.trim();
    if(!n || !p || !newAva) return customAlert('Все поля обязательны!');
    const newId = 'u_' + Math.floor(Math.random() * 999999999).toString(36);
    const u = {
        id: newId, name: n, bio: '', photo: newAva, password: p,
        coins: 200, lvl: 1, followersCount: 0, followingCount: 0,
        settings: {privacy:'open'}, isAdmin: false, isPremium: false, lastBonus: 0
    };
    set(ref(db, `${DB_VER}users/${newId}`), u).then(()=>{
        localStorage.setItem('pm_uid', newId); localStorage.setItem('pm_pass', p);
        startApp(u);
    });
}
window.performLogin = () => {
    const inputPass = document.getElementById('loginPass').value.trim();
    if(me.password === inputPass) {
        localStorage.setItem('pm_uid', me.id); localStorage.setItem('pm_pass', inputPass);
        document.getElementById('loginScreen').style.display = 'none'; startApp(me);
    } else customAlert('Неверный пароль');
}
window.toggleAuthScreen = (mode) => {
    if(mode === 'login') { document.getElementById('regScreen').style.display = 'none'; document.getElementById('fullLoginScreen').style.display = 'flex'; } 
    else { document.getElementById('fullLoginScreen').style.display = 'none'; document.getElementById('regScreen').style.display = 'flex'; }
}
window.loginWithCredentials = () => {
    const name = document.getElementById('flName').value.trim();
    const pass = document.getElementById('flPass').value.trim();
    if(!name || !pass) return customAlert('Введите данные');
    get(ref(db, `${DB_VER}users`)).then(snapshot => {
        let foundUser = null;
        if (snapshot.exists()) { snapshot.forEach(child => { const u = child.val(); if (u.name === name && u.password === pass) foundUser = u; }); }
        if (foundUser) {
            localStorage.setItem('pm_uid', foundUser.id); localStorage.setItem('pm_pass', pass);
            document.getElementById('fullLoginScreen').style.display = 'none'; startApp(foundUser);
        } else { customAlert('Ошибка входа'); }
    });
}
window.resetLocalData = () => { localStorage.clear(); window.location.reload(); }
window.logout = () => { localStorage.removeItem('pm_pass'); window.location.reload(); }

function updateUI() {
    if(!me) return;
    safeSet('headCoins', me.coins || 0);
    
    // --- ОТОБРАЖЕНИЕ ПОДАРКА НА АВАТАРКЕ (FIX) ---
    const giftContainer = document.getElementById('myGiftBadgeContainer');
    giftContainer.innerHTML = ''; 
    
    if(me.equippedGift) {
        let badgeHtml = '';
        if(me.equippedGift.startsWith('http')) {
            badgeHtml = `<img src="${me.equippedGift}" class="gift-avatar-badge" onclick="openFullGifts()">`;
        } else {
            badgeHtml = `<div class="gift-avatar-badge emoji" onclick="openFullGifts()">${me.equippedGift}</div>`;
        }
        giftContainer.innerHTML = badgeHtml;
    }
    // ---------------------------------------------
    
    safeSetHtml('myName', `${me.name} ${getBadges(me)}`);
    document.getElementById('myName').className = `tt-name ${me.equippedName||''}`;
    
    const usernameEl = document.getElementById('myUsername');
    if(me.username) {
        usernameEl.innerText = `@${me.username}`;
        usernameEl.style.display = 'block';
    } else {
        usernameEl.style.display = 'none';
    }

    safeSet('myBio', me.bio || ''); 
    safeSet('mySubs', me.followersCount || 0); safeSet('myFollowing', me.followingCount || 0); 
    
    onValue(query(ref(db, `${DB_VER}posts`), orderByChild('authorId'), equalTo(me.id)), (snap) => {
        let total = 0;
        snap.forEach(c => {
            const p = c.val();
            if(p.likes) total += p.likes;
        });
        safeSet('myLvl', total);
    });

    const a = document.getElementById('myAva');
    if(a) { a.src = me.photo; a.className = `tt-ava ${me.equippedFrame||''}`; }
    
    const mini = document.getElementById('myMiniAva');
    if(mini) { mini.src = me.photo; mini.className = `post-ava ${me.equippedFrame||''}`; }

    applyProfileCover('myProfileCover', me.equippedBg);
    applyProfileTheme('myProfileThemeLayer', me.equippedProfileBg, 'view-profile');
    
    loadMyPosts();
}

function getBadges(u) {
    let h = '';
    if(u.isAdmin) {
        h += `<span class="admin-badge-official" onclick="showAdminInfo(event)">
                <i class="fas fa-shield-alt"></i> ADMIN
              </span>`;
    }
    if(u.inventory && u.inventory['st_prem']) h += '<i class="fas fa-crown badge-premium"></i>';
    if(u.equippedBadge) {
         const b = SHOP_DB.find(x => x.id === u.equippedBadge);
         if(b && b.val) h += ` <span class="ms-1">${b.val}</span>`;
    }
    return h;
}

function initFeedListener() {
    const feedList = document.getElementById('feedList');
    const q = query(ref(db, `${DB_VER}posts`), limitToLast(50));
    
    onChildAdded(q, (snap) => {
        const p = snap.val();
        if(p.isArchived) return;
        const html = renderPostString(p, snap.key);
        feedList.insertAdjacentHTML('afterbegin', html);
        
        if(!userCache[p.authorId]) {
            get(ref(db, `${DB_VER}users/${p.authorId}`)).then(s => {
                if(s.exists()) {
                    userCache[p.authorId] = s.val();
                    updatePostAuthorUI(snap.key, s.val());
                }
            });
        }
    });

    onChildChanged(q, (snap) => {
        const p = snap.val();
        const pid = snap.key;
        
        const existing = document.getElementById(`post-${pid}`);
        if(existing) {
            existing.outerHTML = renderPostString(p, pid);
            if(userCache[p.authorId]) updatePostAuthorUI(pid, userCache[p.authorId]);
        }

        if(p.isArchived) {
            const el = document.getElementById(`post-${pid}`);
            if(el) el.remove();
        }
    });

    onChildRemoved(q, (snap) => {
        const el = document.getElementById(`post-${snap.key}`);
        if(el) el.remove();
    });
}

function renderPostString(p, key) {
    const author = userCache[p.authorId] || {
        name: p.authorName || 'User',
        photo: p.authorPhoto || 'placeholder.png',
        equippedFrame: '', equippedName: '', equippedPostBg: p.bg
    };
    const liked = p.likesList && p.likesList[me.id];
    let badges = getBadges(author);
    
    // --- Юзернейм (ФИОЛЕТОВЫЙ) ---
    const handle = author.username || p.authorUsername;
    const usernameDisplay = handle 
        ? `<div id="p-user-${key}" class="small" style="font-size:12px; margin-top:0px; color:var(--primary); font-weight:700;">@${handle}</div>` 
        : `<div id="p-user-${key}" class="small" style="font-size:12px; margin-top:0px; display:none; color:var(--primary); font-weight:700;"></div>`;

    // --- Меню действий ---
    let menuBtn = '';
    if(p.authorId === me.id || me.isAdmin) {
        menuBtn = `<div class="post-opt-btn ms-auto" onclick="openPostOptions('${key}', ${p.isArchived})"><i class="fas fa-ellipsis-v"></i></div>`;
    }

    let contentHtml = '';
    const isPaid = p.price && p.price > 0;
    const isOwner = p.authorId === me.id;
    const isBought = p.buyers && p.buyers[me.id];
    
    if(isPaid && !isBought && !isOwner) {
        contentHtml = `
        <div class="locked-post-container">
            <div class="locked-post-bg"></div>
            <div class="locked-content">
                <i class="fas fa-lock fa-3x text-warning mb-3"></i>
                <div class="fw-bold text-white fs-5">Закрытый контент</div>
                <div class="text-muted small mb-2">Автор ограничил доступ</div>
                <button class="btn-unlock" onclick="buyPost('${key}', ${p.price}, '${p.authorId}')">
                    Разблокировать за ${p.price} <i class="fas fa-coins"></i>
                </button>
            </div>
        </div>`;
    } 
    else {
        const scamWarning = p.text ? checkForLinks(p.text) : '';
        const textContent = `<div class="mt-2" style="white-space:pre-wrap; padding: 0 5px;">${p.text || ''}</div>${scamWarning}`;
        
        let mediaHtml = '';
        if(p.images && p.images.length > 0) {
            let imgs = p.images.map(src => `<img src="${src}" class="post-img" onclick="openLightbox(this.src)">`).join('');
            let dots = p.images.length > 1 ? `<div class="carousel-indicators">` + p.images.map((_, i) => `<div class="carousel-dot ${i===0?'active':''}"></div>`).join('') + `</div>` : '';
            let counterHtml = p.images.length > 1 ? `<div class="photo-counter-badge"><i class="fas fa-images"></i> 1/${p.images.length}</div>` : '';

            mediaHtml = `
            <div class="carousel-wrapper" onscroll="updateCarouselDots(this)">
                <div class="post-carousel">${imgs}</div>
                ${counterHtml}
                ${dots}
            </div>`;
        } else if (p.img) {
            mediaHtml = `<img src="${p.img}" class="post-img" onclick="openLightbox(this.src)">`;
        }
        contentHtml = textContent + mediaHtml;
    }

    let bgStyle = author.equippedPostBg ? `style="background: ${author.equippedPostBg} !important; border:none;"` : '';

    return `
    <div class="post" id="post-${key}" ${bgStyle}>
        <!-- ШАПКА (ВРЕМЯ СВЕТЛЕЕ, ЮЗЕРНЕЙМ ФИОЛЕТОВЫЙ) -->
        <div class="post-head-card">
            <img src="${author.photo}" id="p-ava-${key}" class="post-ava ${author.equippedFrame||''}" onclick="openForeign('${p.authorId}')" style="cursor:pointer; width:38px; height:38px;">
            <div style="flex:1; padding-left: 5px;">
                <div class="fw-bold ${author.equippedName||''}" id="p-name-${key}" onclick="openForeign('${p.authorId}')" style="cursor:pointer; line-height: 1.1; font-size:15px;">
                    ${author.name} ${badges}
                </div>
                ${usernameDisplay}
                <div class="small" style="font-size:10px; margin-top:2px; color:#ccc;">${moment(p.timestamp).fromNow()}</div>
            </div>
            ${menuBtn}
        </div>
        
        ${contentHtml}
        
        <div class="mt-2 d-flex gap-4" style="padding: 0 5px;">
            <button class="btn-act ${liked?'liked':''}" id="like-btn-${key}" onclick="like('${key}')"><i class="${liked?'fas':'far'} fa-heart"></i> ${p.likes||0}</button>
            <button class="btn-act" id="comm-btn-${key}" onclick="openComments('${key}')"><i class="far fa-comment"></i> ${p.commentCount||0}</button>
        </div>
    </div>`;
}

window.updateCarouselDots = (wrapper) => {
    const carousel = wrapper.querySelector('.post-carousel');
    const dots = wrapper.querySelectorAll('.carousel-dot');
    const counter = wrapper.querySelector('.photo-counter-badge');
    if(!carousel || !dots.length) return;

    const scrollLeft = carousel.scrollLeft;
    const width = carousel.offsetWidth;
    const index = Math.round(scrollLeft / width);

    dots.forEach((dot, i) => {
        if(i === index) dot.classList.add('active');
        else dot.classList.remove('active');
    });

    if(counter) {
        counter.innerHTML = `<i class="fas fa-images"></i> ${index + 1}/${dots.length}`;
    }
}

window.buyPost = async (postId, price, authorId) => {
    if((me.coins || 0) < price) return customAlert("Не хватает монет!");
    
    const ok = await customConfirm(`Купить доступ за ${price} монет?`);
    if(!ok) return;

    runTransaction(ref(db, `${DB_VER}users/${me.id}`), u => {
        if (!u) return;
        // ЗАЩИТА ОТ МИНУСА
        if ((u.coins || 0) < price) return;
        
        u.coins -= price;
        return u;
    }).then(res => {
        if(res.committed) {
            me.coins = res.snapshot.val().coins;
            safeSet('headCoins', me.coins);
            
            runTransaction(ref(db, `${DB_VER}users/${authorId}`), u => {
                if(u) { u.coins = (u.coins || 0) + price; }
                return u;
            });
            
            const updates = {};
            updates[`${DB_VER}posts/${postId}/buyers/${me.id}`] = true;
            update(ref(db), updates);

            push(ref(db, `${DB_VER}notifications/${authorId}`), {
                type:'transfer', uid:me.id, user:me.name, ava:me.photo, amount:price, text:'за покупку поста', ts: Date.now()
            });
            customAlert("Пост куплен!");
        } else {
            customAlert("Недостаточно средств!");
        }
    });
}
function updatePostAuthorUI(key, u) {
    const ava = document.getElementById(`p-ava-${key}`);
    const name = document.getElementById(`p-name-${key}`);
    
    const uTag = document.getElementById(`p-user-${key}`);
    if(uTag && u.username) {
        uTag.innerText = '@' + u.username;
        uTag.style.display = 'block';
        uTag.style.color = 'var(--primary)'; // Фиолетовый
        uTag.style.fontWeight = '700';
    }

    if(ava) { ava.src = u.photo; ava.className = `post-ava ${u.equippedFrame||''}`; }
    if(name) { name.innerHTML = `${u.name} ${getBadges(u)}`; name.className = `fw-bold ${u.equippedName||''}`; }
}

function checkForLinks(text) {
    if(!text) return '';
    const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9]+\.(ru|com|net|org|xyz|io|me|info))/gi;
    if (linkRegex.test(text)) return `<div class="scam-badge"><i class="fas fa-exclamation-triangle"></i> Осторожно: внешняя ссылка! Возможен скам.</div>`;
    return '';
}

window.openLightbox = (src) => {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    img.src = src;
    lb.classList.add('active');
}
window.closeLightbox = () => {
    document.getElementById('lightbox').classList.remove('active');
}

window.like=(k)=>{ 
    runTransaction(ref(db, `${DB_VER}posts/${k}`), p=>{ 
        if(!p) return; 
        if(!p.likesList) p.likesList={}; 
        if(p.likesList[me.id]){ p.likesList[me.id]=null; p.likes--; } 
        else { 
            p.likesList[me.id]=true; p.likes++; 
            if(p.authorId !== me.id) {
                 push(ref(db, `${DB_VER}notifications/${p.authorId}`), {
                    type:'like', uid:me.id, user:me.name, ava:me.photo, postId: k, ts: Date.now()
                 });
            }
        } 
        return p; 
    }); 
}
window.openPostOptions = (pid, archived) => {
    selectedPostId = pid;
    isArchivedPost = !!archived;
    get(ref(db, `${DB_VER}posts/${pid}`)).then(s => {
        if(!s.exists()) return;
        const p = s.val();
        if(p.authorId !== me.id && !me.isAdmin) { customAlert("Нет доступа!"); return; }
        document.getElementById('archiveBtnText').innerText = isArchivedPost ? 'Вернуть из архива' : 'В архив (скрыть)';
        openSheet('modalPostOptions');
    });
}
window.archivePost = async () => {
    if(!selectedPostId) return;
    update(ref(db, `${DB_VER}posts/${selectedPostId}`), { isArchived: !isArchivedPost }).then(() => {
        closeAll(); customAlert(isArchivedPost ? 'Пост восстановлен' : 'Пост скрыт');
    });
}
window.deletePost = async () => {
    if(!selectedPostId) return;
    const ok = await customConfirm('Удалить пост навсегда?');
    if(!ok) return;
    remove(ref(db, `${DB_VER}posts/${selectedPostId}`)).then(() => { closeAll(); customAlert('Пост удален'); });
}
window.openEditPost = async () => {
    if(!selectedPostId) return;
    const snap = await get(ref(db, `${DB_VER}posts/${selectedPostId}`));
    if(!snap.exists()) return;
    document.getElementById('editPostInput').value = snap.val().text || '';
    closeAll(); openSheet('modalEditPost');
}
window.saveEditedPost = async () => {
    const txt = document.getElementById('editPostInput').value.trim();
    if(!selectedPostId) return;
    update(ref(db, `${DB_VER}posts/${selectedPostId}`), { text: txt }).then(() => { closeAll(); customAlert('Пост обновлен'); });
}
window.openCreate=()=>{ openSheet('modalCreate'); }

window.handlePostFile=(input)=>{
    if (!input.files || input.files.length === 0) return;
    tempPostImages = []; 
    const previewContainer = document.getElementById('postImgPrev');
    previewContainer.innerHTML = '';
    previewContainer.style.display = 'flex';

    const files = Array.from(input.files).slice(0, 10);

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const b64 = e.target.result;
            tempPostImages.push(b64);
            const imgDiv = document.createElement('div');
            imgDiv.style.cssText = `width:100px; height:100px; background-image:url(${b64}); background-size:cover; border-radius:8px; flex-shrink:0; border:1px solid #333`;
            previewContainer.appendChild(imgDiv);
        };
        reader.readAsDataURL(file);
    });
};

window.publish = () => { 
    const t = document.getElementById('postTxt').value.trim();
    const priceVal = parseInt(document.getElementById('postPrice').value) || 0;

    if(!t && tempPostImages.length === 0) return customAlert('Пост пуст'); 
    
    // ДОБАВЛЕНО: authorUsername
    const postData = { 
        authorId: me.id, authorName: me.name, authorPhoto: me.photo, 
        authorUsername: me.username || null, 
        authorFrame: me.equippedFrame || null, authorNameCss: me.equippedName || null, authorPremium: (me.inventory && me.inventory['st_prem']) ? true : false,
        authorIsAdmin: me.isAdmin || false, timestamp: Date.now(), likes: 0, commentCount: 0,
        bg: me.equippedPostBg || null,
        price: priceVal,
        images: tempPostImages 
    }; 
    
    if(tempPostImages.length > 0) postData.img = tempPostImages[0];
    if(t) postData.text = t; 

    push(ref(db, `${DB_VER}posts`), postData); 
    closeAll(); runTransaction(ref(db, `${DB_VER}users/${me.id}`), u=>{ if(u){u.lvl=(u.lvl||0)+1;u.coins=(u.coins||0)+10;} return u; }); 
    customAlert('Опубликовано!'); 
    
    document.getElementById('postTxt').value=''; 
    document.getElementById('postPrice').value='';
    tempPostImages=[]; 
    document.getElementById('postImgPrev').innerHTML = '';
    document.getElementById('postImgPrev').style.display='none'; 
    document.getElementById('postFile').value = ''; 
}

window.openComments = (pid) => { 
    curPostId = pid; 
    openSheet('modalComments'); 
    document.getElementById('stickerPicker').classList.remove('active');
    clearCommImg();
    const l = document.getElementById('commentsList'); 
    l.innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary"></div></div>';
    
    onValue(ref(db, `${DB_VER}comments/${pid}`), s => {
        if(!s.exists()) { l.innerHTML='<div class="text-center text-muted mt-5 small">Нет комментариев</div>'; return; }
        const arr = []; s.forEach(c => { arr.push({key: c.key, ...c.val()}); });
        
        const html = arr.map(c => {
             const isMe = c.uid === me.id;
             const canManage = isMe || me.isAdmin;
             
             let commContent = '';
             let isSticker = false;
             
             if(c.sticker) {
                 isSticker = true;
                 commContent = `<img src="${c.sticker}" class="comm-sticker" onerror="this.src='https://placehold.co/100x100?text=Stick'">`;
             } else {
                 const safeText = c.text ? c.text.replace(/'/g, "&apos;").replace(/"/g, "&quot;") : "";
                 
                 // Process text to find mentions
                 const words = safeText.split(' ');
                 const processedWords = words.map(word => {
                    if (word.startsWith('@')) {
                        // Return clickable span
                        const mentionName = word.substring(1); // remove @
                        return `<span class="mention-highlight" onclick="findUserAndOpen('${mentionName}')">${word}</span>`;
                    }
                    return word;
                 });
                 let displayText = processedWords.join(' ');

                 const warning = checkForLinks(safeText);
                 
                 if(c.img) commContent += `<img src="${c.img}" class="comm-img" onclick="openLightbox(this.src)">`;
                 if(displayText) commContent += `<div class="comm-text" style="${c.img ? 'margin-top:5px' : ''}">${displayText}</div>${warning}`;
             }

             const safeTextPayload = c.text ? c.text.replace(/'/g, "&apos;").replace(/"/g, "&quot;") : "";
             
             const editBtn = canManage ? `<span class="comm-action ms-2" onclick="openEditComment('${c.key}', '${safeTextPayload}', ${isSticker})"><i class="fas fa-ellipsis-h text-muted" style="font-size:12px"></i></span>` : '';
             
             const replyTarget = c.username ? `@${c.username}` : `@${c.name}`;
             const replyBtn = `<span class="comm-action ms-2" onclick="replyTo('${replyTarget}')"><i class="fas fa-reply text-muted" style="font-size:12px"></i></span>`;
             
             const usernameDisplay = c.username ? `<span class="comm-username" onclick="openForeign('${c.uid}')">@${c.username}</span>` : '';

             return `
             <div class="comment-item">
                <img src="${c.ava}" class="comment-ava" onclick="openForeign('${c.uid}')">
                <div class="comment-bubble">
                    <div class="comm-header">
                        <div>
                            <span class="comm-name" onclick="openForeign('${c.uid}')">${c.name}</span>
                            ${usernameDisplay}
                        </div>
                        <div>${replyBtn} ${editBtn}</div>
                    </div>
                    ${commContent}
                    <div class="comm-meta"><span>${moment(c.ts || Date.now()).fromNow()}</span></div>
                </div>
             </div>`;
        }).join('');
        l.innerHTML = html;
        setTimeout(() => { l.scrollTop = l.scrollHeight; }, 100);
    });
}

// Function to find user by name/username and open profile
window.findUserAndOpen = (name) => {
    get(ref(db, `${DB_VER}users`)).then(snap => {
        if(!snap.exists()) return customAlert("Пользователь не найден");
        let foundId = null;
        snap.forEach(c => {
            const u = c.val();
            if((u.username && u.username.toLowerCase() === name.toLowerCase()) || 
               (u.name.toLowerCase() === name.toLowerCase())) {
                foundId = u.id;
            }
        });
        
        if(foundId) openForeign(foundId);
        else customAlert("Пользователь не найден");
    });
}

window.handleCommFile = (input) => {
    procImg(input, b64 => {
        attachedCommImg = b64;
        document.getElementById('commImgPrev').src = b64;
        document.getElementById('commImgPrevCont').style.display = 'block';
    });
}
window.clearCommImg = () => {
    attachedCommImg = null;
    document.getElementById('commImgPrevCont').style.display = 'none';
    document.getElementById('commFile').value = '';
}
window.toggleStickerPicker = () => {
    document.getElementById('stickerPicker').classList.toggle('active');
}
window.sendSticker = (url) => {
    if(!curPostId) return;
    push(ref(db, `${DB_VER}comments/${curPostId}`), { 
        uid: me.id, name: me.name, username: me.username || null, ava: me.photo, sticker: url, ts: Date.now() 
    });
    runTransaction(ref(db, `${DB_VER}posts/${curPostId}/commentCount`), c => (c||0)+1); 
    
    get(ref(db, `${DB_VER}posts/${curPostId}`)).then(s=>{
        if(s.exists()){
            const p = s.val();
            if(p.authorId !== me.id) {
                push(ref(db, `${DB_VER}notifications/${p.authorId}`), {
                    type:'comm', uid:me.id, user:me.name, ava:me.photo, postId:curPostId, text:'[Стикер]', ts:Date.now()
                });
            }
        }
    });

    document.getElementById('stickerPicker').classList.remove('active');
}
window.sendComment = async () => {
    const txt = document.getElementById('commInput').value.trim(); 
    if(!txt && !attachedCommImg) return;
    
    const commData = { uid: me.id, name: me.name, username: me.username || null, ava: me.photo, ts: Date.now() };
    if(txt) commData.text = txt;
    if(attachedCommImg) commData.img = attachedCommImg;

    push(ref(db, `${DB_VER}comments/${curPostId}`), commData);
    runTransaction(ref(db, `${DB_VER}posts/${curPostId}/commentCount`), c => (c||0)+1); 
    
    const pSnap = await get(ref(db, `${DB_VER}posts/${curPostId}`));
    if(pSnap.exists()) {
        const p = pSnap.val();
        if(p.authorId !== me.id) {
            push(ref(db, `${DB_VER}notifications/${p.authorId}`), {
                type:'comm', uid:me.id, user:me.name, ava:me.photo, postId:curPostId, text: txt || '[Изображение]', ts:Date.now()
            });
        }
        if(txt) {
            const mentions = txt.match(/@([\wа-яА-ЯёЁ0-9_]+)/g);
            if(mentions) {
                get(ref(db, `${DB_VER}users`)).then(snap => {
                    if(!snap.exists()) return;
                    snap.forEach(uChild => {
                        const u = uChild.val();
                        mentions.forEach(mentionRaw => {
                            const refName = mentionRaw.substring(1).toLowerCase(); 
                            if((u.username && u.username.toLowerCase() === refName) || (u.name.toLowerCase() === refName)) {
                                if(u.id !== me.id) {
                                    push(ref(db, `${DB_VER}notifications/${u.id}`), {
                                        type:'mention', uid:me.id, user:me.name, ava:me.photo, postId:curPostId, text: txt, ts:Date.now()
                                    });
                                }
                            }
                        });
                    });
                });
            }
        }
    }

    document.getElementById('commInput').value = '';
    clearCommImg();
    document.getElementById('stickerPicker').classList.remove('active');
};

window.replyTo = (val) => { const inp = document.getElementById('commInput'); inp.value = `${val} ` + inp.value; inp.focus(); }

window.openEdit = () => { 
    document.getElementById('editName').value = me.name; 
    document.getElementById('editUsername').value = me.username || ''; 
    document.getElementById('editBio').value = me.bio || ''; 
    document.getElementById('editAva').src = me.photo; 
    newAva = null; 
    openSheet('modalEdit'); 
}

window.handleEditFile=(i)=>procImg(i,b=>{ newAva=b; document.getElementById('editAva').src=b; });

window.saveProfile = async () => { 
    const newName = document.getElementById('editName').value.trim();
    // Переводим в нижний регистр для проверки
    const newUsername = document.getElementById('editUsername').value.trim().replace(/@/g, '').toLowerCase(); 
    const newBio = document.getElementById('editBio').value.trim();
    
    if(!newName) return customAlert("Имя не может быть пустым");
    if(newUsername.length > 30) return customAlert("Юзернейм слишком длинный (макс. 30)");

    const forbidden = [
        'admin', 'adm', 'administrator', 
        'moder', 'mod', 'moderator', 
        'support', 'help', 'info', 
        'system', 'sys', 'bot', 
        'dev', 'developer', 'owner', 'founder', 'root',
        'pulse', 'staff', 'official'
    ];

    // Если пользователь НЕ админ, проверяем его ник на запрещенные слова
    if (!me.isAdmin && newUsername) {
        for (const word of forbidden) {
            if (newUsername.includes(word)) {
                return customAlert(`Юзернейм не может содержать слово "${word}"`);
            }
        }
    }
    // --------------------------------

    const up = { name: newName, bio: newBio };
    if(newAva) up.photo = newAva;
    if(newUsername) up.username = newUsername;

    if(newUsername && newUsername !== (me.username || '')) {
        const q = query(ref(db, `${DB_VER}users`), orderByChild('username'), equalTo(newUsername));
        const snap = await get(q);
        
        if(snap.exists()) {
            return customAlert("Этот юзернейм уже занят! Выберите другой.");
        }
    }

    update(ref(db, `${DB_VER}users/${me.id}`), up).then(() => { 
        closeAll(); 
        customAlert('Сохранено'); 
        
        me.name = newName;
        me.bio = newBio;
        me.username = newUsername;
        if(newAva) me.photo = newAva;
        updateUI();
    }); 
}

window.openEditComment = (cid, text, isSticker) => { 
    editingCommId = cid; 
    
    const txtArea = document.getElementById('editCommTxt');
    const saveBtn = document.getElementById('btnSaveComm');
    const title = document.getElementById('editCommTitle');

    if (isSticker) {
        txtArea.style.display = 'none';
        saveBtn.style.display = 'none';
        title.innerText = 'Управление стикером';
    } else {
        txtArea.style.display = 'block';
        saveBtn.style.display = 'block';
        txtArea.value = text.replace(/&apos;/g, "'").replace(/&quot;/g, '"');
        title.innerText = 'Редактировать';
    }
    
    openSheet('modalEditComment'); 
}
window.saveCommentEdit = () => {
    const txt = document.getElementById('editCommTxt').value.trim();
    if(!editingCommId || !curPostId) return;
    update(ref(db, `${DB_VER}comments/${curPostId}/${editingCommId}`), {text: txt}).then(() => { closeAll(); customAlert('Изменено'); });
}
window.deleteComment = () => {
    if(!editingCommId || !curPostId) return;
    remove(ref(db, `${DB_VER}comments/${curPostId}/${editingCommId}`));
    runTransaction(ref(db, `${DB_VER}posts/${curPostId}/commentCount`), c => (c > 0 ? c - 1 : 0));
    closeAll(); customAlert('Удалено');
}

window.openSettings=()=>{ 
    // Загрузка настроек в чекбоксы
    const settings = me.settings || {};
    document.getElementById('settHidePosts').checked = !!settings.hidePosts;
    document.getElementById('settPrivate').checked = !!settings.privateAccount;
    document.getElementById('settHideGifts').checked = !!settings.hideGifts;
    openSheet('modalSettings'); 
}

// === НОВАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ НАСТРОЕК ===
window.toggleAppSetting = (key) => {
    const newVal = document.getElementById(key === 'hidePosts' ? 'settHidePosts' : (key === 'privateAccount' ? 'settPrivate' : 'settHideGifts')).checked;
    
    if(!me.settings) me.settings = {};
    me.settings[key] = newVal;
    
    update(ref(db, `${DB_VER}users/${me.id}/settings`), me.settings);
}

window.openForeign = async(uid) => { 
    if(uid === me.id) { nav('profile'); return; }
    navigationHistory.push(uid);
    const s = await get(ref(db, `${DB_VER}users/${uid}`)); if(!s.exists()) { navigationHistory.pop(); return; }
    fUser = s.val(); userCache[fUser.id] = fUser; 
    
    // --- ОТОБРАЖЕНИЕ ПОДАРКА ЧУЖОГО ПРОФИЛЯ ---
    const giftContainer = document.getElementById('fGiftBadgeContainer');
    giftContainer.innerHTML = '';
    if(fUser.equippedGift) {
        let badgeHtml = '';
        if(fUser.equippedGift.startsWith('http')) {
            badgeHtml = `<img src="${fUser.equippedGift}" class="gift-avatar-badge">`;
        } else {
            badgeHtml = `<div class="gift-avatar-badge emoji">${fUser.equippedGift}</div>`;
        }
        giftContainer.innerHTML = badgeHtml;
    }
    // ------------------------------------------
    
    safeSetHtml('fName', `${fUser.name} ${getBadges(fUser)}`); 
    document.getElementById('fName').className = `tt-name ${fUser.equippedName||''}`;
    
    const fUsernameEl = document.getElementById('fUsername');
    if(fUser.username) {
        fUsernameEl.innerText = `@${fUser.username}`;
        fUsernameEl.style.display = 'block';
    } else {
        fUsernameEl.style.display = 'none';
    }

    safeSet('fBio', fUser.bio||''); 
    const fAva = document.getElementById('fAva'); if(fAva) { fAva.src = fUser.photo; fAva.className = `tt-ava ${fUser.equippedFrame||''}`; }
    
    applyProfileCover('fProfileCover', fUser.equippedBg);
    applyProfileTheme('fProfileThemeLayer', fUser.equippedProfileBg, 'view-foreign');

    safeSet('fSubs', fUser.followersCount||0); safeSet('fFol', fUser.followingCount||0); 
    
    onValue(query(ref(db, `${DB_VER}posts`), orderByChild('authorId'), equalTo(fUser.id)), (snap) => {
        let total = 0;
        snap.forEach(c => {
            const p = c.val();
            if(p.likes) total += p.likes;
        });
        safeSet('fLvl', total);
    });

    get(ref(db, `${DB_VER}followers/${fUser.id}/${me.id}`)).then(snap => { 
        updateFollowBtn(snap.exists()); 
        me._isFollowingForeign = snap.exists(); // Запоминаем статус подписки для проверки приватности
        switchProfileTab('posts'); // Загружаем после проверки подписки
    });
    
    nav('foreign');
}
window.openPostModal = (pid) => {
    get(ref(db, `${DB_VER}posts/${pid}`)).then(s => {
        if(s.exists()) { document.getElementById('postViewContent').innerHTML = renderPostString(s.val(), pid); openSheet('modalPostView'); }
    });
}
window.goBack = () => { if (navigationHistory.length > 0) { navigationHistory.pop(); if (navigationHistory.length > 0) openForeign(navigationHistory[navigationHistory.length - 1]); else nav('feed'); } else nav('feed'); };
function updateFollowBtn(isSub) { const btn = document.getElementById('btnFollow'); if(isSub) { btn.innerText='Вы подписаны'; btn.className='btn-tt'; } else { btn.innerText='Подписаться'; btn.className='btn-tt btn-tt-primary'; } }
window.toggleFollow = async() => {
    if(!fUser) return;
    const ref1 = ref(db, `${DB_VER}following/${me.id}/${fUser.id}`); const ref2 = ref(db, `${DB_VER}followers/${fUser.id}/${me.id}`);
    const snap = await get(ref2);
    if(snap.exists()) {
        await remove(ref2); await remove(ref1);
        runTransaction(ref(db, `${DB_VER}users/${fUser.id}/followersCount`), c=>c>0?c-1:0);
        runTransaction(ref(db, `${DB_VER}users/${me.id}/followingCount`), c=>c>0?c-1:0);
        updateFollowBtn(false);
        me._isFollowingForeign = false;
    } else {
        await set(ref2, {ts:Date.now()}); await set(ref1, {ts:Date.now()});
        runTransaction(ref(db, `${DB_VER}users/${fUser.id}/followersCount`), c=>(c||0)+1);
        runTransaction(ref(db, `${DB_VER}users/${me.id}/followingCount`), c=>(c||0)+1);
        updateFollowBtn(true);
        me._isFollowingForeign = true;
        push(ref(db, `${DB_VER}notifications/${fUser.id}`), {type:'sub', user:me.name, ava:me.photo, uid:me.id});
    }
};

window.nav = (v, el) => {
    document.querySelectorAll('.view-section').forEach(x => { x.classList.remove('active'); x.style.display = 'none'; });
    const targetSection = document.getElementById('view-' + v); if (targetSection) { targetSection.style.display = 'block'; setTimeout(() => { targetSection.classList.add('active'); }, 50); }
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active')); if (el) el.classList.add('active');
    window.scrollTo(0, 0);
    switch(v) { case 'profile': updateUI(); break; case 'shop': renderShop(); break; case 'discover': loadDiscover(); break; }
};

// === ИЗМЕНЕННАЯ ЛОГИКА ТАБОВ ПРОФИЛЯ С УЧЕТОМ ПРИВАТНОСТИ ===
window.switchProfileTab = (tab) => {
    activeProfileTab = tab;
    
    document.querySelectorAll('.tt-tab').forEach(t => t.classList.remove('active'));
    
    const myTab = document.getElementById('tab-' + tab);
    if(myTab) myTab.classList.add('active');
    
    const fTab = document.getElementById('f-tab-' + tab);
    if(fTab) fTab.classList.add('active');

    if (tab === 'gifts') {
        if(document.getElementById('view-profile').style.display === 'block') {
            loadProfileGifts('myPostsGrid', me.id);
        } else {
            // Проверка настроек для чужого профиля
            const s = fUser.settings || {};
            const isPrivate = s.privateAccount && !me._isFollowingForeign;
            
            if (isPrivate) {
                document.getElementById('fPostsGrid').innerHTML = '<div class="text-center text-muted p-5"><i class="fas fa-lock fa-3x mb-3"></i><br>Аккаунт закрыт</div>';
            } else if (s.hideGifts) {
                document.getElementById('fPostsGrid').innerHTML = '<div class="text-center text-muted p-5"><i class="fas fa-eye-slash fa-3x mb-3"></i><br>Подарки скрыты пользователем</div>';
            } else {
                loadProfileGifts('fPostsGrid', fUser.id);
            }
        }
    } else {
        if(document.getElementById('view-profile').style.display === 'block') {
            loadMyPosts();
        } else {
            // Проверка настроек для чужого профиля
            const s = fUser.settings || {};
            const isPrivate = s.privateAccount && !me._isFollowingForeign;
            
            if (isPrivate) {
                document.getElementById('fPostsGrid').innerHTML = '<div class="text-center text-muted p-5"><i class="fas fa-lock fa-3x mb-3"></i><br>Аккаунт закрыт</div>';
            } else if (s.hidePosts) {
                document.getElementById('fPostsGrid').innerHTML = '<div class="text-center text-muted p-5"><i class="fas fa-eye-slash fa-3x mb-3"></i><br>Посты скрыты пользователем</div>';
            } else {
                loadForeignPosts(); 
            }
        }
    }
}

// === ИСПРАВЛЕННАЯ ФУНКЦИЯ ЗАГРУЗКИ ПОДАРКОВ ===
function loadProfileGifts(gridId, uid) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '<div class="col-12 text-center py-4"><div class="spinner-border text-muted"></div></div>';
    
    get(ref(db, `${DB_VER}gifts/${uid}`)).then(s => {
        grid.innerHTML = ''; 
        if(!s.exists()) { 
            grid.innerHTML = '<div class="text-center text-muted p-4 col-12 small" style="grid-column: 1/-1;">Список подарков пуст</div>'; 
            return; 
        }
        
        // --- FIX: Преобразуем объект Firebase в массив ---
        const gifts = [];
        s.forEach(c => {
            gifts.push(c.val());
        });
        // ------------------------------------------------
        
        gifts.reverse().forEach(g => {
            let visual = g.icon.startsWith('http') 
                ? `<img src="${g.icon}" class="gift-card-img">` 
                : `<div style="font-size:40px;">${g.icon}</div>`;
            
            let onclickAction = '';
            if(uid === me.id) {
                onclickAction = `onclick="wearGift('${g.icon}')"`;
            }

            grid.innerHTML += `
            <div class="gift-card" ${onclickAction}>
                ${visual}
                <div class="gift-sender-tag">от ${g.from}</div>
            </div>`;
        });
    });
}

window.wearGift = async (iconUrl) => {
    const ok = await customConfirm('Надеть этот подарок на аватарку?');
    if(!ok) return;
    
    update(ref(db, `${DB_VER}users/${me.id}`), { equippedGift: iconUrl }).then(() => {
        me.equippedGift = iconUrl;
        updateUI();
        customAlert('Подарок установлен!');
        closeAll();
    });
}

function loadForeignPosts() {
    if(!fUser) return;
    const grid = document.getElementById('fPostsGrid');
    grid.innerHTML = '<div class="spinner-border text-muted m-auto"></div>';
    
    get(query(ref(db, `${DB_VER}posts`), orderByChild('authorId'), equalTo(fUser.id), limitToLast(50))).then(s => {
        grid.innerHTML = '';
        if(!s.exists()) { grid.innerHTML = '<div class="text-center text-muted p-4 col-12 small" style="grid-column: 1/-1;">Нет постов</div>'; return; }
        
        const arr = []; s.forEach(c => { arr.push({k: c.key, ...c.val()}); });
        
        grid.innerHTML = arr.filter(p => !p.isArchived).reverse().map(p => {
             const img = (p.images && p.images[0]) || p.img || fUser.photo;
             return `<div class="grid-post" onclick="openPostModal('${p.k}')"><img src="${img}" class="grid-img"><div style="position:absolute;bottom:5px;left:5px;text-shadow:0 2px 2px #000;font-size:12px;color:#fff"><i class="fas fa-heart"></i> ${p.likes||0}</div></div>`;
        }).join('');
    });
}

function loadMyPosts() {
    const grid = document.getElementById('myPostsGrid'); grid.innerHTML='<div class="col-12 text-center py-4"><div class="spinner-border text-muted"></div></div>';
    get(query(ref(db, `${DB_VER}posts`), limitToLast(100))).then(s => {
        grid.innerHTML = ''; if(!s.exists()) return;
        const arr = []; s.forEach(c => { arr.push({k:c.key,...c.val()}); }); arr.reverse();
        let filtered = [];
        if(activeProfileTab === 'posts') filtered = arr.filter(p => p.authorId === me.id && !p.isArchived);
        else if (activeProfileTab === 'likes') filtered = arr.filter(p => p.likesList && p.likesList[me.id] && !p.isArchived);
        else if (activeProfileTab === 'archived') filtered = arr.filter(p => p.authorId === me.id && p.isArchived);
        grid.innerHTML = filtered.map(p => {
             const img = (p.images && p.images[0]) || p.img || me.photo;
             return `<div class="grid-post" onclick="openPostModal('${p.k}')"><img src="${img}" class="grid-img"><div style="position:absolute;bottom:5px;left:5px;text-shadow:0 2px 2px #000;font-size:12px;color:#fff"><i class="fas fa-heart"></i> ${p.likes||0}</div></div>`;
        }).join('');
    });
}

function loadDiscover() {
    get(ref(db, `${DB_VER}users`)).then(s => { const users = []; s.forEach(c => { if(c.val().id !== me.id) users.push(c.val()); }); users.sort((a, b) => b.followersCount - a.followersCount); document.getElementById('recommendedUsers').innerHTML = users.slice(0, 10).map(u => `<div style="display:inline-block; margin-right:15px; text-align:center" onclick="openForeign('${u.id}')"><img src="${u.photo}" style="width:55px;height:55px;border-radius:50%;object-fit:cover;border:2px solid var(--border)"><div style="font-size:11px;margin-top:5px;width:60px;overflow:hidden;text-overflow:ellipsis">${u.name}</div></div>`).join(''); });
    get(query(ref(db, `${DB_VER}posts`), limitToLast(20))).then(s => { const posts = []; s.forEach(c => { posts.push({k:c.key,...c.val()}); }); posts.sort((a, b) => (b.likes || 0) - (a.likes || 0)); document.getElementById('popularPosts').innerHTML = posts.slice(0, 10).map(p => renderPostString(p, p.k)).join(''); });
}

window.renderShop = () => {
    const l = document.getElementById('shopList');
    // Если список пуст или меняем категорию - перерисовываем. Если нет - можно было бы оптимизировать, 
    // но для начала просто добавим ID кнопкам.
    l.innerHTML = '';
    const filtered = activeShopTab === 'all' ? SHOP_DB : SHOP_DB.filter(i => i.cat === activeShopTab);
    
    filtered.forEach(i => {
        const owned = me.inventory && me.inventory[i.id];
        let prev = '';
        if (i.type === 'badge') prev = i.val || '<i class="fas fa-crown fa-2x text-warning"></i>';
        else if (i.type === 'name') prev = `<b class="${i.css}">Nick</b>`;
        else if (i.type === 'frame') prev = `<div style="width:40px;height:40px;border-radius:50%;background:#333;" class="${i.css}"></div>`;
        else if (i.type === 'cover' || i.type === 'profile_bg') {
            if (i.val.endsWith('.mp4') || i.val.endsWith('.webm')) {
                prev = `<video src="${i.val}" class="shop-prev-media" autoplay loop muted playsinline></video>`;
            } else if (i.val.includes('url(')) {
                prev = `<div style="width:100%;height:100%;background:${i.val};background-size:cover;"></div>`;
            } else {
                prev = `<img src="${i.val}" class="shop-prev-media">`;
            }
        } else if (i.type === 'post_bg') prev = `<div style="width:100%;height:100%;background:${i.val};background-size:cover;border-radius:12px;border:1px solid #333"></div>`;

        let btn = `<button id="btn-shop-${i.id}" class="btn btn-sm btn-light w-100 rounded-pill fw-bold" onclick="buy('${i.id}',${i.price})">${i.price} <i class="fas fa-coins text-warning"></i></button>`;
        
        if (owned) {
            let eq = false;
            if (i.type === 'name' && me.equippedName === i.css) eq = true;
            if (i.type === 'frame' && me.equippedFrame === i.css) eq = true;
            if (i.type === 'cover' && me.equippedBg === i.val) eq = true;
            if (i.type === 'post_bg' && me.equippedPostBg === i.val) eq = true;
            if (i.type === 'badge' && me.equippedBadge === i.id) eq = true;
            if (i.type === 'profile_bg' && me.equippedProfileBg === i.val) eq = true;
            
            btn = eq 
                ? `<button id="btn-shop-${i.id}" class="btn btn-sm btn-secondary w-100" onclick="unequip('${i.type}', '${i.id}')">Снять</button>` 
                : `<button id="btn-shop-${i.id}" class="btn btn-sm btn-dark border w-100" onclick="equip('${i.type}','${i.id}')">Надеть</button>`;
        }
        l.innerHTML += `<div class="shop-item"><div class="shop-prev" style="font-size:24px">${prev}</div><div class="fw-bold mb-2 small text-truncate w-100">${i.name}</div>${btn}</div>`;
    });
}
window.buy = async (id, p) => {
    if ((me.coins || 0) < p) return customAlert('Мало монет');
    
    const ok = await customConfirm(`Купить за ${p}?`);
    if (!ok) return;

    const btn = document.getElementById(`btn-shop-${id}`);
    if(btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    }

    runTransaction(ref(db, `${DB_VER}users/${me.id}`), u => {
        if (!u) return;
        
        // ЗАЩИТА ОТ МИНУСА
        if ((u.coins || 0) < p) return; 

        u.coins -= p;
        if (!u.inventory) u.inventory = {};
        u.inventory[id] = true;
        return u;
    }).then((res) => {
        if(res.committed) {
            me.coins = res.snapshot.val().coins;
            if(!me.inventory) me.inventory = {};
            me.inventory[id] = true;
            
            safeSet('headCoins', me.coins);

            const item = SHOP_DB.find(x => x.id === id);
            if(btn && item) {
                btn.outerHTML = `<button id="btn-shop-${id}" class="btn btn-sm btn-dark border w-100" onclick="equip('${item.type}','${id}')">Надеть</button>`;
            }
            customAlert('Куплено!');
        } else {
            customAlert('Недостаточно средств!');
            if(btn) {
                 btn.disabled = false;
                 btn.innerHTML = `${p} <i class="fas fa-coins text-warning"></i>`;
            }
        }
    }).catch(e => {
        console.error(e);
        if(btn) { btn.disabled = false; btn.innerHTML = 'Ошибка'; }
    });
}
window.equip = (type, id) => {
    const item = SHOP_DB.find(x => x.id === id);
    if (!item) return;

    // 1. МГНОВЕННОЕ ОБНОВЛЕНИЕ ЛОКАЛЬНЫХ ДАННЫХ
    // Сохраняем старый ID предмета этого типа, чтобы вернуть кнопку "Надеть" для него
    let oldId = null;
    if(type === 'name') { oldId = SHOP_DB.find(x => x.css === me.equippedName)?.id; me.equippedName = item.css; }
    if(type === 'frame') { oldId = SHOP_DB.find(x => x.css === me.equippedFrame)?.id; me.equippedFrame = item.css; }
    if(type === 'cover') { oldId = SHOP_DB.find(x => x.val === me.equippedBg)?.id; me.equippedBg = item.val; }
    if(type === 'post_bg') { oldId = SHOP_DB.find(x => x.val === me.equippedPostBg)?.id; me.equippedPostBg = item.val; }
    if(type === 'badge') { oldId = me.equippedBadge; me.equippedBadge = item.id; }
    if(type === 'profile_bg') { oldId = SHOP_DB.find(x => x.val === me.equippedProfileBg)?.id; me.equippedProfileBg = item.val; }

    // 2. ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ПРОФИЛЯ (сразу же)
    updateUI(); 

    // 3. ОБНОВЛЕНИЕ КНОПОК В МАГАЗИНЕ (ТОЧЕЧНО)
    // Вернуть кнопку "Надеть" для старого предмета
    if(oldId) {
        const oldBtn = document.getElementById(`btn-shop-${oldId}`);
        if(oldBtn) {
            oldBtn.className = "btn btn-sm btn-dark border w-100";
            oldBtn.innerText = "Надеть";
            oldBtn.onclick = () => equip(type, oldId);
        }
    }
    // Поставить кнопку "Снять" для нового предмета
    const newBtn = document.getElementById(`btn-shop-${id}`);
    if(newBtn) {
        newBtn.className = "btn btn-sm btn-secondary w-100";
        newBtn.innerText = "Снять";
        newBtn.onclick = () => unequip(type, id);
    }

    // 4. ОТПРАВКА В БАЗУ (ФОНОМ)
    // Пользователь уже видит результат, база обновится через долю секунды
    let updateData = {};
    if (type === 'name') updateData.equippedName = item.css;
    if (type === 'frame') updateData.equippedFrame = item.css;
    if (type === 'cover') updateData.equippedBg = item.val;
    if (type === 'post_bg') updateData.equippedPostBg = item.val;
    if (type === 'badge') updateData.equippedBadge = item.id;
    if (type === 'profile_bg') updateData.equippedProfileBg = item.val;

    update(ref(db, `${DB_VER}users/${me.id}`), updateData).catch(e => {
        // Если вдруг ошибка сети - можно тут показать алерт, но это редкость
        console.error("Ошибка сохранения стиля", e);
    });
    
    // Убираем алерт "Применено", так как изменение и так видно сразу
}

window.unequip = (type, id) => {
    // 1. Локальное обновление
    if(type==='name') me.equippedName = null;
    if(type==='frame') me.equippedFrame = null;
    if(type==='cover') me.equippedBg = null;
    if(type==='post_bg') me.equippedPostBg = null;
    if(type==='badge') me.equippedBadge = null;
    if(type==='profile_bg') me.equippedProfileBg = null;

    // 2. Обновление UI
    updateUI();

    // 3. Обновление кнопки в магазине
    const btn = document.getElementById(`btn-shop-${id}`);
    if(btn) {
        btn.className = "btn btn-sm btn-dark border w-100";
        btn.innerText = "Надеть";
        btn.onclick = () => equip(type, id);
    }

    // 4. Сохранение в базу
    let field = type==='name'?'equippedName':(type==='frame'?'equippedFrame':(type==='cover'?'equippedBg':(type==='post_bg'?'equippedPostBg':(type==='badge'?'equippedBadge':(type==='profile_bg'?'equippedProfileBg':null)))));
    if (field) update(ref(db, `${DB_VER}users/${me.id}`), { [field]: null });
}
window.switchShopTab = (tab, el) => { activeShopTab = tab; document.querySelectorAll('.shop-tab').forEach(x => x.classList.remove('active')); el.classList.add('active'); renderShop(); }

window.openGiftModal = () => { 
    if(!fUser) return; 
    const gList = document.getElementById('giftListGrid'); 
    gList.innerHTML = ''; 
    
    GIFT_DB.forEach(g => { 
        // Логика: если тип 'img', вставляем картинку, иначе смайлик
        let visual = '';
        if (g.type === 'img') {
            visual = `<img src="${g.icon}" style="width:60px; height:60px; object-fit:contain; margin-bottom:5px; filter:drop-shadow(0 5px 10px rgba(0,0,0,0.3));">`;
        } else {
            visual = `<div style="font-size:36px; margin-bottom:5px">${g.icon}</div>`;
        }

        gList.innerHTML += `
        <div class="shop-item clickable" onclick="sendGift('${g.id}')">
            ${visual}
            <div class="fw-bold" style="font-size:13px; color:#fff;">${g.name}</div>
            <div class="text-warning fw-bold small">${g.price} <i class="fas fa-coins"></i></div>
        </div>`; 
    }); 
    openSheet('modalSendGift'); 
}
window.sendGift = (gid) => {
    if (!fUser) return;
    if (isGiftProcessing) return; // Защита от двойного клика

    const item = GIFT_DB.find(x => x.id === gid);
    
    // 1. Предварительная проверка (визуальная)
    if ((me.coins || 0) < item.price) return customAlert('Не хватает монет!');

    isGiftProcessing = true;
    customAlert("Отправка...", "Подождите");

    runTransaction(ref(db, `${DB_VER}users/${me.id}`), u => {
        if (!u) return;
        
        // 2. ГЛАВНАЯ ЗАЩИТА: Если на сервере денег меньше чем цена — отменяем операцию
        if ((u.coins || 0) < item.price) {
            return; // Возвращаем undefined, транзакция прерывается
        }
        
        u.coins -= item.price;
        return u;
    })
    .then(res => {
        isGiftProcessing = false;
        
        if (res.committed) {
            // Транзакция прошла успешно
            // Обновляем локальный баланс точно как на сервере
            me.coins = res.snapshot.val().coins; 
            safeSet('headCoins', me.coins);

            push(ref(db, `${DB_VER}gifts/${fUser.id}`), { from: me.name, icon: item.icon, price: item.price, name: item.name });
            push(ref(db, `${DB_VER}notifications/${fUser.id}`), {
                type: 'gift', uid: me.id, user: me.name, ava: me.photo, giftName: item.name, giftIcon: item.icon
            });
            
            closeAll();
            closeCustomModal(); // Закрываем "Отправка..."
            customAlert('Подарок отправлен!');
        } else {
            // Транзакция не прошла (денег не хватило в момент записи)
            closeCustomModal();
            customAlert('Недостаточно средств!');
        }
    })
    .catch(e => {
        isGiftProcessing = false;
        console.error(e);
        closeCustomModal();
    });
}
window.openFullGifts = () => {
    const grid = document.getElementById('fullGiftsGrid'); 
    grid.innerHTML = '<div class="spinner-border text-primary m-auto"></div>'; 
    openSheet('modalGiftCollection');
    
    get(ref(db, `${DB_VER}gifts/${me.id}`)).then(s => {
        grid.innerHTML = ''; 
        if(!s.exists()) { 
            grid.innerHTML = '<div class="text-muted w-100 text-center small" style="grid-column:1/-1">У вас пока нет подарков</div>'; 
            return; 
        }
        
        // --- FIX: Преобразуем объект Firebase в массив ---
        const gifts = [];
        s.forEach(c => {
            gifts.push(c.val());
        });
        // ------------------------------------------------
        
        // Группируем для количества, но оставляем возможность выбрать любой
        const counts = {}; 
        gifts.forEach(g => {
            if(!counts[g.icon]) counts[g.icon] = {count:0, ...g};
            counts[g.icon].count++;
        });

        Object.values(counts).forEach(g => {
             let visual = g.icon.startsWith('http') 
                 ? `<img src="${g.icon}" style="width:70px; height:70px; object-fit:contain; filter:drop-shadow(0 5px 15px rgba(0,0,0,0.4));">` 
                 : `<div style="font-size:45px">${g.icon}</div>`;

             // ИСПРАВЛЕНИЕ: Добавлен onclick="wearGift" для "Моей коллекции"
             grid.innerHTML += `
             <div class="shop-item clickable" onclick="wearGift('${g.icon}')" style="position:relative; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.03);">
                <div style="position:absolute; top:8px; right:8px; background:var(--primary); color:#fff; font-size:11px; padding:2px 8px; border-radius:10px; font-weight:800; box-shadow:0 2px 5px rgba(0,0,0,0.3)">x${g.count}</div>
                ${visual}
                <div class="fw-bold small mt-3" style="color:#e4e4e7">${g.name}</div>
             </div>`;
        });
    });
}
window.openTransfer=()=>{ if(!fUser) return; safeSet('transDestName', fUser.name); openSheet('modalTransfer'); }
window.doTransfer = () => {
    const sum = parseInt(document.getElementById('transAmount').value);
    const btn = document.querySelector('#modalTransfer .btn-main');

    if (isNaN(sum) || sum <= 0) return customAlert('Неверная сумма');
    if ((me.coins || 0) < sum) return customAlert('Не хватает');

    const oldText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Отправка...";

    runTransaction(ref(db, `${DB_VER}users/${me.id}`), u => {
        if (!u) return;
        // ЗАЩИТА ОТ МИНУСА
        if ((u.coins || 0) < sum) return;
        
        u.coins -= sum;
        return u;
    }).then(res => {
        btn.disabled = false;
        btn.innerText = oldText;
        
        if (res.committed) {
            me.coins = res.snapshot.val().coins;
            safeSet('headCoins', me.coins);
            
            runTransaction(ref(db, `${DB_VER}users/${fUser.id}`), u => {
                if (u) u.coins = (u.coins || 0) + sum;
                return u;
            });
            push(ref(db, `${DB_VER}notifications/${fUser.id}`), {
                type: 'transfer', uid: me.id, user: me.name, ava: me.photo, amount: sum
            });
            closeAll();
            customAlert(`Переведено!`);
        } else {
            customAlert("Ошибка: недостаточно средств!");
        }
    });
}
window.openFollowList = (type, target) => { 
    const uid = target === 'me' ? me.id : fUser.id; document.getElementById('flTitle').innerText = type==='followers'?'Фанаты':'Подписки'; openSheet('modalFollowList');
    const l = document.getElementById('flContent'); l.innerHTML = '<div class="text-center mt-4"><div class="spinner-border text-primary"></div></div>'; 
    get(ref(db, `${DB_VER}${type}/${uid}`)).then(async s => { 
        if(!s.exists()) { l.innerHTML = '<div class="text-center text-muted mt-4">Пусто</div>'; return; } 
        const ids = Object.keys(s.val()); l.innerHTML = ''; 
        for(const id of ids) { 
            const uSnap = await get(ref(db, `${DB_VER}users/${id}`)); 
            if(uSnap.exists()) { const u = uSnap.val(); l.innerHTML += `<div class="d-flex align-items-center gap-3 mb-3" onclick="openForeign('${u.id}')"><img src="${u.photo}" style="width:45px;height:45px;border-radius:50%;object-fit:cover" class="${u.equippedFrame||''}"><div class="fw-bold ${u.equippedName||''}">${u.name}</div></div>`; } 
        } 
    }); 
}
window.openNotifs=()=>{ 
    openSheet('modalNotifs'); 
    const l=document.getElementById('notifList'); 
    l.innerHTML='<div class="text-center mt-4"><div class="spinner-border text-primary"></div></div>'; 
    
    get(query(ref(db, `${DB_VER}notifications/${me.id}`), limitToLast(50))).then(s=>{ 
        l.innerHTML=''; 
        if(!s.exists()) {l.innerHTML='<div class="text-center text-muted py-4">Нет новых уведомлений</div>';return;} 
        
        let arr=[]; s.forEach(c => { arr.push({k:c.key,...c.val()}); }); 
        
        arr.reverse().forEach(n=>{ 
            let content = '';
            let icon = '';
            let action = '';

            if(n.type === 'sub') {
                icon = '<i class="fas fa-user-plus text-primary"></i>';
                content = `подписался на вас`;
                action = `openForeign('${n.uid}')`;
            } else if (n.type === 'like') {
                icon = '<i class="fas fa-heart text-danger"></i>';
                content = `оценил вашу запись`;
                action = `openPostModal('${n.postId}')`;
            } else if (n.type === 'comm') {
                icon = '<i class="fas fa-comment text-success"></i>';
                const txt = n.text && n.text.length > 20 ? n.text.substring(0,20)+'...' : (n.text || 'комментарий');
                content = `прокомментировал: <span style="color:#fff">"${txt}"</span>`;
                action = `openPostModal('${n.postId}')`;
            } else if (n.type === 'mention') {
                icon = '<i class="fas fa-at text-info"></i>';
                const txt = n.text && n.text.length > 20 ? n.text.substring(0,20)+'...' : (n.text || '...');
                content = `упомянул вас в комментарии: <span style="color:#fff">"${txt}"</span>`;
                action = `openPostModal('${n.postId}')`;
            } else if (n.type === 'gift') {
    icon = '<i class="fas fa-gift text-warning"></i>';
    // Проверка: если иконка это ссылка, рисуем img, иначе текст
    const giftVisual = n.giftIcon && n.giftIcon.startsWith('http') 
        ? `<img src="${n.giftIcon}" style="width:20px;height:20px;vertical-align:middle;margin-left:5px">` 
        : (n.giftIcon || '');
        
    content = `отправил подарок: <b>${n.giftName || 'Сюрприз'}</b> ${giftVisual}`;
    action = `openForeign('${n.uid}')`;

            } else if (n.type === 'transfer') {
                icon = '<i class="fas fa-coins text-warning"></i>';
                content = `перевел вам <b>${n.amount}</b> монет`;
                action = `openForeign('${n.uid}')`;
            } else {
                icon = '<i class="fas fa-bell text-muted"></i>';
                content = 'Новое уведомление';
                action = `openForeign('${n.uid}')`;
            }

            l.innerHTML += `
            <div class="notif-item" onclick="${action}">
                <div style="position:relative">
                    <img src="${n.ava}" style="width:45px;height:45px;border-radius:50%;object-fit:cover;border:1px solid #333;">
                    <div class="notif-icon-box">
                        ${icon}
                    </div>
                </div>
                <div style="flex:1">
                    <div class="notif-user">${n.user}</div>
                    <div class="notif-text">${content}</div>
                    <div class="notif-time">${moment(n.ts||Date.now()).fromNow()}</div>
                </div>
            </div>`; 
            
            update(ref(db, `${DB_VER}notifications/${me.id}/${n.k}`), {read:true}); 
        }); 
    }); 
}

window.clearNotifs=()=>{ remove(ref(db, `${DB_VER}notifications/${me.id}`)); document.getElementById('notifList').innerHTML='Пусто'; }
window.openLeaderboard=()=>{ openSheet('modalLeaderboard'); const l=document.getElementById('leaderList'); l.innerHTML='...'; get(ref(db, `${DB_VER}users`)).then(s=>{ const arr=[]; s.forEach(c => { arr.push(c.val()); }); arr.sort((a,b)=>(b.coins||0)-(a.coins||0)); l.innerHTML = arr.slice(0,20).map((u,i)=>`<div class="d-flex gap-3 align-items-center mb-2 p-2 bg-dark rounded" onclick="openForeign('${u.id}')"><b>#${i+1}</b><img src="${u.photo}" style="width:30px;height:30px;border-radius:50%"><span>${u.name}</span><span class="ms-auto text-warning fw-bold">${u.coins}</span></div>`).join(''); }); }
window.openWheel=()=>{ openSheet('modalWheel'); }
window.spinWheel=()=>{ const last = me.lastBonus || 0; if(Date.now() - last < 86400000) return customAlert('Жди 24ч!'); document.getElementById('spinBtn').disabled = true; const deg = 3600 + Math.random() * 360; document.getElementById('luckyWheel').style.transform = `rotate(${deg}deg)`; setTimeout(()=>{ const prize = [50, 100, 200, 500, 20, 1000][Math.floor(Math.random()*6)]; customAlert(`Выигрыш: ${prize} монет!`); runTransaction(ref(db, `${DB_VER}users/${me.id}`), u=>{ if(u){ u.coins=(u.coins||0)+prize; u.lastBonus=Date.now(); } return u; }); confetti({particleCount:150, spread:70, origin:{y:0.6}}); closeAll(); document.getElementById('spinBtn').disabled = false; }, 4000); }
window.formatPostText = (text) => {
    if (!text) return '';
    let safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    safe = safe.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    
    safe = safe.replace(/#(\w+)/g, '<span class="rich-tag" onclick="searchTag(\'$1\')">#$1</span>');
    
    safe = safe.replace(/@(\w+)/g, '<span class="rich-mention" onclick="findUserAndOpen(\'$1\')">@$1</span>');
    
    return safe;
}

window.searchTag = (tag) => {
    document.getElementById('searchInput').value = '#' + tag;
    openSearch();
    doSearch('#' + tag);
}

window.doubleTapLike = (key) => {
    like(key); 
    
    const heart = document.getElementById(`big-heart-${key}`);
    if(heart) {
        heart.classList.remove('active');
        void heart.offsetWidth; 
        heart.classList.add('active');
    }
}

window.openSettings=()=>{ openSheet('modalSettings'); }
window.openSearch = () => { openSheet('modalSearch'); document.getElementById('searchInput').focus(); }
window.doSearch = throttle(function(val) { const res = document.getElementById('searchResult'); if(val.length < 2) { res.innerHTML=''; return; } get(ref(db, `${DB_VER}users`)).then(s => { res.innerHTML = ''; s.forEach(c => { const u = c.val(); if(u.name.toLowerCase().includes(val.toLowerCase())) { res.innerHTML += `<div class="d-flex gap-2 align-items-center p-2 mb-2 bg-dark rounded clickable" onclick="openForeign('${u.id}')"><img src="${u.photo}" style="width:40px;height:40px;border-radius:50%"><div><b>${u.name}</b></div></div>`; } }); }); }, 300);
function procImg(input, callback) {
    if (!input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const MAX_WIDTH = 800; 
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(dataUrl);
        }
    };
    reader.readAsDataURL(file);
}

window.openSheet=(id)=>{ document.getElementById('overlay').classList.add('open'); document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; }
window.closeAll=()=>{ document.getElementById('overlay').classList.remove('open'); document.querySelectorAll('.sheet').forEach(x=>x.classList.remove('open')); document.body.style.overflow = ''; }
moment.locale('ru'); 
init();