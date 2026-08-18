(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`modulepreload`,t=function(e){return`/`+e},n={},r=function(r,i,a){let o=Promise.resolve();if(i&&i.length>0){let r=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function u(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}o=l(i.map(i=>{if(i=t(i,a),i=u(i),i in n)return;n[i]=!0;let o=i.endsWith(`.css`);for(let e=r.length-1;e>=0;e--){let t=r[e];if(t.href===i&&(!o||t.rel===`stylesheet`))return}let s=document.createElement(`link`);if(s.rel=o?`stylesheet`:e,o||(s.as=`script`),s.crossOrigin=``,s.href=i,c&&s.setAttribute(`nonce`,c),document.head.appendChild(s),o)return new Promise((e,t)=>{s.addEventListener(`load`,e),s.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${i}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(e=>{for(let t of e||[])t.status===`rejected`&&s(t.reason);return r().catch(s)})},i=`/mediapipe`,a=`/models/pose_landmarker_lite.task`,o=900,s=null,c=null,l=null,u=null,d=null,f=!1,p=!1,m=0,h=-1,g=0,_=0,v=0,y=!1,b=[],x=``;function S(e,t){let n=`${e}:${t}`;n!==x&&(x=n,window.dispatchEvent(new CustomEvent(`hadang:vision-status`,{detail:{kind:e,message:t}})))}async function C(){if(s)return s;S(`loading`,`Memuat model pose AI...`),u||({DrawingUtils:c,FilesetResolver:l,PoseLandmarker:u}=await r(()=>import(`./vision_bundle-HtqZiiLO.js`),[]));let e=await l.forVisionTasks(i),t={baseOptions:{modelAssetPath:a,delegate:`GPU`},runningMode:`VIDEO`,numPoses:1,minPoseDetectionConfidence:.55,minPosePresenceConfidence:.55,minTrackingConfidence:.5};try{s=await u.createFromOptions(e,t)}catch{t.baseOptions.delegate=`CPU`,s=await u.createFromOptions(e,t)}return s}function w(e,t){let n=document.querySelector(`#vision-hold-meter`),r=document.querySelector(`#vision-motion-label`);n&&n.style.setProperty(`--hold`,`${Math.round(e*100)}%`),r&&(r.textContent=t)}function T(e){let t=document.querySelector(`#vision-player-marker`);if(!t)return;let n=(e[23].x+e[24].x)/2,r=(e[23].y+e[24].y)/2;t.style.left=`${Math.min(92,Math.max(8,(1-n)*100))}%`,t.style.top=`${Math.min(78,Math.max(22,r*100))}%`}function E(e){let t=e[11],n=e[12],r=e[15],i=e[16],a=(e[23].y+e[24].y)/2,o=[t,n,r,i].every(e=>(e.visibility??1)>.45),s=r.y<t.y&&i.y<n.y,c=Math.abs(t.x-n.x),l=Math.abs(r.x-i.x)>c*1.65&&r.y<a&&i.y<a;return o&&(s||l)}function D(e,t){let n=t.getContext(`2d`);if(n.clearRect(0,0,t.width,t.height),!e.landmarks.length)return;let r=new c(n);r.drawConnectors(e.landmarks[0],u.POSE_CONNECTIONS,{color:`#62e6d5`,lineWidth:3}),r.drawLandmarks(e.landmarks[0],{color:`#ffffff`,fillColor:`#2468ef`,lineWidth:1,radius:3})}function O(){return document.querySelector(`[data-current-vision-line]`)?.dataset.currentVisionLine||``}function k(){cancelAnimationFrame(m);let e=document.querySelector(`#community-vision-video`),t=document.querySelector(`#community-vision-canvas`);if(!(!f||!p||!e||!t||!s)){if(e.readyState>=2&&e.currentTime!==h){h=e.currentTime,(t.width!==e.videoWidth||t.height!==e.videoHeight)&&(t.width=e.videoWidth||640,t.height=e.videoHeight||480);let n=performance.now(),r=s.detectForVideo(e,n);D(r,t);let i=r.landmarks[0];if(!i)y=!1,v=0,g=0,S(`searching`,`Posisikan satu pemain di dalam bingkai`),w(0,`Tubuh belum terdeteksi`);else if(T(i),!y){v||=n;let e=Math.min(1,(n-v)/1e3);S(`calibrating`,`Kalibrasi ${Math.round(e*100)}%`),w(e,`Berdiri di tengah dan lihat kamera`),e>=1&&(y=!0,g=0,S(`ready`,`Tubuh terdeteksi - arena siap`))}else if(!O())w(0,`Semua garis berhasil dihadang`);else if(E(i)&&n-_>1400){g||=n;let e=Math.min(1,(n-g)/o);if(S(`tracking`,`Pose Hadang terbaca`),w(e,e<1?`Tahan pose Hadang...`:`Garis berhasil dihadang`),e>=1){let e=O();_=n,g=0,navigator.vibrate?.(80),window.dispatchEvent(new CustomEvent(`hadang:vision-line-complete`,{detail:{line:e}}))}}else g=0,S(`ready`,`Tubuh terdeteksi - arena siap`),w(0,`Angkat kedua tangan untuk Hadang`)}m=requestAnimationFrame(k)}}function A(e=[]){b=[...e]}function ee(){p=!1,cancelAnimationFrame(m),m=0,x=``}function te(e=b){A(e);let t=document.querySelector(`#community-vision-video`);!t||!d||!f||(p=!0,t.srcObject=d,t.play().catch(()=>{}),S(y?`ready`:`calibrating`,y?`Tubuh terdeteksi - arena siap`:`Menyiapkan kalibrasi`),k())}async function j(e=[]){if(A(e),!navigator.mediaDevices?.getUserMedia)return S(`error`,`Kamera tidak didukung browser ini`),!1;try{return S(`loading`,`Meminta izin kamera...`),d||=await navigator.mediaDevices.getUserMedia({video:{facingMode:`user`,width:{ideal:640},height:{ideal:480}},audio:!1}),await C(),f=!0,y=!1,v=0,te(e),!0}catch(e){console.error(`Community vision could not start`,e?.name||`Error`,e?.message||String(e),e?.stack||``);let t=e?.name===`NotAllowedError`||e?.name===`SecurityError`;return ne(),S(`error`,t?`Izin kamera ditolak. Gunakan kontrol manual.`:`Model AI gagal dimuat. Gunakan kontrol manual.`),!1}}function ne(){ee(),d?.getTracks().forEach(e=>e.stop()),d=null,f=!1,y=!1,v=0,g=0,h=-1,S(`idle`,`Kamera tidak aktif`)}function re(){return f}var M={"· W/S atau panah untuk bergerak":`· W/S or arrows to move`,"'posisi terbatas' mendorong keputusan cepat.":`'limited positions' encourage quick decisions.`,'"Nak, ini Mama. Nomor Mama sedang bermasalah. Tolong transfer sekarang dan jangan telepon dulu."':`"Son, this is Mama. Mama's number is having problems. Please transfer now and don't call yet."`,"&#8592; Ganti Konten":`← Replace Content`,"+24 minggu ini":`+24 this week`,'= 70 ? "Perlu verifikasi lebih lanjut" : "Sinyal sedang - periksa bukti resmi"; return `':'= 70 ? "Requires further verification" : "Medium signal - check official evidence"; return `',"0 - belum yakin":`0 - not sure yet`,'1 ? 84 : 72], ["Pemeriksaan bukti", state.evidence === profile.preferredEvidence ? 92 : 70], ["Kesadaran risiko aksi", state.saferAction ? 86 : 68], ]; return `':'1 ? 84 : 72], ["Evidence check", state.evidence === profile.preferredEvidence ? 92 : 70], ["Action risk awareness", state.saferAction ? 86 : 68], ]; return `',"2. Bahas pertanyaan garis aktif.":`2. Discuss active line questions.`,"4 garis J.E.D.A.":`4 lines J.E.D.A.`,"4 garis nalar":`4 lines of reasoning`,"4-120 orang":`4-120 people`,"47% langsung scan sebelum latihan":`47% scanned immediately before training`,"8 skenario multimodal":`8 multimodal scenarios`,"Ada pola kompresi berulang yang dapat berasal dari edit atau aplikasi pesan.":`There are repeated compression patterns that can come from editing or messaging applications.`,"Adakah pertanyaan yang hanya keluarga asli dapat jawab?":`Are there questions that only the real family can answer?`,"AI belum akan ditampilkan sampai kamu menyelesaikan tahap berpikir awal.":`The AI ​​won't be displayed until you complete the initial thinking stage.`,"AI Context Guard Web yang Dilokalkan Menjadi HADANGIN":`Localized Web AI Context Guard Becomes HADANGIN`,"AI hanya membuka pola setelah manusia bermain; keputusan dan skor tetap berasal dari peserta.":`The AI ​​only uncovers patterns after humans play; Decisions and scores remain those of the participants.`,"AI Lens membantu melihat sinyal manipulasi dan hal yang masih perlu diverifikasi.":`AI Lens helps spot signals of manipulation and things that still need to be verified.`,"AI lokal &middot; Tanpa rekaman":`Local AI · No recording`,"AI membantu membaca sinyal, konteks, pola forensik, dan ketidakpastian.":`AI helps read signals, context, forensic patterns and uncertainties.`,"AI membantu menemukan pola dan sinyal yang mungkin terlewat.":`AI helps spot patterns and signals that you might otherwise miss.`,"AI membantu pengguna tahu bukti apa yang perlu diverifikasi.":`AI helps users know what evidence needs to be verified.`,"AI memberi second opinion. Keputusan final tetap berada padamu.":`AI provides a second opinion. The final decision remains with you.`,"AI memberi sinyal; bukti dan penalaranmu menentukan maknanya.":`AI signals; your evidence and reasoning determine the meaning.`,"AI mendukung keputusan, bukan mengambil alih keputusan.":`AI supports decisions, not takes over decisions.`,"AI menghadang empat sinyal sebelum tindakan.":`The AI ​​intercepts four signals before action.`,"AI menjelaskan mengapa sinyal muncul dan menunjukkan batasnya.":`AI explains why a signal appears and shows its limits.`,"AI simulasi akan memetakan struktur QR dan tujuan yang terbaca.":`AI simulation will map the QR structure and read destination.`,"AI tidak mengakses akun layananmu.":`AI does not access your service account.`,"Ajakan investasi segera muncul tanpa kanal resmi.":`Investment invitations immediately appeared without official channels.`,"Ajakan menyebarkan muncul sebelum bukti diberikan.":`The invitation to spread appears before the evidence is provided.`,"Ajukan pertanyaan rahasia keluarga":`Ask secret family questions`,akan:`will`,"Aktifkan saat penjaga sudah siap di depan layar.":`Activate when the guard is ready in front of the screen.`,"AKUN TIDAK TERVERIFIKASI":`ACCOUNT IS NOT VERIFIED`,"Akun yang pertama mengirim":`The first account to send`,"Alamat ditampilkan tanpa dibuka. Cocokkan dengan domain resmi melalui kanal independen.":`The address is displayed without opening it. Match with official domains through independent channels.`,"Alamat tujuan yang ingin diperiksa":`The destination address you want to check`,aman:`safe`,"Aman Bertransaksi":`Safe Transactions`,"Amati konteks, sumber, detail visual, dan tindakan yang diminta sebelum melihat analisis AI.":`Observe the context, source, visual details, and requested action before viewing the AI ​​analysis.`,"Amati posisi stiker dan pastikan nama penerima sebelum memindai.":`Observe the position of the sticker and confirm the recipient's name before scanning.`,"Ancaman blokir dalam 30 menit":`Threat of blocking in 30 minutes`,"Angka di halaman ini adalah data simulatif untuk pitch UNESCO. Saat backend ditambahkan, struktur ini dapat diisi dari event pemeriksaan nyata.":`The numbers on this page are simulative data for the UNESCO pitch. When a backend is added, this structure can be populated from real check events.`,"Angkat Kartu Keputusan: apa respons pertamamu?":`Raise the Decision Card: what is your first response?`,"Angkat kartu sekali lagi":`Raise the card again`,"Angkat kedua tangan untuk Hadang":`Raise both hands to Block`,"Apa dampaknya jika kamu share dan ternyata keliru?":`What will be the impact if you share and it turns out to be wrong?`,"Apa langkah alternatif yang lebih aman?":`What are safer alternative steps?`,"Apa pemeriksaan paling independen untuk klaim viral?":`What is the most independent check for viral claims?`,"Apa respons pertamamu jika ini terjadi di dunia nyata?":`What would your first response be if this happened in the real world?`,"Apa respons pertamamu sebelum mendapat petunjuk?":`What is your first response before getting a clue?`,"Apa risiko jika transfer dilakukan sebelum konfirmasi?":`What are the risks if the transfer is made before confirmation?`,"Apa sebenarnya yang diminta informasi ini darimu?":`What exactly is this information asking of you?`,"Apa tindakan aman ketika konteks belum lengkap?":`What is the safe action when the context is incomplete?`,"Apa yang dibaca AI?":`What does AI read?`,"Apa yang dinilai manusia?":`What do humans value?`,"Apa yang harus dilakukan sebelum menyelesaikan pembayaran?":`What should I do before completing payment?`,"Apa yang membuat informasi ini terasa harus segera ditindaklanjuti?":`What makes this information feel like it needs to be acted upon immediately?`,"Apa yang membuat orang ingin langsung memindai QR?":`What makes people want to scan QR directly?`,"Apa yang Mengubah Pikiranmu?":`What Changed Your Mind?`,apakah:`whether`,"Apakah ada kanal pembayaran resmi lain?":`Are there other official payment channels?`,"Apakah ada laporan independen yang menyebut hal sama?":`Is there an independent report that says the same thing?`,"Apakah ada versi asli dengan konteks lengkap?":`Is there an original version with complete context?`,"Apakah aplikasi resmi menampilkan pengumuman yang sama?":`Does the official app show the same announcement?`,"Apakah bank mengirim pemberitahuan lain.":`Did the bank send any other notifications.`,"Apakah cuplikan sudah disunting.":`Has the trailer been edited?`,"Apakah deteksi visual melewatkan perubahan.":`Does visual detection miss changes.`,"Apakah domain email pengirim cocok dengan perusahaan?":`Does the sender's email domain match the company's?`,"Apakah kamu mengetik alamat resmi sendiri, bukan dari link?":`Did you type the official address yourself, not from a link?`,"Apakah kamu sudah menelepon nomor keluarga yang tersimpan?":`Have you called the saved family number?`,"Apakah kasir mengonfirmasi QR ini secara langsung?":`Does the cashier confirm this QR directly?`,"Apakah keadaan darurat benar terjadi.":`Did an emergency really occur?`,"Apakah keputusan kelompok berubah?":`Has the group's decision changed?`,"Apakah materi sudah dipotong.":`Has the material been cut?`,"Apakah model salah membaca sinyal.":`Is the model misreading the signal.`,"Apakah nama penerima cocok dengan merchant?":`Does the recipient's name match that of the merchant?`,"Apakah notifikasi yang sama ada di aplikasi bank resmi?":`Is the same notification available on the official bank app?`,"Apakah pengguna belajar dari clue?":`Do users learn from clues?`,"Apakah perusahaan resmi meminta deposit?":`Does the company officially ask for a deposit?`,"Apakah pesan meminta OTP atau data sensitif?":`Does the message ask for an OTP or sensitive data?`,"Apakah pola suara kebetulan mirip data referensi.":`Does the sound pattern happen to resemble the reference data?`,"Apakah posisi tersebut benar tersedia.":`Is the position really available?`,"Apakah produk investasi punya izin resmi?":`Does the investment product have official permission?`,"Apakah QR benar diganti merchant.":`Is the QR really replaced by the merchant?`,"Apakah suara sintetis atau rekaman asli yang terkompresi.":`Is it a synthetic sound or a compressed original recording.`,"Apakah video ini ada di kanal resmi tokoh?":`Is this video on the character's official channel?`,"Arena 3D belum tersedia":`3D Arena is not yet available`,"Arena 3D tidak dapat dimuat":`3D Arena could not be loaded`,"Arena Gobak Sodor 3D interaktif dengan empat penjaga J.E.D.A.":`Interactive 3D Gobak Sodor Arena with four J.E.D.A. guards.`,"Baca laporan dari beberapa sumber":`Read reports from several sources`,"Baca struktur alamat tanpa membuka tautan dan cocokkan dengan kanal bank resmi.":`Read the address structure without opening the link and match it with the official bank channel.`,"Bagian mana yang paling mempersempit waktu berpikir?":`Which part narrows down your thinking time the most?`,"Bagikan dengan tanda tanya":`Share with a question mark`,"Bandingkan dengan Penilaian Saya":`Compare with My Rating`,"Bandingkan dengan QR di kasir utama.":`Compare with QR at the main cashier.`,"Bandingkan informasi melalui kanal yang tidak diberikan oleh pesan mencurigakan.":`Compare information through channels that are not provided by suspicious messages.`,"Bandingkan penalaranmu, sinyal AI, dan bukti yang independen.":`Compare your reasoning, AI signals, and independent evidence.`,"Bandingkan skor AI dengan bukti resmi dan kenali kemungkinan false positive.":`Compare AI scores with official evidence and identify potential false positives.`,"Bayangkan ada pesan yang membuatmu ingin langsung bertindak.":`Imagine there is a message that makes you want to act immediately.`,"Bedakan tampilan profesional dari bukti rekrutmen yang dapat diverifikasi.":`Distinguish a professional appearance from verifiable proof of recruitment.`,belum:`Not yet`,"Belum dipilih":`Not selected yet`,"belum yakin":`not sure yet`,"Belum yakin":`Not sure yet`,"Belum Yakin":`Not sure yet`,"BELUM YAKIN":`NOT SURE YET`,"Bentuk penilaian awal":`Initial assessment form`,"Berangkat dari konteks digital Indonesia dengan prinsip yang dapat digunakan lintas budaya.":`Departing from the Indonesian digital context with principles that can be used across cultures.`,"Berdiri di tengah dan lihat kamera":`Stand in the middle and look at the camera`,berhenti:`stop`,Berhenti:`Stop`,BERHENTI:`STOP`,"Berhenti sejenak dari dorongan bertindak":`Take a break from the urge to act`,"Berhenti sejenak dari dorongan bertindak.":`Take a break from the urge to act.`,"Berhenti sejenak untuk membaca tekanan, emosi, bukti, dan risiko tindakan yang diminta.":`Pause to read the pressure, emotions, evidence, and risks of the requested action.`,"Berhenti sejenak.":`Pause.`,"Berhenti sejenak. Temukan tekanan waktu.":`Pause. Find time pressure.`,"berubah ke verifikasi/berhenti":`change to verify/stop`,"Biaya administrasi diminta sebelum verifikasi HR.":`Administrative fees are requested prior to HR verification.`,"Bisakah posisi ini ditemukan di kanal karier resmi?":`Can this position be found on the official career channel?`,"Browser tidak mendukung pemutar audio.":`The browser does not support audio players.`,"Buat empat garis dengan selotip. Tim Arus mulai dari sisi MASUK dan membawa Token Informasi menuju Zona Tindakan.":`Make four lines with tape. The Flow Team starts from the ENTRY side and carries the Information Token towards the Action Zone.`,"Buat keputusan dan ukur keyakinan sebelum melihat analisis otomatis.":`Make decisions and gauge confidence before looking at automated analysis.`,"Buat tiga zona emosi di lantai. Tim Hadang berpindah bersama ke zona pilihannya.":`Create three emotional zones on the floor. Hadang's team moved together to the zone of their choice.`,buka:`open`,"Buka aplikasi bank sendiri":`Open your own bank app`,"Buka aplikasi bank tanpa memakai tautan.":`Open the bank app without using a link.`,"Buka aplikasi resmi":`Open the official app`,"Buka aplikasi resmi sendiri":`Open the official app yourself`,"Buka Arena":`Open Arena`,"Buka Arena Kamera AI":`Open AI Camera Arena`,"Buka kartu &middot; AI Lens sebagai wasit penjelas":`Open cards · AI Lens as explanatory referee`,"Buka menu":`Open menus`,"Buka Pertanyaan":`Open Questions`,"Buka Taktik & AI Lens":`Open Tactics & AI Lens`,"Buka Voting Akhir &#8594;":`Go to Final Voting →`,bukti:`proof`,"Bukti / sumber":`Evidence/sources`,"Bukti belum terkonfirmasi":`Evidence has not been confirmed`,"Bukti independen":`Independent evidence`,"Bukti independen dipilih":`Independent evidence is selected`,"Bukti independen mana yang paling kuat?":`Which independent evidence is strongest?`,"Bukti ini belum cukup independen.":`This evidence is not independent enough.`,"Bukti mana yang lebih dapat diverifikasi daripada skor AI?":`Which evidence is more verifiable than AI scores?`,"Bukti resmi bisa lebih kuat":`Official evidence could be stronger`,"Bukti resmi dapat lebih kuat daripada sinyal AI. Latih keberanian untuk tidak setuju.":`Official evidence can be stronger than AI signals. Practice the courage to disagree.`,"Bukti terkuat bahwa QR memang resmi adalah...":`The strongest evidence that QR is indeed official is...`,"Bukti yang baik tidak hanya berasal dari pihak yang membuat klaim.":`Good evidence does not only come from the party making the claim.`,"Butuh penilaian yang lebih lengkap?":`Need a more complete assessment?`,"Cara memasukkan QR atau tautan":`How to insert QR or link`,"Cari bukti yang berdiri sendiri":`Look for evidence that stands alone`,"Cari lowongan pada situs resmi.":`Look for vacancies on the official site.`,"Cari video pada kanal resmi tokoh.":`Look for videos on the character's official channels.`,"Cetak Kartu &amp; Penanda":`Print Cards & Bookmarks`,"Cetak Kit Permainan":`Print Game Kits`,"Clue yang terlihat":`Visible clue`,"Cocokkan dengan aplikasi resmi":`Match with the official app`,"Cocokkan isi di aplikasi resmi.":`Match the content in the official app.`,"Computer Vision hanya memastikan pose tubuh. Alasan, bukti, dan keputusan tetap berasal dari diskusi peserta.":`Computer Vision only determines the body pose. Reasons, evidence, and decisions still come from participant discussions.`,"Contoh simulasi sesi literasi digital berbasis skenario QR Pembayaran.":`Example of a digital literacy session simulation based on a QR Payment scenario.`,dalam:`in`,dapat:`can`,dari:`from`,"dari 4 garis berhasil dihadang":`of the 4 lines were successfully blocked`,"Dari respons reaktif menuju verifikasi atau berhenti sebelum share.":`From reactive response to verification or stopping before sharing.`,"Dashboard simulatif untuk menunjukkan dampak pembelajaran MIL: bagaimana pengguna pause, verify, reflect, decide, dan mengurangi risiko forward impulsif.":`Simulative dashboard to show the impact of MIL learning: how users pause, verify, reflect, decide, and reduce the risk of impulsive forwards.`,dengan:`with`,"Dibangun untuk memperkuat agensi manusia":`Built to strengthen human agency`,"Diproses lokal &middot; Tidak direkam":`Local processing · Not recorded`,"Ditujukan bagi pengguna digital, anak muda, keluarga, komunitas, pendidik, organisasi pemuda, advokat MIL, peneliti, dan pemangku kebijakan.":`Aimed at digital users, young people, families, communities, educators, youth organizations, MIL advocates, researchers and policy makers.`,"Domain tujuan perlu diperiksa":`The destination domain needs to be checked`,"domain-belum-terbaca":`unread-domain`,"Dua tim bergerak di lapangan fisik. Website mengatur kasus, timer, pertanyaan, dan skor.":`Two teams move on a physical field. The website organizes cases, timers, questions, and scores.`,"E &middot; EMOSI":`E · EMOTIONS`,emosi:`emotion`,Emosi:`Emotion`,EMOSI:`EMOTION`,"Emosi apa yang paling mungkin mendorong tombol share?":`What emotions are most likely to prompt a share button?`,"Emosi bukan kesalahan. Mengenalinya membantu kamu menjaga jarak dari tekanan.":`Emotions are not a mistake. Recognizing it helps you keep your distance from pressure.`,"Emosi utama apa yang sedang dimanfaatkan?":`What key emotions are being tapped?`,"Empat garis J.E.D.A. diselesaikan bergantian.":`The four lines of J.E.D.A. completed alternately.`,"Empat garis sudah dibuat":`Four lines have been drawn`,"File tidak dapat dibaca.":`File cannot be read.`,"Fokus pada penerima, domain tujuan, dan kanal pembayaran resmi.":`Focus on recipients, destination domains, and authorized payment channels.`,"Fokus pada sumber primer, konteks, dan tekanan untuk membagikan.":`Focus on primary sources, context, and pressure to share.`,"Fokus pada urgency, identitas, dan transfer yang sulit dibatalkan.":`Focus on urgency, identity, and transfers that are difficult to undo.`,"Format formal dapat memicu false positive":`Formal formats can trigger false positives`,"Format mirip pesan massal":`Format similar to mass messages`,"Format pengumuman massal kadang mirip pesan palsu.":`The mass announcement format sometimes resembles a fake message.`,"Format resmi dapat menyerupai pesan palsu.":`The official format can resemble a fake message.`,"Foto dari nomor tersebut":`Photo of the number`,"Foto QR untuk nanti":`QR photo for later`,"Frame video / gambar yang dianalisis":`Analyzed video/image frames`,"Frasa 'sekarang' dan 'jangan telepon' membatasi verifikasi.":`The phrases 'now' and 'do not call' limit verification.`,"Frasa mana yang mendorong kita menyebarkan tanpa memeriksa?":`Which phrase encourages us to deploy without checking?`,gambar:`picture`,Gambar:`Picture`,"Gambar / Screenshot":`Images/Screenshots`,"Gambar akan tetap terlihat sampai tahap Explainable AI.":`The image will remain visible until the Explainable AI stage.`,"gambar atau screenshot":`image or screenshot`,"Gambar QR":`QR image`,"Gambar siap diperiksa":`The image is ready to be checked`,"Gambar upload dengan penjelasan XAI":`Uploaded image with XAI explanation`,"Gambar yang diperiksa":`Checked image`,"Gambar yang sedang diperiksa":`The image being examined`,ganti:`change`,"Ganti Audio":`Change Audio`,"Ganti Gambar":`Replace Image`,"Ganti Konten":`Replace Content`,"Ganti QR":`Replace QR`,garis:`line`,"GARIS &middot;":`LINE ·`,"GARIS 0":`LINE 0`,"Garis 01 - Jeda":`Line 01 - Pause`,"Garis 02 - Emosi":`Line 02 - Emotion`,"Garis 03 - Data":`Line 03 - Data`,"Garis 04 - Aksi":`Line 04 - Action`,"GARIS AKTIF":`ACTIVE LINE`,"Garis berhasil dihadang":`The line was successfully blocked`,"Garis mana yang paling sulit dijaga? Bukti apa yang benar-benar mengubah keputusan Warga?":`Which line is the hardest to maintain? What evidence really changed the Citizen's decision?`,"Gerak mulut dan ekspresi tampak tidak sepenuhnya selaras.":`Mouth movements and expressions don't seem completely in sync.`,"Gerak tubuh membuka ruang untuk berpikir bersama.":`Body movement opens up space for thinking together.`,"Gerakkan penjaga aktif di garisnya, tangkap token informasi, lalu jawab pertanyaan J.E.D.A. Jangan biarkan tiga token lolos menuju tindakan.":`Move the active guard on his line, capture the information token, then answer J.E.D.A.'s questions. Don't let three tokens slip through to the action.`,"Giliran ini":`It's this turn`,"Gulir untuk memahami alur":`Scroll to understand the flow`,gunakan:`use`,"Gunakan contoh yang tersedia atau masukkan kontenmu sendiri.":`Use the examples provided or enter your own content.`,"Gunakan daftar skenario di bawah untuk melanjutkan latihan.":`Use the list of scenarios below to continue the practice.`,"Gunakan kanal di luar pesan ini.":`Use a channel outside of this message.`,"Gunakan kanal resmi lain":`Use another official channel`,"Gunakan klaim institusi atau jabatan.":`Use institutional or position claims.`,"Gunakan mesin pembayaran resmi":`Use official payment machines`,"Gunakan pencarian balik frame.":`Use frame reverse lookup.`,"Gunakan pertanyaan yang hanya diketahui keluarga.":`Use questions that only the family knows.`,"Gunakan tema biru gelap":`Use a dark blue theme`,"Gunakan tema putih biru":`Use a white and blue theme`,"Gunakan viralitas sebagai tekanan.":`Use virality as pressure.`,"Hadang dengan J.E.D.A.":`Block it with J.E.D.A.`,"Hadang Garis 1":`Block Line 1`,"Hadang Garis 2":`Block Line 2`,"Hadang Garis 3":`Block Line 3`,"Hadang informasi dengan gerakan tubuh.":`Intercept information with body movements.`,"Hadang Sebelum Bertindak":`Stop Before Acting`,"Hadang Sebelum Terjebak":`Block Before You Get Trapped`,"HADANGIN adalah Indonesian-localized prototype dari AI Context Guard Web: menggabungkan psikologi, Media and Information Literacy, AI forensics, dan human judgment dalam satu alur reflektif.":`HADANGIN is an Indonesian-localized prototype of AI Context Guard Web: combining psychology, Media and Information Literacy, AI forensics, and human judgment in one reflective flow.`,"HADANGIN adalah prototipe lokal dari konsep AI Context Guard Web untuk Indonesia: web ringan yang membantu masyarakat berhenti, berpikir, memverifikasi, dan mengambil keputusan dengan lebih sadar.":`HADANGIN is a local prototype of the AI ​​Context Guard Web concept for Indonesia: a lightweight web that helps people stop, think, verify and make decisions more consciously.`,"HADANGIN memposisikan AI Context Guard Web dalam konteks Indonesia: bantu pengguna pause, verify, reflect, dan evaluate sebelum klik, transfer, scan, atau membagikan informasi digital.":`HADANGIN positions AI Context Guard Web in the Indonesian context: helping users pause, verify, reflect, and evaluate before clicking, transferring, scanning, or sharing digital information.`,"HADANGIN tidak memulai dari jawaban AI. Pengguna diajak memahami situasi dulu: apa isi informasinya, tekanan apa yang muncul, bukti apa yang tersedia, dan tindakan apa yang paling aman.":`HADANGIN does not start from the AI's answer. Users are invited to understand the situation first: what the information contains, what pressures arise, what evidence is available, and what action is safest.`,"HADANGIN, prototipe lokal AI Context Guard Web untuk membantu pengguna pause, verify, reflect, dan evaluate sebelum mempercayai atau membagikan informasi digital.":`HADANGIN, a local AI Context Guard Web prototype to help users pause, verify, reflect, and evaluate before trusting or sharing digital information.`,"HADANGIN: Hadang Sebelum Terjebak.":`HADANGIN: Block before you get trapped.`,"Hadapi simulasi manipulasi digital yang dekat dengan kehidupan sehari-hari. Setiap skenario berlangsung sekitar dua menit.":`Face digital manipulation simulations that are close to everyday life. Each scenario lasts about two minutes.`,hanya:`only`,"Hapus gambar":`Delete image`,harus:`must`,hasil:`results`,"Hasil ini melewati latihan Human First dan game. Gunakan penjelasan XAI untuk menentukan apa yang masih perlu diverifikasi.":`These results pass through Human First practice and games. Use XAI explanations to determine what still needs to be verified.`,"Hasil prediksi langsung":`Live prediction results`,"Hentikan tekanan waktu sebelum informasi bergerak menuju tindakan.":`Stop the time pressure before information moves towards action.`,"Highlight menunjukkan area yang memengaruhi hasil analisis dan bukan merupakan bukti final.":`Highlights indicate areas that influenced the analysis results and are not final evidence.`,"Hitung kartu peserta":`Count participant cards`,"https://contoh-tautan.com/verifikasi":`https://example-tautan.com/verification`,"Hubungan pengirim dengan perusahaan.":`The sender's relationship with the company.`,"Hubungi HR melalui situs resmi":`Contact HR via the official website`,"Hubungi layanan resmi":`Contact authorized service`,"Hubungi nomor di kartu":`Call the number on the card`,"Hubungi nomor keluarga yang tersimpan.":`Call the saved family number.`,"Hubungi nomor resmi pada kartu.":`Call the official number on the card.`,"Identitas belum terkonfirmasi":`Identity has not been confirmed`,"Identitas operator pesan.":`The identity of the message operator.`,"Identitas pengirim belum dikonfirmasi":`The identity of the sender has not been confirmed`,informasi:`information`,INFORMASI:`INFORMATION`,"Informasi bergerak menuju aksi":`Information moves towards action`,"Informasi datang":`Information comes`,"Informasi ini sedang ramai":`This information is currently popular`,"Informasi lolos":`Information escapes`,"Informasi lolos. Bersiap untuk token berikutnya.":`Information escapes. Get ready for the next token.`,"Informasi Viral":`Viral Information`,"Informasi yang diperiksa":`Information checked`,ini:`This`,"Input pengguna":`User input`,"Insight untuk educator, komunitas, dan peneliti MIL.":`Insights for MIL educators, communities, and researchers.`,"Intonasi berubah tajam pada bagian permintaan transfer.":`The intonation changes sharply at the transfer request part.`,"Investasi eksklusif hanya hari ini":`Exclusive investment only today`,"INVESTASI HANYA HARI INI":`INVEST ONLY TODAY`,itu:`That`,"Itu tanda kamu memasukkan bukti baru ke dalam penilaian.":`That's a sign you're introducing new evidence into the assessment.`,"Izin kamera ditolak. Gunakan kontrol manual.":`Camera permission denied. Use manual control.`,"Izinkan pop-up untuk mencetak kit permainan.":`Allow pop-up to print game kits.`,"Jangan bahas jawabannya dulu. Catat respons spontan kelompok sebelum Tim Arus mulai bergerak.":`Don't discuss the answer yet. Note the group's spontaneous responses before the Flow Team begins to move.`,"Jangan bertindak hanya dari kemiripan visual.":`Don't act on visual similarity alone.`,"Jangan biarkan informasi lolos menuju tindakan.":`Don't let information slip into action.`,"Jangan biarkan lolos":`Don't let it slip away`,"Jangan buka tautan dari panel ini. Nilai klaim pengirim dan cari kanal resmi secara mandiri.":`Do not open links from this panel. Assess the sender's claim and search for official channels independently.`,"Jangan jadikan viralitas sebagai bukti.":`Don't use virality as proof.`,"Jangan membayar biaya rekrutmen di muka.":`Don't pay recruitment fees up front.`,"Jangan pernah membagikan OTP.":`Never share OTP.`,"jangan telepon dulu":`don't call yet`,"Jangan transfer berdasarkan kemiripan suara.":`Do not transfer based on similarity of sound.`,jawaban:`answer`,Jawaban:`Answer`,"Jika AI bertentangan dengan bukti independen, mana yang seharusnya kamu prioritaskan?":`If AI conflicts with independent evidence, which should you prioritize?`,"Jumlah orang yang sudah memindai":`Number of people who have scanned`,"Kamera belum aktif":`The camera is not active`,"Kamera tidak aktif":`Camera is not active`,"Kamera tidak didukung browser ini":`Camera is not supported by this browser`,"Kami ingin tahu bagaimana kamu membaca situasi ini terlebih dahulu.":`We want to know how you read this situation first.`,kamu:`You`,"Kamu memberi ruang bagi bukti baru sebelum menentukan tindakan.":`You make room for new evidence before deciding on a course of action.`,"Kanal resmi":`Official channel`,"Kapan kamu perlu tidak setuju dengan AI?":`When do you need to disagree with AI?`,kartu:`card`,"Kartu J.E.D.A., kartu keputusan, kartu taktik, Token Informasi, dan penanda garis.":`J.E.D.A. cards, decision cards, tactics cards, Information Tokens, and line markers.`,"Kartu permainan sudah dipotong":`The game cards have been cut`,"Kartu tekanan dimainkan: waktu Tim Hadang berkurang 5 detik.":`Pressure card is played: Blocking Team's time is reduced by 5 seconds.`,kasus:`case`,Kasus:`Case`,"Kasus pembuka":`Opening case`,"Kasus untuk peserta":`Case for participants`,"Kasus untuk Warga":`The Case for Citizens`,"Kata 'sekarang' mendorong tindakan sebelum identitas dikonfirmasi.":`The word 'now' encourages action before identity is confirmed.`,"ke pengalaman budaya hadang/gobak sodor agar informasi tertahan sebelum bergerak menuju tindakan berisiko.":`to the cultural experience of hadang/gobak sodor so that information is retained before moving towards risky actions.`,"Keamanan: gunakan tanpa kontak fisik, hindari lantai licin, dan sesuaikan jarak gerak dengan kebutuhan peserta.":`Safety: use without physical contact, avoid slippery floors, and adjust the movement distance to the participants' needs.`,"Keaslian dokumen yang dilampirkan.":`Authenticity of attached documents.`,"Kebiasaan dan tekanan antrean dapat mengurangi pemeriksaan penerima.":`Habits and the stress of queuing can reduce recipient checks.`,"Keduanya menggunakan Explainable AI. AI Plus menambahkan latihan penalaran dan permainan J.E.D.A.":`Both use Explainable AI. AI Plus adds reasoning exercises and games to J.E.D.A.`,"Kelompok peserta":`Participant group`,"Kemarahan membuat klaim terasa layak dibagikan sebelum sumbernya jelas.":`Outrage makes a claim feel share-worthy before the source is clear.`,"Kemiripan suara bukan bukti identitas":`Similarity of voice is not proof of identity`,"Kenali emosi yang sedang dipancing":`Recognize the emotion that is being provoked`,"Kenali emosi yang sedang dipancing.":`Recognize the emotion that is being provoked.`,"Kenali emosi yang sedang dipengaruhi.":`Recognize the emotion that is being affected.`,"Kenali rasa takut, panik, marah, atau FOMO yang sedang dipancing.":`Recognize the fear, panic, anger, or FOMO that is being provoked.`,"Kenali tekanan sebelum bergerak":`Recognize the pressure before moving`,keputusan:`decision`,"Keputusan akhir":`Final decision`,"Keputusan akhir tetap milik manusia.":`The final decision remains human.`,"Keputusan akhir tetap milikmu, lalu refleksi mencatat apa yang mengubah penilaianmu.":`The final decision is still yours, then reflection notes what changed your judgment.`,"Keputusan aman":`Safe decision`,"Keputusan final":`Final decision`,"Keputusan harus mengikuti bukti di aplikasi/kanal resmi.":`The decision must follow the evidence in the official app/channel.`,"Kesadaran emosi":`Emotional awareness`,"Kesenjangan antara Informasi dan Tindakan":`The Gap between Information and Action`,"Ketik alamat resmi secara manual":`Type the official address manually`,"Klaim perusahaan belum diverifikasi":`The company's claims have not been verified`,"Klik karakter untuk melihat tugasnya menghadang informasi.":`Click on a character to see their task of intercepting information.`,"Kode QR baru diklaim sebagai kanal pembayaran resmi merchant.":`The new QR code is claimed to be the merchant's official payment channel.`,"Komentar yang setuju":`Comments that agree`,"Kondisi apa yang sedang dimanfaatkan?":`What conditions are being utilized?`,"Kondisi stiker sebelum difoto.":`Condition of the sticker before being photographed.`,"Konfirmasi kasir dan identitas penerima lebih kuat daripada tampilan stiker.":`Confirmation of the cashier and recipient's identity is stronger than the appearance of a sticker.`,"Konfirmasi lewat kanal yang sudah dikenal lebih kuat daripada bukti dari pengirim yang sama.":`Confirmation via a known channel is stronger than evidence from the same sender.`,"Kontak HR pada situs resmi perusahaan":`Contact HR on the company's official website`,"Kontak HR resmi tersedia sebagai pembanding":`Official HR contacts are available for comparison`,"Konteks kasir perlu dicek langsung":`The cashier's context needs to be checked directly`,"Konteks lengkap di luar pesan ini.":`Full context beyond this message.`,"Konteks rekaman asli.":`Context of the original recording.`,"Konteks rekaman tidak lengkap":`The recording context is incomplete`,"Konteks sebelum dan sesudah potongan audio.":`Context before and after the audio piece.`,"Konten hanya diproses di perangkat ini untuk kebutuhan simulasi dan tidak dikirim ke server.":`Content is only processed on this device for simulation purposes and is not sent to the server.`,"Kualitas alasan, bukti independen, dan keputusan aman. AI tidak menentukan benar atau salahnya peserta.":`Quality of reasoning, independent evidence, and secure decisions. AI does not determine whether participants are right or wrong.`,"Kunci Jawaban":`Answer key`,"Kunci Keputusan Akhir":`Final Decision Key`,"Kunci Penilaian Awal":`Key to Initial Assessment`,"Label “aman”, “hoaks”, atau “scam” dapat membantu, tetapi tidak otomatis membangun kemampuan menilai ketika teknologi tidak tersedia.":`Labels “safe,” “hoax,” or “scam” can be helpful, but do not automatically build judgment when technology is not available.`,langkah:`step`,"Langkah dari 6":`Step from 6`,"Langkah verifikasi berikutnya":`Next verification step`,"Lanjut ke Garis Berikutnya":`Continue to Next Line`,"Laptop, proyektor, kartu, selotip":`Laptop, projector, cards, tape`,"Latih Nalar Sebelum Situasi Nyata Datang.":`Practice Reasoning Before the Real Situation Comes.`,"Layar dapat dilihat semua peserta":`The screen can be seen by all participants`,lebih:`more`,"Letakkan tiga Kartu Kutipan di seberang garis. Penjaga J mengambil satu kartu sebelum timer habis.":`Place three Quote Cards across the line. Guard J takes one card before the timer runs out.`,lihat:`Look`,"Lihat Debrief &#8594;":`See Debrief →`,"Lihat perubahan keputusan dan pola berpikir yang telah dilatih.":`See changes in decisions and thought patterns that have been trained.`,"Lihat sinyal struktur dan jalur yang mungkin dilalui.":`View structure signals and possible paths.`,"Lihat Snapshot Nalar":`View Reasoning Snapshot`,"Lihat tindakan dan konsekuensinya":`Look at actions and their consequences`,"Lihat tindakan dan konsekuensinya.":`Look at actions and their consequences.`,"Literasi yang dekat dengan kehidupan digital sehari-hari":`Literacy that is close to everyday digital life`,"Logo bank di pesan":`Bank logo on message`,"Logo merchant pada stiker":`Merchant logo on sticker`,"Logo pada stiker":`Logo on sticker`,"Mana yang paling independen untuk memverifikasi klaim ini?":`Which is the most independent way to verify this claim?`,"Manipulasi digital sering berhasil bukan hanya karena terlihat meyakinkan, tetapi karena memanfaatkan urgency, fear, authority, trust, scarcity, atau emotional attachment.":`Digital manipulation is often successful not only because it looks convincing, but because it exploits urgency, fear, authority, trust, scarcity, or emotional attachment.`,"Manusia tetap memegang keputusan akhir":`Humans still have the final say`,"Masalah yang dihadapi":`Problems encountered`,"Masih perlu latihan memilih bukti independen.":`Still need practice selecting independent evidence.`,"Masuk ke AI Plus untuk membentuk penilaian awal, memainkan J.E.D.A., lalu membandingkannya dengan AI.":`Log in to AI Plus to form an initial assessment, play J.E.D.A., then compare it to AI.`,masukkan:`insert`,"Masukkan Informasi":`Enter Information`,"Masukkan konten atau pilih file terlebih dahulu.":`Enter content or select files first.`,"Masukkan konten yang ingin kamu evaluasi. Pilih Deteksi AI untuk hasil langsung, atau AI Plus untuk alur Human First dan latihan J.E.D.A.":`Enter the content you want to evaluate. Select AI Detection for immediate results, or AI Plus for Human First flows and J.E.D.A drills.`,"Masukkan PIN secepatnya":`Enter the PIN as soon as possible`,"Masukkan tautan yang valid, diawali http:// atau https://.":`Enter a valid link, starting with http:// or https://.`,"Membagikan informasi usang":`Sharing outdated information`,membantu:`help`,membuat:`make`,memilih:`choose`,"Mengambil keputusan akhir di Zona Tindakan.":`Take the final decision in the Action Zone.`,"Mengarahkan ke tautan":`Redirects to the link`,"Mengatasnamakan perusahaan tanpa kanal resmi.":`On behalf of a company without official channels.`,"Mengenali tekanan":`Recognize pressure`,menjadi:`become`,"Menunda share mencegah klaim tanpa konteks menyebar lebih jauh.":`Delaying shares prevents claims without context from spreading further.`,menunjukkan:`show`,"Mereka tidak ingin kamu tahu fakta ini. Sebarkan sekarang sebelum unggahan dihapus!":`They don't want you to know this fact. Share now before the post is deleted!`,"Metode J.E.D.A. menerjemahkan prinsip MIL menjadi pengalaman interaktif berbasis budaya hadang/gobak sodor.":`The J.E.D.A. Method translating MIL principles into an interactive experience based on hadang/gobak sodor culture.`,"Metode lokal untuk mengenali tekanan, emosi, data, dan risiko aksi.":`Local methods for recognizing pressure, emotion, data, and action risk.`,"Mobile-first, hemat bandwidth, dan menggunakan bahasa yang sederhana.":`Mobile-first, saves bandwidth, and uses simple language.`,"Mode analisis QR atau tautan":`QR or link analysis mode`,"Mode permainan":`Game modes`,"Model AI gagal dimuat. Gunakan kontrol manual.":`AI model failed to load. Use manual control.`,"Model belum melihat bukti di aplikasi resmi.":`The model has not seen any evidence on the official app.`,"Model menandai ancaman pemblokiran, otoritas bank, dan tautan verifikasi sebagai pola phishing berisiko tinggi.":`The model flags blocking threats, bank authority, and verification links as high-risk phishing patterns.`,"Model menandai area wajah, sinkronisasi audio, dan konteks unggahan sebagai sinyal yang perlu diverifikasi.":`The model flags facial area, audio sync, and upload context as signals that need to be verified.`,"Model menandai kemungkinan QR pengganti, tetapi penerima pembayaran tetap harus diverifikasi langsung kepada merchant.":`The model flags possible replacement QRs, but the payee must still be verified directly with the merchant.`,"Model menemukan format massal yang tampak mencurigakan, tetapi bukti pada aplikasi resmi dapat membantah sinyal AI.":`The model found a bulk format that looked suspicious, but evidence on the official app could refute the AI ​​signal.`,"Model menemukan kombinasi scarcity, otoritas palsu, dan permintaan deposit yang umum pada penipuan lowongan.":`The model found the combination of scarcity, false authority, and deposit requests to be common in job fraud.`,"Model menemukan tekanan aksi cepat, identitas belum terverifikasi, dan permintaan transfer yang sulit dibatalkan.":`Models found the pressure of quick action, unverified identities, and transfer requests that were difficult to cancel.`,"Model simulasi menemukan tekanan transfer, perubahan prosodi, dan jejak kompresi. Kemiripan pola suara tidak membuktikan identitas pembicara.":`The simulation model finds transfer stress, prosody changes, and compression traces. Similarity of voice patterns does not prove the speaker's identity.`,"Motif akun yang menyebarkan.":`The motive of the account that spreads.`,mulai:`start`,"Mulai AI Plus &#8594;":`Start AI Plus →`,"Mulai Latihan":`Start Training`,"Mulai Pemeriksaan":`Start Inspection`,"Mulai Permainan":`Start Game`,"Mulai Sesi":`Start Session`,"Mulai Timer":`Start Timer`,"Mulai Verifikasi":`Start Verification`,"Mulai Voting Awal &#8594;":`Start Early Voting →`,"Nak, ini Mama. Nomor Mama bermasalah.":`Son, it's Mama. Mama's number is problematic.`,"Nak, ini Mama. Nomor Mama sedang bermasalah. Tolong transfer sekarang dan jangan telepon dulu.":`Son, it's Mama. Mama's number is in trouble. Please transfer now and don't call yet.`,"NAK, INI MAMA. TOLONG TRANSFER SEKARANG, JANGAN TELEPON DULU!":`SON, IT'S MOM. PLEASE TRANSFER NOW, DON'T CALL FIRST!`,"Nak, Mama kecelakaan. HP Mama rusak. Transfer Rp3 juta sekarang ke rekening ini. Tolong cepat, ya!":`Son, Mama had an accident. Mama's cell phone is broken. Transfer IDR 3 million now to this account. Please hurry, OK!`,"Nama penerima belum cocok dengan merchant":`The recipient's name does not match the merchant's name`,"Nama penerima harus sesuai sebelum transaksi yang sulit dibatalkan.":`The recipient's name must match before a hard transaction is cancelled.`,"Nama tim pembawa informasi":`Name of the information carrier team`,"Nama, seragam, atau institusi dipakai untuk meminjam kepercayaan.":`Names, uniforms, or institutions are used to borrow trust.`,"Nilai ini menunjukkan sinyal model, bukan kebenaran final. Gunakan hasil ini untuk menentukan apa yang perlu dicek, bukan untuk langsung percaya.":`This value represents a model signal, not the final truth. Use these results to determine what needs to be checked, not to just believe it.`,"Nilai risiko dan pilih tindakan yang aman.":`Assess risks and choose safe actions.`,"Nilai risiko klik, scan, transfer, atau share sebelum bertindak.":`Assess the risk of a click, scan, transfer, or share before acting.`,"Nomor baru mengaku keluarga tanpa bukti independen.":`The new number claims to be family without independent evidence.`,"Nomor baru mengaku sebagai keluarga dan meminta transfer segera.":`The new number claims to be family and requests an immediate transfer.`,"Nomor pengirim terlihat rapi":`The sender number looks neat`,"Nomor rekening ini":`This account number`,"Nomor rekening yang diberikan":`Account number provided`,"Notifikasi di aplikasi bank resmi":`Notifications in the official bank application`,"Notifikasi Resmi":`Official Notification`,orang:`person`,"OTP dan kredensial tidak boleh dibagikan":`OTP and credentials should not be shared`,pada:`on`,"Paket kasus":`Case package`,"Papan sinyal J.E.D.A. hasil prediksi AI":`J.E.D.A. signal board AI prediction results`,"Pastikan arena siap sebelum ditampilkan ke peserta.":`Make sure the arena is ready before showing it to participants.`,"Pastikan identitas pengirim sebelum merespons permintaan transfer.":`Confirm the identity of the sender before responding to a transfer request.`,"Pembaruan yang sama di aplikasi resmi":`Same update in official app`,"PEMBAWA INFORMASI":`CARRIER OF INFORMATION`,"Pemberitahuan dalam aplikasi layanan":`Notifications in service applications`,"Pemberitahuan menyatakan jadwal layanan resmi telah berubah.":`The notice states the official service schedule has changed.`,"Pemberitahuan Resmi":`Official Notice`,"PEMBERITAHUAN RESMI: JADWAL LAYANAN BERUBAH.":`OFFICIAL NOTICE: SERVICE SCHEDULE CHANGES.`,"Pemberitahuan resmi: jadwal layanan berubah. Periksa pembaruan pada aplikasi resmi.":`Official notice: service schedule changed. Check for updates on the official app.`,"Pembicara mengaku sebagai anggota keluarga dan sedang mengalami keadaan darurat.":`The speaker claims to be a family member and is experiencing an emergency.`,"Pemeriksaan bukti":`Evidence examination`,"Pemilik QR belum terkonfirmasi":`The owner of QR has not been confirmed`,"Pemilik rekening tujuan belum terlihat sebelum pembayaran.":`The destination account owner is not visible before payment.`,"Penerima dana belum terlihat":`The recipient of the funds has not yet been seen`,pengguna:`user`,"Pengirim mengaku sebagai bank dan menyatakan rekening akan diblokir.":`The sender claims to be a bank and states the account will be blocked.`,"Pengirim mengaku sebagai ibu dan sedang mengalami keadaan darurat.":`The sender claimed to be a mother and was experiencing an emergency.`,"Pengirim tampak resmi":`The sender looks official`,penilaian:`evaluation`,"Penilaian awal saya":`My initial assessment`,"Penilaian baik. AI bukan otoritas final.":`Good assessment. AI is not the final authority.`,"Penjaga D memilih satu Kartu Bukti dan menyerahkannya kepada Warga.":`Guard D selects one Evidence Card and hands it to the Citizen.`,"Penjaga D mengambil satu Kartu Bukti dari sisi ruangan.":`Guard D takes one Evidence Card from the side of the room.`,"Penjaga J memilih Kartu Kutipan dan menaruhnya di garis.":`Keeper J selects a Quote Card and places it on the line.`,"Penjaga J mengambil Kartu Pemicu yang paling tepat.":`Guard J takes the most appropriate Trigger Card.`,"Peran kedua tim sudah dibagi":`The roles of the two teams have been divided`,periksa:`check`,"Periksa domain di situs resmi bank.":`Check the domain on the bank's official website.`,"Periksa domain email pengirim.":`Check the sender's email domain.`,"Periksa Informasi Mencurigakan":`Check for Suspicious Information`,"Periksa izin lembaga terkait":`Check the relevant agency's permits`,"Periksa izin produk investasi.":`Check investment product permits.`,"Periksa jeda, emosi, data, dan aksi yang diminta informasi.":`Examine the pauses, emotions, data, and actions that information prompts.`,"Periksa kanal resmi tokoh":`Check the figure's official channel`,"Periksa Lagi":`Check Again`,"Periksa legalitas perusahaan":`Check the legality of the company`,"Periksa lokasi QR, pemilik media, serta nama penerima sebelum memindai atau membayar.":`Check the QR location, media owner, and recipient name before scanning or paying.`,"Periksa nama penerima":`Check the recipient's name`,"Periksa nama penerima sebelum membayar.":`Check the recipient's name before paying.`,"Periksa pemilik QR dan nama penerima sebelum pembayaran diproses.":`Check the QR owner and recipient name before payment is processed.`,"Periksa penerima sebelum pembayaran.":`Check the recipient before payment.`,"Periksa pengirim pada kanal resmi.":`Check the sender on official channels.`,"Periksa sinkronisasi visual, sumber asli, dan legalitas ajakan investasi.":`Check visual synchronization, original source, and legality of investment solicitation.`,"Periksa tanggal dan konteks":`Check dates and context`,"Periksa tanggal, lokasi, dan konteks.":`Check the date, location, and context.`,"Periksa waktu publikasi":`Check publication time`,"Perkiraan peserta":`Estimated participants`,"Perlengkapan Arena Hadang berupa kartu J.E.D.A., token Informasi, kartu keputusan, selotip, dan papan skor":`Arena Hadang equipment consists of J.E.D.A. cards, Information tokens, decision cards, tape and scoreboard`,"Perlu cek tanggal dan konteks":`Need to check the date and context`,"Perlu dicocokkan dengan aplikasi resmi.":`Need to be matched with the official app.`,"Perlu verifikasi":`Need verification`,"Perlu verifikasi lebih lanjut":`Need further verification`,permainan:`game`,"Permintaan transfer muncul sebelum identitas dikonfirmasi.":`The transfer request appears before the identity is confirmed.`,"Pernyataan pada kanal resmi tokoh":`Statement on the figure's official channel`,pertanyaan:`question`,Pertanyaan:`Question`,"Pertanyaan reflektif":`Reflective questions`,"Pertanyaan reflektif dijawab":`Reflective questions answered`,"Pertimbangkan kembali sumber mana yang dapat diverifikasi secara independen.":`Reconsider which sources can be independently verified.`,"Perubahan keputusan bukan kelemahan.":`Changing decisions is not weakness.`,"Perubahan keputusan pengguna":`Changes in user decisions`,pesan:`message`,"Pesan asli - tekanan aktif":`Original message - pressure is on`,"Pesan Bank":`Bank Message`,"Pesan bank dan tautan verifikasi":`Bank message and verification link`,"Pesan darurat keluarga":`Family emergency message`,"Pesan Keluarga Darurat":`Emergency Family Message`,"Pesan manipulatif sering dibuat untuk mempercepat aksi yang sulit dibatalkan.":`Manipulative messages are often created to accelerate actions that are difficult to undo.`,"pesan mendesak":`urgent message`,"Pesan mengancam pemblokiran rekening dan mengarahkan ke sebuah tautan.":`The message threatens to block the account and directs to a link.`,"Pesan WhatsApp dari nomor baru":`WhatsApp message from new number`,"Pesan, screenshot, QR, audio, atau tautan terasa mendesak dan meminta tindakan cepat.":`The message, screenshot, QR, audio, or link feels urgent and asks for quick action.`,Peserta:`Participant`,"Peserta 32":`Participant 32`,"Peserta bergerak dan memilih kartu fisik. Fasilitator mencatat pilihan yang sama di layar.":`Participants move and select a physical card. The facilitator notes the same choices on the screen.`,"Peserta bergerak ke Zona Emosi yang paling sesuai lalu menyebut alasannya.":`Participants move to the most appropriate Emotional Zone and then state the reason.`,"Peserta memilih langsung lanjut sebelum melewati J.E.D.A.":`Participants choose to continue immediately before passing J.E.D.A.`,"Peserta memilih verifikasi atau berhenti pada voting akhir.":`Participants choose to verify or stop at the final vote.`,"Peserta memilih verifikasi atau berhenti setelah bermain.":`Participants choose to verify or stop after playing.`,"Peserta mengangkat kartu keputusan. Kamera belum digunakan pada tahap ini.":`Participants raise decision cards. The camera has not been used at this stage.`,"Peserta yang semula memilih langsung lanjut.":`Participants who originally chose to continue immediately.`,"Pihak yang menawarkan pekerjaan meminta biaya administrasi.":`The party offering the job asks for an administration fee.`,pilih:`choose`,"Pilih arena latihan":`Select a practice arena`,"Pilih bukti independen yang paling kuat.":`Select the strongest independent evidence.`,"Pilih cara bermain":`Choose how to play`,"Pilih cara model menampilkan area yang memengaruhi sinyal.":`Choose how the model displays areas that influence the signal.`,"Pilih cara pemeriksaan":`Select the inspection method`,"Pilih File":`Select Files`,"Pilih file audio MP3, WAV, atau M4A.":`Select MP3, WAV, or M4A audio files.`,"Pilih file gambar PNG, JPG, atau WEBP.":`Select a PNG, JPG, or WEBP image file.`,"Pilih file terlebih dahulu.":`Select the file first.`,"Pilih Gambar QR":`Select QR Image`,"Pilih gambar QR terlebih dahulu.":`Select the QR image first.`,"Pilih jenis konten":`Select content type`,"Pilih kartu yang digunakan untuk membuka penjelasan AI.":`Select the card used to open the AI ​​explanation.`,"Pilih paling banyak dua faktor refleksi.":`Select at most two reflection factors.`,"Pilih paling banyak dua faktor.":`Select at most two factors.`,"Pilih penjaga di arena":`Select the guard in the arena`,"Pilih Skenario":`Select Scenario`,"Pilihan verifikasi yang kuat.":`Powerful verification options.`,"Pindah kanal dan konfirmasi identitas sebelum melakukan tindakan finansial.":`Switch channels and confirm identity before taking financial action.`,"Pisahkan emosi dari isi pesan":`Separate the emotion from the content of the message`,"Pisahkan klaim dari bukti yang dapat diperiksa secara independen.":`Separate claims from evidence that can be independently checked.`,"Pisahkan klaim dari buktinya":`Separate the claim from the evidence`,"Pisahkan klaim dari buktinya.":`Separate the claim from the evidence.`,"Pola audio tampak tidak konsisten":`Audio patterns appear inconsistent`,"Pola prosodi tidak konsisten":`Inconsistent prosodic patterns`,"Pola suara tampak tidak konsisten":`The sound pattern seems inconsistent`,"Pose mengaktifkan setiap garis, tetapi peserta tetap harus menjelaskan tekanan, emosi, bukti, dan tindakan aman sesuai kasus.":`Poses activate each line, but participants must still explain stress, emotions, evidence, and safe actions as the case may be.`,"POSISI TERBATAS! BAYAR DEPOSIT HARI INI!":`LIMITED POSITIONS! PAY THE DEPOSIT TODAY!`,"Posisi titik tubuh untuk mengenali pose kedua tangan terangkat. Video diproses lokal dan tidak disimpan.":`Position of body points to recognize the pose of both hands raised. Videos are processed locally and not saved.`,"Posisikan satu pemain di dalam bingkai":`Position one player in the frame`,"Poster lowongan dari grup percakapan":`Job poster from chat group`,"Potong kartu mengikuti batas. Laminasi bila akan digunakan berulang.":`Cut the cards following the boundaries. Laminate if it will be used repeatedly.`,"Potongan video dari akun tidak dikenal":`Video footage from an unknown account`,"Pratinjau aman: tanpa membuka situs tujuan":`Safe preview: without opening the destination site`,"Prioritaskan bukti yang dapat diverifikasi.":`Prioritize verifiable evidence.`,"Putar dan dengarkan konteks sebelum memulai.":`Play it and listen for context before starting.`,"Putuskan dengan sadar":`Decide consciously`,"QR + Tautan":`QR + Link`,"QR di meja kasir sedang bermasalah. Scan kode baru ini agar pembayaran langsung diproses.":`The QR at the cashier's desk is having problems. Scan this new code so that payment is processed immediately.`,"QR LAMA RUSAK. SCAN YANG BARU SEKARANG!":`OLD QR IS BROKEN. SCAN THE NEW NOW!`,"QR pengganti ditempel di atas kode pembayaran resmi sebuah merchant.":`A replacement QR is affixed above a merchant's official payment code.`,"QR skenario latihan":`QR practice scenarios`,"QR terlihat baru":`QR looks new`,"QR upload dalam pemetaan risiko":`QR upload in risk mapping`,"QR yang diperiksa":`Checked QR`,"QR yang sedang diperiksa":`The QR being checked`,"Rantai ini adalah visualisasi dataset simulasi. HADANGIN tidak membuka alamat tersebut.":`This chain is a visualization of a simulated dataset. HADANGIN did not open the address.`,"Rasa nyaman pada rutinitas pembayaran dapat menurunkan kewaspadaan.":`Feeling comfortable with payment routines can reduce vigilance.`,"rata-rata dari 100":`average of 100`,"Refleksi membantu kamu mengenali pola yang dapat digunakan di situasi berikutnya.":`Reflection helps you recognize patterns that can be used in the next situation.`,rekaman:`recording`,"Rekaman 18 detik dari nomor baru":`18 second recording of the new number`,"rekaman audio":`audio recording`,"Rekaman audio":`Audio recording`,"Rekaman latihan siap dianalisis":`Training recordings ready for analysis`,"Rekaman menyebut nama panggilan":`Recordings mention nicknames`,"Rekaman siap diperiksa":`The recording is ready to be checked`,"Rekaman suara impersonasi":`Impersonation voice recording`,"Rekaman suara mirip anggota keluarga meminta transfer dan melarang kamu menelepon.":`A recorded voice sounds like a family member asking for a transfer and forbidding you to call.`,"Rekaman yang diperiksa":`Checked records`,"Rekening Anda akan diblokir dalam 30 menit.":`Your account will be blocked within 30 minutes.`,"Rekening Anda akan diblokir dalam 30 menit. Klik tautan ini untuk verifikasi identitas.":`Your account will be blocked within 30 minutes. Click this link to verify identity.`,resmi:`official`,"Respons dan keyakinanmu dicatat sebelum sinyal AI ditampilkan.":`Your responses and beliefs are recorded before the AI ​​signal is displayed.`,"Ringkasan sesi yang akan dibuat":`Summary of the session to be created`,"Ringkasan untuk kelas/komunitas":`Summary for class/community`,"Risiko tindakan":`Risk of action`,"Risiko tinggi - verifikasi sebelum bertindak":`High risk - verify before acting`,"Risiko transfer/klik makin terlihat sebelum bertindak.":`The risk of transfers/clicks is increasingly visible before action.`,"Runner membawa token; Strategist memainkan Kartu Taktik.":`Runners carry tokens; The Strategist plays Tactics Cards.`,"Sampel audio skenario aktif":`Active scenario audio sample`,"Satu penjaga berdiri di depan kamera. Kelompok membahas pertanyaan kasus, lalu penjaga mengangkat kedua tangan untuk mengunci garis.":`One guard stands in front of the camera. The group discusses the case questions, then the guard raises both hands to lock the line.`,"Satu penjaga untuk setiap garis J.E.D.A.":`One guard for each line of J.E.D.A.`,"Satu peserta berdiri sekitar 2 meter dari kamera. Peserta lain mendiskusikan pertanyaan J.E.D.A. dan bergantian menjadi penjaga.":`One participant stood approximately 2 meters from the camera. Other participants discussed questions J.E.D.A. and take turns being guards.`,"Saya akan melakukan tindakan yang diminta.":`I will perform the requested action.`,"Saya akan memeriksa lewat kanal lain.":`I will check via other channels.`,"Saya membutuhkan bukti tambahan.":`I need additional proof.`,"Saya setuju dengan AI":`I agree with AI`,"Saya tidak akan melanjutkan tindakan.":`I will not continue the action.`,"Saya tidak setuju dengan AI":`I don't agree with AI`,"Screenshot, teks, audio, QR, atau tautan menjadi konteks awal pemeriksaan.":`Screenshots, text, audio, QR or links provide the initial context for the examination.`,sebagai:`as`,"Sebar tiga Kartu Bukti di ruangan. Penjaga D mengambil bukti terkuat dan membawanya ke garis.":`Scatter three Evidence Cards in the room. Guard D takes the strongest evidence and takes it to the line.`,"SEBARKAN SEBELUM DIHAPUS! MEREKA MENUTUPI FAKTA!":`SPREAD BEFORE IT'S DELETED! THEY COVER THE FACTS!`,"Sebarkan sekarang sebelum dihapus":`Share now before it's deleted`,sebelum:`before`,Sebelum:`Before`,"Sebelum AI Membantu":`Before AI Helps`,"Sebelum AI Membantu...":`Before AI Helps...`,"Sebelum J.E.D.A.":`Before J.E.D.A.`,"Sebelum mulai":`Before starting`,"sebelum vs sesudah J.E.D.A.":`before vs after J.E.D.A.`,"Seberapa yakin kamu dengan keputusan final itu?":`How confident are you with the final decision?`,"Seberapa yakin kamu dengan keputusan itu?":`How confident are you with that decision?`,sebuah:`A`,"Sebuah kode QR baru meminta kamu melakukan pembayaran.":`A new QR code asks you to make a payment.`,"Sebuah layanan menginformasikan perubahan jadwal.":`A service informs you of schedule changes.`,"Sebuah pesan meminta verifikasi rekening melalui tautan.":`A message requests account verification via a link.`,"Sebuah unggahan membuat klaim tanpa menyertakan sumber yang jelas.":`A post makes a claim without providing a clear source.`,"Sebuah video tokoh publik mempromosikan peluang investasi.":`A video of a public figure promoting an investment opportunity.`,"Second opinion dengan visual clue, confidence score, dan pertanyaan reflektif - bukan keputusan akhir.":`Second opinion with visual clues, confidence scores, and reflective questions - not the final decision.`,"Selamat, Anda lolos seleksi awal. Transfer biaya administrasi hari ini untuk mengamankan posisi.":`Congratulations, you have passed the initial selection. Transfer administrative fees today to secure a position.`,"Semua garis berhasil dihadang":`All lines were blocked`,"Semua garis nalar berhasil dihadang.":`All lines of reasoning were successfully blocked.`,"Seseorang dalam rekaman suara meminta kamu mentransfer uang.":`Someone in a voice recording asks you to transfer money.`,"Seseorang meminta kamu mentransfer Rp3.000.000.":`Someone asks you to transfer IDR 3,000,000.`,setelah:`after`,"Setelah bahasanya dibuat netral, apakah keputusanmu terasa berbeda?":`Once the language was made neutral, did your decision feel different?`,"Setelah empat garis, apakah keputusanmu berubah?":`After four lines, has your decision changed?`,"Setelah empat pose":`After four poses`,"Setelah melihat bukti dan AI Lens, apa keputusanmu sekarang?":`After looking at the evidence and AI Lens, what is your decision now?`,"Setiap arena membawa bentuk informasi yang berbeda. Tipe data, preview, pertanyaan J.E.D.A., dan hasil XAI akan mengikuti kasus yang dipilih.":`Each arena carries a different form of information. Data types, previews, J.E.D.A. questions, and XAI results will follow the selected case.`,"Siapa sumber lain yang bisa mengonfirmasi keadaan darurat ini?":`What other source can confirm this emergency?`,"Simpan bukti transaksi.":`Save proof of transaction.`,"Simulasi analisis dengan bukti resmi lebih kuat":`Simulation analysis with official evidence is stronger`,"Sinkronisasi wajah perlu diperiksa":`Face sync needs to be checked`,"Sinkronisasi wajah perlu ditinjau":`Facial sync needs to be reviewed`,"Sinyal AI tidak sama dengan kebenaran":`AI signals are not the same as the truth`,"Sinyal model dapat menjadi false positive.":`Model signals can be false positives.`,"Sinyal sedang - periksa bukti resmi":`Medium signal - check official evidence`,Skenario:`Scenario`,"Skenario yang paling berguna untuk latihan":`The most useful scenarios for practice`,"Skill literasi yang terbentuk":`Formed literacy skills`,"Skor membuat permainan kompetitif; debrief memastikan setiap taktik berubah menjadi pelajaran yang dapat dipakai di dunia nyata.":`Scores make the game competitive; debrief ensures every tactic turns into a lesson that can be used in the real world.`,"Snapshot ini menunjukkan area yang bisa diperkuat pada pemeriksaan berikutnya.":`This snapshot shows areas that can be strengthened in future inspections.`,"Statistik dibuat untuk demonstrasi UI dan bukan hasil model produksi.":`The statistics are created for UI demonstration and are not production model results.`,"suara tercatat &middot; Hitung kartu yang diangkat peserta, lalu masukkan jumlahnya.":`votes are recorded · Count the cards raised by participants, then enter the number.`,sudah:`Already`,"Sudahkah kamu menelepon nomor keluarga yang tersimpan?":`Have you called the saved family number?`,"Sumber kasus":`Case source`,"Sumber primer klaim ini apa?":`What is the primary source for this claim?`,"Sumber primer tidak terlihat":`Primary sources are not visible`,"Sumber unggahan tidak jelas":`The source of the upload is unclear`,"Taktik apa yang dipakai Tim Arus?":`What tactics does the Flow Team use?`,"Taktik mana yang paling mudah membuat orang bereaksi? Mengapa tekanan itu terasa meyakinkan?":`Which tactic is easiest to get people to react? Why does that pressure feel reassuring?`,"Tampilkan situs dalam Bahasa Indonesia":`Display the site in Indonesian`,"Tangkap token informasi terlebih dahulu.":`Capture the information token first.`,"Tanpa tekanan emosi":`No emotional pressure`,"Tanyakan QR resmi kepada kasir.":`Ask the cashier for the official QR.`,"Tarik gambar ke sini atau pilih PNG, JPG, dan WEBP hingga 10 MB":`Drag images here or select PNG, JPG, and WEBP up to 10 MB`,tautan:`link`,Tautan:`Link`,"Tautan mencurigakan":`Suspicious link`,"Tautan mengarahkan keluar dari kanal resmi yang diketik sendiri.":`The link redirects away from the official channel typed in by yourself.`,"tautan palsu":`fake link`,"Tautan tidak akan dibuka. Simulasi hanya membaca struktur alamatnya.":`The link will not open. The simulation only reads the address structure.`,"Tautan yang dikirim":`Link sent`,"Tautan yang diperiksa":`Checked links`,"Tawaran kerja bergaji tinggi meminta deposit untuk proses administrasi.":`High-paying job offers require a deposit for the administrative process.`,tekanan:`pressure`,"Tekanan perlu diperiksa":`Pressure needs to be checked`,"TEKANAN PSIKOLOGIS":`PSYCHOLOGICAL PRESSURE`,"Tekanan sosial":`Social pressure`,"Tekanan waktu":`Time pressure`,"Tekanan waktu dapat mengurangi ruang untuk mengevaluasi informasi.":`Time pressure can reduce the space for evaluating information.`,"Tekanan waktu tinggi":`Time pressure is high`,"Teks / Pesan":`Text/Message`,"Teks atau pesan mencurigakan":`Suspicious texts or messages`,"Telepon nomor ibu yang tersimpan":`Call your mother's saved number`,"Telepon nomor keluarga yang sudah tersimpan.":`Call the saved family number.`,"Telepon nomor keluarga yang tersimpan":`Call the saved family number`,"Telepon nomor Mama yang tersimpan":`Call Mama's saved number`,"Tempel pesan atau klaim di sini...":`Paste a message or claim here...`,"Tempel Tautan":`Paste Link`,"Temukan sumber primer, tanggal, dan konteks sebelum membagikan ulang.":`Find primary sources, dates, and context before resharing.`,"terdeteksi sebagai pola manipulasi":`detected as a manipulation pattern`,terjadi:`happen`,terlihat:`seen`,"Teruskan rekaman":`Continue recording`,"Testimoni di pesan":`Testimonials are ordered`,tidak:`No`,Tidak:`No`,"Tidak ada risiko besar":`No major risks`,"Tidak ada sumber primer yang bisa diverifikasi.":`There are no verifiable primary sources.`,"Tidak ada tekanan":`No pressure`,"Tidak berubah":`Do not change`,"Tidak cek penerima":`Didn't check the recipient`,"Tidak mempermalukan pengguna ketika penilaian awalnya keliru.":`Doesn't embarrass users when their initial judgment is wrong.`,"Tidak mengikuti AI saat bukti lebih kuat":`Not following AI when the evidence is stronger`,"Tidak perlu mengikuti AI jika bukti lebih kuat.":`There is no need to follow AI if the evidence is stronger.`,"Tidak yakin":`Not sure`,"Tiga informasi lolos.":`Three pieces of information passed.`,"Tim Arus memakai skenario yang sudah disediakan. Peserta tidak diminta membuat hoaks baru.":`The Flow Team uses the scenarios that have been provided. Participants are not asked to create new hoaxes.`,"Tim Arus membuka kartu fisiknya. Fasilitator memilih kartu yang sama agar website menampilkan penjelasan.":`The Current Team opens its physical card. The facilitator selects the same card so that the website displays an explanation.`,"Tim bergerak ke Zona Emosi lalu menjelaskan pilihannya.":`The team moves to the Emotional Zone and then explains their choices.`,"Timer habis sebelum Tim Hadang mengunci bukti.":`The timer runs out before the Hadang Team locks up the evidence.`,tindakan:`action`,TINDAKAN:`ACTION`,"Tindakan berisiko terdeteksi":`Risky actions detected`,"TINDAKAN IMPULSIF":`IMPULSIVE ACTIONS`,"Tindakan paling aman sebelum transfer adalah...":`The safest action before a transfer is...`,"TOKEN INFORMASI":`INFORMATION TOKEN`,"Token Informasi bergerak ke arah ini &#8594;":`Information Tokens are moving in this direction →`,"Transkrip ini adalah contoh frontend, bukan hasil speech-to-text aktual.":`This transcript is a frontend example, not actual speech-to-text output.`,"Transkrip kasus":`Case transcript`,"Tubuh belum terdeteksi":`The body has not been detected`,"Tujuannya bukan sekadar menemukan “hoaks” atau “bukan hoaks”, tetapi membangun kebiasaan berpikir: berhenti dulu, periksa konteks, gunakan AI sebagai lensa, lalu ambil keputusan sendiri.":`The goal is not just to find “hoaxes” or “not hoaxes”, but to build habits of thought: stop first, check the context, use AI as a lens, then make your own decisions.`,"Tunda keputusan investasi":`Postpone investment decisions`,"Tunggu dan cek notifikasi resmi":`Wait and check the official notification`,"Tutup pertanyaan":`Close question`,"Ukur risiko sebelum bertindak":`Assess risks before acting`,"Ulangi ronde dan jaga garis .":`Repeat the round and keep the line.`,"Unggahan emosional mendorong pengguna menyebarkan klaim tanpa sumber.":`Emotional posts encourage users to spread unsourced claims.`,"Unggahan mengklaim informasi penting sedang sengaja disembunyikan.":`The post claims important information is being deliberately hidden.`,untuk:`For`,"Untuk siapa":`For who`,"Upload gambar QR":`Upload QR image`,"User mulai mengenali tekanan waktu.":`Users are starting to recognize time pressure.`,"Verifikasi identitas dapat berujung data pribadi/OTP.":`Identity verification can result in personal data/OTP.`,"VIDEO ASLI! INVESTASI INI HANYA HARI INI!":`ORIGINAL VIDEO! INVEST IN THIS TODAY ONLY!`,"Video diklaim menampilkan tokoh publik yang mendukung sebuah investasi.":`The video claims to show public figures supporting an investment.`,"Video diproses lokal di browser untuk membaca pose. Tidak direkam atau dikirim ke server.":`The video is processed locally in the browser to read the poses. Not recorded or sent to the server.`,"Video eksklusif tokoh publik membagikan peluang investasi yang hanya tersedia hari ini.":`Exclusive videos of public figures sharing investment opportunities that are only available today.`,"Video tokoh publik tampak nyata, tetapi konteks dan sumbernya tidak jelas.":`Videos of public figures appear real, but the context and source are unclear.`,"Viralitas bukan bukti; sumber primer dan pembanding memberi konteks.":`Virality is not proof; primary and comparative sources provide context.`,"Viralitas dan perilaku orang lain dipakai sebagai pengganti bukti.":`Virality and other people's behavior are used as a substitute for evidence.`,"Viralitas dipakai sebagai tekanan sosial":`Virality is used as social pressure`,"Voice note dari nomor tersebut":`Voice note from the number`,"Voting setelah permainan":`Voting after the game`,"Wajah terlihat realistis":`Face looks realistic`,"Waktu dipersempit agar korban bertindak sebelum berpikir.":`Time is limited so that victims act before thinking.`,"Warga berdiri di salah satu Zona Keputusan: Lanjut, Verifikasi, atau Berhenti.":`Citizens stand in one of the Decision Zones: Continue, Verify, or Stop.`,"Warga berpindah ke Zona Keputusan sebelum timer habis.":`Residents move to the Decision Zone before the timer runs out.`,"Warga dan seluruh peserta memilih ulang tanpa mengikuti keputusan tim lain.":`Residents and all participants voted again without following the other team's decision.`,"Warga memilih Zona Keputusan secara fisik.":`Citizens physically select Decision Zones.`,"Warna QR yang terlihat resmi":`Official looking QR colors`,"Website menjadi game master untuk permainan fisik Gobak Sodor literasi digital. Tim Arus membawa informasi menuju tindakan, sementara Tim Hadang menjaga empat garis J.E.D.A.":`The website becomes the game master for digital literacy Gobak Sodor physical games. The Flow Team brings information to action, while the Hadang Team guards the four lines of J.E.D.A.`,yang:`Which`,"Yang belum dapat dipastikan AI":`What AI cannot confirm yet`,"Yang dapat kamu verifikasi":`Which you can verify`,"ZONA TINDAKAN":`ACTION ZONE`},ie={"Latihan Hadang":`Practice Arena`,"Latihan Hadang · Arena 3D":`Practice Arena · 3D Experience`,"Arena Gobak Sodor 3D interaktif dengan empat penjaga J.E.D.A.":`Interactive 3D Gobak Sodor arena with four J.E.D.A. guards`,"Menyiapkan arena 3D":`Preparing the 3D arena`,"Kontrol arena 3D":`3D arena controls`,"Atur ulang kamera":`Reset camera`,"Jeda animasi":`Pause animation`,"Lanjutkan animasi":`Resume animation`,"Penjaga J.E.D.A.":`J.E.D.A. Guard`,"Pilih penjaga di arena":`Select a guard in the arena`,"Klik karakter untuk melihat tugasnya menghadang informasi.":`Select a character to see how they block risky information.`,"Mulai Latihan":`Start Training`,"Latih Nalar Sebelum Situasi Nyata Datang.":`Train Your Judgment Before a Real Situation Arises.`,"Hadapi simulasi manipulasi digital yang dekat dengan kehidupan sehari-hari. Setiap skenario berlangsung sekitar dua menit.":`Practice with digital-manipulation scenarios drawn from everyday life. Each scenario takes about two minutes.`,"Pilih Skenario":`Choose a Scenario`,"8 arena":`8 arenas`,"4 garis J.E.D.A.":`4 J.E.D.A. lines`,"Geser kamera · Klik penjaga":`Move the camera · Select a guard`,"8 skenario multimodal":`8 multimodal scenarios`,"Pilih arena latihan":`Choose a Training Arena`,"Setiap arena membawa bentuk informasi yang berbeda. Tipe data, preview, pertanyaan J.E.D.A., dan hasil XAI akan mengikuti kasus yang dipilih.":`Each arena uses a different content format. The data preview, J.E.D.A. questions, and XAI results adapt to the selected case.`,"Sumber kasus":`Case Source`,"Misi latihan":`Training Mission`,"Buka Arena":`Open Arena`,"Arena 3D belum tersedia":`The 3D arena is currently unavailable`,"Gunakan daftar skenario di bawah untuk melanjutkan latihan.":`Use the scenario list below to continue training.`,"Arena 3D tidak dapat dimuat":`The 3D arena could not be loaded`,"Garis J":`Line J`,"Garis E":`Line E`,"Garis D":`Line D`,"Garis A":`Line A`,Jeda:`Pause`,Emosi:`Emotion`,Data:`Evidence`,Aksi:`Action`,"Hentikan tekanan waktu sebelum informasi bergerak menuju tindakan.":`Stop time pressure before information turns into action.`,"Kenali rasa takut, panik, marah, atau FOMO yang sedang dipancing.":`Recognize the fear, panic, anger, or FOMO being triggered.`,"Pisahkan klaim dari bukti yang dapat diperiksa secara independen.":`Separate claims from evidence that can be checked independently.`,"Nilai risiko klik, scan, transfer, atau share sebelum bertindak.":`Assess the risks of clicking, scanning, transferring, or sharing before you act.`,"Pesan Keluarga Darurat":`Family Emergency Message`,"Nak, Mama kecelakaan. HP Mama rusak. Transfer Rp3 juta sekarang ke rekening ini. Tolong cepat, ya!":`Hi, it's Mom. I've had an accident and my phone is broken. Transfer IDR 3 million to this account now. Please hurry!`,"Nomor baru mengaku sebagai keluarga dan meminta transfer segera.":`A new number claims to be a family member and requests an urgent transfer.`,"Teks / Pesan":`Text / Message`,"Pesan WhatsApp dari nomor baru":`WhatsApp message from a new number`,"Pastikan identitas pengirim sebelum merespons permintaan transfer.":`Confirm the sender's identity before responding to the transfer request.`,"QR Pembayaran":`Payment QR Code`,"QR di meja kasir sedang bermasalah. Scan kode baru ini agar pembayaran langsung diproses.":`The QR code at the checkout is not working. Scan this new code so your payment can be processed immediately.`,"QR pengganti ditempel di atas kode pembayaran resmi sebuah merchant.":`A replacement QR code has been placed over a merchant's official payment code.`,"Gambar QR":`QR Image`,"Foto QR di meja kasir":`Photo of a QR code at a checkout counter`,"Periksa pemilik QR dan nama penerima sebelum pembayaran diproses.":`Check the QR owner and recipient name before making a payment.`,"Lowongan Kerja":`Job Offer`,"Tawaran kerja bergaji tinggi meminta deposit untuk proses administrasi.":`A high-paying job offer requests an administrative deposit.`,Screenshot:`Screenshot`,"Poster lowongan dari grup percakapan":`Job poster shared in a group chat`,"Bedakan tampilan profesional dari bukti rekrutmen yang dapat diverifikasi.":`Distinguish professional-looking design from verifiable recruitment evidence.`,"Pesan Bank":`Bank Message`,"Pesan mengancam pemblokiran rekening dan mengarahkan ke sebuah tautan.":`A message threatens to block an account and directs the recipient to a link.`,Tautan:`Link`,"SMS mengatasnamakan bank":`SMS claiming to be from a bank`,"Baca struktur alamat tanpa membuka tautan dan cocokkan dengan kanal bank resmi.":`Inspect the address without opening it and compare it with the bank's official channels.`,"Informasi Viral":`Viral Information`,"Mereka tidak ingin kamu tahu fakta ini. Sebarkan sekarang sebelum unggahan dihapus!":`They do not want you to know this. Share it now before the post is deleted!`,"Unggahan emosional mendorong pengguna menyebarkan klaim tanpa sumber.":`An emotional post urges people to share an unsourced claim.`,"Tangkapan layar unggahan viral":`Screenshot of a viral post`,"Temukan sumber primer, tanggal, dan konteks sebelum membagikan ulang.":`Find the primary source, date, and context before resharing.`,"Media Manipulatif":`Manipulated Media`,"Video tokoh publik tampak nyata, tetapi konteks dan sumbernya tidak jelas.":`A video of a public figure appears authentic, but its source and context are unclear.`,"Frame Video":`Video Frame`,"Potongan video dari akun tidak dikenal":`Video clip from an unknown account`,"Periksa sinkronisasi visual, sumber asli, dan legalitas ajakan investasi.":`Check visual synchronization, the original source, and whether the investment offer is legitimate.`,"AI Bisa Salah":`AI Can Be Wrong`,"Bukti resmi dapat lebih kuat daripada sinyal AI. Latih keberanian untuk tidak setuju.":`Official evidence may be stronger than an AI signal. Practice challenging the model when evidence supports you.`,"Notifikasi Resmi":`Official Notification`,"Pemberitahuan dalam aplikasi layanan":`Notification in an official service app`,"Bandingkan skor AI dengan bukti resmi dan kenali kemungkinan false positive.":`Compare the AI score with official evidence and consider the possibility of a false positive.`,"Voice Note Keluarga":`Family Voice Note`,"Rekaman suara mirip anggota keluarga meminta transfer dan melarang kamu menelepon.":`A voice resembling a family member requests a transfer and tells you not to call.`,"Voice Note":`Voice Note`,"Rekaman 18 detik dari nomor baru":`18-second recording from a new number`,"Nilai pola suara, isi permintaan, dan lakukan konfirmasi melalui kanal lain.":`Assess the voice pattern and request, then confirm through another channel.`,"HADANGIN · Arena Komunitas":`HADANGIN · Community Arena`,"Arena Komunitas":`Community Arena`,"Satu Tim Meloloskan. Satu Tim Menghadang.":`One Team Pushes Information Through. One Team Blocks It.`,"Website menjadi game master untuk permainan fisik Gobak Sodor literasi digital. Tim Arus membawa informasi menuju tindakan, sementara Tim Hadang menjaga empat garis J.E.D.A.":`The website acts as game master for a physical digital-literacy game inspired by Gobak Sodor. The Flow Team moves information toward action, while the Guard Team protects the four J.E.D.A. lines.`,"Pilih cara bermain":`Choose How to Play`,"Arena Offline memakai dua tim dan perlengkapan fisik. Arena Kamera AI memakai gerakan tubuh satu penjaga aktif.":`Offline Arena uses two teams and physical materials. AI Camera Arena uses the body movements of one active guard.`,"Kelompok peserta":`Participant Group`,Keluarga:`Families`,"Dewasa & Lansia":`Adults & Older Adults`,Sekolah:`Schools`,"Komunitas Umum":`General Community`,"Durasi sesi":`Session Length`,"30 menit":`30 minutes`,"60 menit":`60 minutes`,"90 menit":`90 minutes`,"Paket kasus":`Case Pack`,"Keluarga & Keuangan":`Family & Finance`,"Teks + Voice Note":`Text + Voice Note`,"Fokus pada urgency, identitas, dan transfer yang sulit dibatalkan.":`Focus on urgency, identity, and transfers that are difficult to reverse.`,"Hoaks di Ruang Publik":`Hoaxes in Public Spaces`,"Screenshot + Video":`Screenshot + Video`,"Fokus pada sumber primer, konteks, dan tekanan untuk membagikan.":`Focus on primary sources, context, and pressure to share.`,"Aman Bertransaksi":`Safer Transactions`,"QR + Tautan":`QR Code + Link`,"Fokus pada penerima, domain tujuan, dan kanal pembayaran resmi.":`Focus on the recipient, destination domain, and official payment channels.`,"Mode permainan":`Game Mode`,"Arena Offline":`Offline Arena`,"Dua tim bergerak di lapangan fisik. Website mengatur kasus, timer, pertanyaan, dan skor.":`Two teams move through a physical court while the website manages the case, timer, questions, and score.`,"Mode utama":`Primary Mode`,"Arena Kamera AI":`AI Camera Arena`,"Satu penjaga aktif melakukan pose Hadang. Computer Vision membaca gerakan langsung di perangkat.":`One active guard performs a blocking pose. Computer Vision reads the movement directly on the device.`,"Posisi bermain":`Player Position`,"Satu peserta berdiri sekitar 2 meter dari kamera. Peserta lain mendiskusikan pertanyaan J.E.D.A. dan bergantian menjadi penjaga.":`One participant stands about two meters from the camera. The others discuss the J.E.D.A. questions and take turns as the guard.`,"Nama tim pembawa informasi":`Information Carrier Team Name`,"Nama tim penjaga nalar":`Literacy Guard Team Name`,"Tim Arus":`Flow Team`,"Tim Hadang":`Guard Team`,"Perkiraan peserta":`Estimated Participants`,"4-120 orang":`4-120 people`,"Buka Arena Kamera AI":`Open AI Camera Arena`,"Siapkan Arena Offline":`Set Up Offline Arena`,"Ringkasan sesi yang akan dibuat":`Summary of the session being created`,"Pratinjau pertandingan":`Match Preview`,"Pratinjau Arena Kamera":`Camera Arena Preview`,"AI lokal · Tanpa rekaman":`On-device AI · No recording`,"1 layar · Tanpa login":`1 screen · No login`,"Kasus pembuka":`Opening Case`,Peserta:`Participants`,Durasi:`Duration`,Format:`Format`,Peralatan:`Equipment`,"Laptop, webcam, ruang gerak 2 meter":`Laptop, webcam, and a two-meter movement area`,"Laptop, proyektor, kartu, selotip":`Laptop, projector, cards, and floor tape`,"Vote Ulang":`Vote Again`,"Video diproses lokal di browser untuk membaca pose. Tidak direkam atau dikirim ke server.":`Video is processed on the device in the browser to detect poses. It is not recorded or sent to a server.`,"Tim Arus memakai skenario yang sudah disediakan. Peserta tidak diminta membuat hoaks baru.":`The Flow Team uses a provided scenario. Participants are never asked to create new hoaxes.`,"Persiapan · sekitar 5 menit":`Preparation · About 5 Minutes`,"Bangun lapangan J.E.D.A.":`Build the J.E.D.A. Court`,"Buat empat garis dengan selotip. Tim Arus mulai dari sisi MASUK dan membawa Token Informasi menuju Zona Tindakan.":`Create four lines with floor tape. The Flow Team starts at ENTRY and carries the Information Token toward the Action Zone.`,"Cetak Kartu & Penanda":`Print Cards & Markers`,"Unduh Panduan":`Download Guide`,"Ubah Pengaturan":`Change Settings`,"Perlengkapan Arena Hadang berupa kartu J.E.D.A., token Informasi, kartu keputusan, selotip, dan papan skor":`Blocking Arena kit containing J.E.D.A. cards, an Information Token, decision cards, floor tape, and a scoreboard`,"Kit Arena Hadang":`Blocking Arena Kit`,"Kartu J.E.D.A., kartu keputusan, kartu taktik, Token Informasi, dan penanda garis.":`J.E.D.A. cards, decision cards, tactic cards, an Information Token, and line markers.`,"Denah ruangan":`Room Layout`,"Minimal 3 x 6 meter":`Minimum 3 × 6 meters`,MASUK:`ENTRY`,TINDAKAN:`ACTION`,"Token Informasi bergerak ke arah ini →":`The Information Token moves in this direction →`,"Runner membawa token; Strategist memainkan Kartu Taktik.":`The Runner carries the token; the Strategist plays Tactic Cards.`,"Satu penjaga untuk setiap garis J.E.D.A.":`One guard protects each J.E.D.A. line.`,Warga:`Decision Makers`,"Mengambil keputusan akhir di Zona Tindakan.":`Make the final decision in the Action Zone.`,"Checklist fasilitator":`Facilitator Checklist`,"Pastikan arena siap sebelum ditampilkan ke peserta.":`Make sure the arena is ready before inviting participants in.`,"Empat garis sudah dibuat":`All four lines have been marked`,"Kartu permainan sudah dipotong":`Game cards have been cut out`,"Peran kedua tim sudah dibagi":`Both teams have assigned their roles`,"Layar dapat dilihat semua peserta":`The screen is visible to all participants`,"Mulai Voting Awal":`Start Initial Vote`,"Voting Awal":`Initial Vote`,"Arena Hadang":`Blocking Arena`,"Voting Akhir":`Final Vote`,Ronde:`Round`,"Arena offline · Host lokal":`Offline arena · Local host`,"Akhiri Sesi":`End Session`,"PEMBAWA INFORMASI":`INFORMATION CARRIERS`,"PENJAGA NALAR":`LITERACY GUARDS`,Lanjut:`Proceed`,"Verifikasi Dulu":`Verify First`,Berhenti:`Stop`,"Belum Yakin":`Not Sure Yet`,Kurangi:`Decrease`,Tambah:`Increase`,"suara tercatat · Hitung kartu yang diangkat peserta, lalu masukkan jumlahnya.":`votes recorded · Count the cards raised by participants, then enter the total.`,"Mode beta":`Beta Mode`,"Arena Kamera AI · Proses lokal":`AI Camera Arena · On-device processing`,"Arena Kamera":`Camera Arena`,"Kasus untuk peserta":`Case for Participants`,"Apa respons pertamamu sebelum mendapat petunjuk?":`What is your first response before receiving any clues?`,"Voting tanpa petunjuk":`Vote Without Clues`,"Catat respons awal":`Record the Initial Response`,"Peserta mengangkat kartu keputusan. Kamera belum digunakan pada tahap ini.":`Participants raise a decision card. The camera is not used at this stage.`,"Masuk Arena Kamera":`Enter Camera Arena`,"Setelah empat pose":`After Four Poses`,"Apakah keputusan kelompok berubah?":`Did the Group's Decision Change?`,"Computer Vision hanya memastikan pose tubuh. Alasan, bukti, dan keputusan tetap berasal dari diskusi peserta.":`Computer Vision only confirms the body pose. The reasoning, evidence, and decision still come from the participants' discussion.`,"Voting akhir":`Final Vote`,"Hitung kartu peserta":`Count Participant Cards`,"Lihat Debrief":`View Debrief`,"Ringkasan Arena Kamera AI":`AI Camera Arena Summary`,"Gerak tubuh membuka ruang untuk berpikir bersama.":`Body Movement Creates Space for Collective Reflection.`,"Pose mengaktifkan setiap garis, tetapi peserta tetap harus menjelaskan tekanan, emosi, bukti, dan tindakan aman sesuai kasus.":`A pose activates each line, but participants must still explain the pressure, emotion, evidence, and safer action for the case.`,"Pose Hadang":`Blocking Poses`,"Empat garis J.E.D.A. diselesaikan bergantian.":`The four J.E.D.A. lines were completed in turn.`,"Risiko awal":`Initial Risk`,"Peserta yang semula memilih langsung lanjut.":`Participants who initially chose to proceed immediately.`,"Keputusan aman":`Safer Decisions`,"Peserta memilih verifikasi atau berhenti pada voting akhir.":`Participants chose to verify or stop in the final vote.`,"Apa yang dibaca AI?":`What Does the AI Detect?`,"Posisi titik tubuh untuk mengenali pose kedua tangan terangkat. Video diproses lokal dan tidak disimpan.":`Body landmark positions used to recognize a two-hands-raised pose. Video is processed on the device and is not stored.`,"Apa yang dinilai manusia?":`What Do People Evaluate?`,"Kualitas alasan, bukti independen, dan keputusan aman. AI tidak menentukan benar atau salahnya peserta.":`The quality of the reasoning, independent evidence, and safer decision. AI does not decide whether participants are right or wrong.`,"Buat Sesi Baru":`Create New Session`,"Arena selesai":`Arena Complete`,"Semua garis nalar berhasil dihadang.":`All reasoning lines have been successfully defended.`,"Virtual Gobak Sodor · AI Computer Vision":`Virtual Gobak Sodor · AI Computer Vision`,"Hadang informasi dengan gerakan tubuh.":`Block Risky Information with Body Movement.`,"Satu penjaga berdiri di depan kamera. Kelompok membahas pertanyaan kasus, lalu penjaga mengangkat kedua tangan untuk mengunci garis.":`One guard stands in front of the camera. The group discusses the case question, then the guard raises both hands to lock the line.`,"Diproses lokal · Tidak direkam":`Processed on device · Not recorded`,"Preview kamera pemain":`Player camera preview`,"Kamera belum aktif":`Camera is off`,"Aktifkan saat penjaga sudah siap di depan layar.":`Turn it on when the guard is ready in front of the screen.`,PENJAGA:`GUARD`,"Kamera tidak aktif":`Camera is off`,"Angkat kedua tangan untuk Hadang":`Raise both hands to block`,"GARIS AKTIF":`ACTIVE LINE`,SELESAI:`COMPLETE`,Selesai:`Complete`,"Giliran ini":`Current Turn`,Menunggu:`Waiting`,"Cara bermain":`How to Play`,"1. Berdiri hingga skeleton muncul.2. Bahas pertanyaan garis aktif.3. Angkat kedua tangan selama 1 detik.":`1. Stand where the skeleton is visible. 2. Discuss the active-line question. 3. Raise both hands for one second.`,"1. Berdiri hingga skeleton muncul.":`1. Stand where the skeleton is visible.`,"2. Bahas pertanyaan garis aktif.":`2. Discuss the active-line question.`,"3. Angkat kedua tangan selama 1 detik.":`3. Raise both hands for one second.`,"Matikan Kamera":`Turn Off Camera`,"Aktifkan Kamera AI":`Turn On AI Camera`,"Tandai manual":`Mark Manually`,"dari 4 garis berhasil dihadang":`of 4 lines successfully defended`,"Buka Voting Akhir":`Open Final Vote`,"Kasus untuk Warga":`Case for Decision Makers`,"Angkat Kartu Keputusan: apa respons pertamamu?":`Raise a Decision Card: what is your first response?`,"Jangan bahas jawabannya dulu. Catat respons spontan kelompok sebelum Tim Arus mulai bergerak.":`Do not discuss the answer yet. Record the group's spontaneous response before the Flow Team starts moving.`,"Lepaskan Tim Arus":`Release the Flow Team`,"Buka kartu · AI Lens sebagai wasit penjelas":`Reveal the Card · AI Lens as an Explanatory Referee`,"Taktik apa yang dipakai Tim Arus?":`Which Tactic Did the Flow Team Use?`,"Tim Arus membuka kartu fisiknya. Fasilitator memilih kartu yang sama agar website menampilkan penjelasan.":`The Flow Team reveals its physical card. The facilitator selects the matching card so the website can explain the tactic.`,"terdeteksi sebagai pola manipulasi":`was detected as a manipulation pattern`,"AI hanya membuka pola setelah manusia bermain; keputusan dan skor tetap berasal dari peserta.":`AI only reveals the pattern after people have played; decisions and scores still come from the participants.`,"Pilih kartu yang digunakan untuk membuka penjelasan AI.":`Select the card that was used to reveal the AI explanation.`,DIHADANG:`BLOCKED`,LOLOS:`PASSED`,"Lanjut Voting Akhir":`Continue to Final Vote`,"Angkat kartu sekali lagi":`Raise the Cards Again`,"Setelah empat garis, apakah keputusanmu berubah?":`After four lines, did your decision change?`,"Warga dan seluruh peserta memilih ulang tanpa mengikuti keputusan tim lain.":`All participants vote again without following another team's decision.`,"Voting setelah permainan":`Post-game Vote`,"Ringkasan ronde":`Round Summary`,"menjaga nalar lebih kuat.":`protected the group's judgment more effectively.`,"berhasil memberi tekanan.":`successfully applied pressure.`,"Skor membuat permainan kompetitif; debrief memastikan setiap taktik berubah menjadi pelajaran yang dapat dipakai di dunia nyata.":`The score makes the game competitive; the debrief turns every tactic into a lesson participants can use in real life.`,"Peserta memilih langsung lanjut sebelum melewati J.E.D.A.":`Participants chose to proceed immediately before completing J.E.D.A.`,"Peserta memilih verifikasi atau berhenti setelah bermain.":`Participants chose to verify or stop after playing.`,"Skor ronde":`Round Score`,"Debrief Tim Arus":`Flow Team Debrief`,"Taktik mana yang paling mudah membuat orang bereaksi? Mengapa tekanan itu terasa meyakinkan?":`Which tactic most easily triggered a reaction? Why did that pressure feel convincing?`,"Debrief Tim Hadang":`Guard Team Debrief`,"Garis mana yang paling sulit dijaga? Bukti apa yang benar-benar mengubah keputusan Warga?":`Which line was hardest to protect? What evidence genuinely changed the participants' decision?`,"Cetak Kit Permainan":`Print Game Kit`,"Tukar Peran & Ronde Baru":`Swap Roles & Start a New Round`,RONDE:`ROUND`,GARIS:`LINE`,TERHADANG:`BLOCKED`,BERGERAK:`MOVING`,"AKSI FISIK":`PHYSICAL ACTION`,"Kontrol fasilitator":`Facilitator Controls`,"Berhasil dihadang":`Successfully Blocked`,"Informasi lolos":`Information Passed`,"Jeda Timer":`Pause Timer`,"Lanjut Timer":`Resume Timer`,"Mulai Timer":`Start Timer`,"Tim Arus: -5 detik":`Flow Team: -5 seconds`,"Kunci Jawaban":`Lock Answer`,"Buka Taktik & AI Lens":`Reveal Tactic & AI Lens`,"Lanjut ke Garis Berikutnya":`Continue to the Next Line`,"Peserta bergerak dan memilih kartu fisik. Fasilitator mencatat pilihan yang sama di layar.":`Participants move and choose a physical card. The facilitator records the same choice on screen.`,"Bagian mana yang paling mempersempit waktu berpikir?":`Which part creates the greatest time pressure?`,"Letakkan tiga Kartu Kutipan di seberang garis. Penjaga J mengambil satu kartu sebelum timer habis.":`Place three Quote Cards across the line. Guard J must retrieve one before time runs out.`,"Transfer Rp3 juta sekarang":`Transfer IDR 3 million now`,"HP Mama rusak":`Mom's phone is broken`,"Nomor rekening ini":`This bank account number`,"Kata 'sekarang' mendorong tindakan sebelum identitas dikonfirmasi.":`The word 'now' pushes people to act before confirming identity.`,"Emosi utama apa yang sedang dimanfaatkan?":`Which primary emotion is being exploited?`,"Buat tiga zona emosi di lantai. Tim Hadang berpindah bersama ke zona pilihannya.":`Create three emotion zones on the floor. The Guard Team moves together to its chosen zone.`,"Takut dan panik":`Fear and panic`,Bangga:`Pride`,Bosan:`Boredom`,"Keadaan darurat keluarga memanfaatkan rasa takut dan tanggung jawab.":`A family emergency exploits fear and a sense of responsibility.`,"Bukti independen mana yang paling kuat?":`Which independent evidence is strongest?`,"Sebar tiga Kartu Bukti di ruangan. Penjaga D mengambil bukti terkuat dan membawanya ke garis.":`Place three Evidence Cards around the room. Guard D retrieves the strongest evidence and brings it to the line.`,"Voice note nomor baru":`Voice note from the new number`,"Telepon nomor Mama yang tersimpan":`Call Mom's saved number`,"Foto profil pengirim":`Sender's profile photo`,"Konfirmasi lewat kanal yang sudah dikenal lebih kuat daripada bukti dari pengirim yang sama.":`Confirmation through a trusted channel is stronger than evidence supplied by the same sender.`,"Tindakan paling aman sebelum transfer adalah...":`The safest action before transferring money is...`,"Warga berdiri di salah satu Zona Keputusan: Lanjut, Verifikasi, atau Berhenti.":`Decision Makers stand in one Decision Zone: Proceed, Verify, or Stop.`,"Transfer sebagian dulu":`Transfer a smaller amount first`,"Hubungi keluarga lewat kanal lain":`Contact the family member through another channel`,"Balas dan minta foto":`Reply and ask for a photo`,"Pindah kanal dan konfirmasi identitas sebelum melakukan tindakan finansial.":`Switch channels and confirm identity before taking any financial action.`,"Frasa mana yang mendorong kita menyebarkan tanpa memeriksa?":`Which phrase urges us to share without checking?`,"Penjaga J memilih Kartu Kutipan dan menaruhnya di garis.":`Guard J selects a Quote Card and places it on the line.`,"Sebarkan sekarang sebelum dihapus":`Share it now before it is deleted`,"Informasi ini sedang ramai":`This information is trending`,"Ada unggahan baru":`There is a new post`,"Ancaman penghapusan menciptakan kelangkaan waktu palsu.":`The threat of deletion creates false time scarcity.`,"Emosi apa yang paling mungkin mendorong tombol share?":`Which emotion is most likely to trigger sharing?`,"Peserta bergerak ke Zona Emosi yang paling sesuai lalu menyebut alasannya.":`Participants move to the most relevant Emotion Zone and explain their choice.`,"Marah dan curiga":`Anger and suspicion`,Tenang:`Calm`,"Bingung ringan":`Mild confusion`,"Kemarahan membuat klaim terasa layak dibagikan sebelum sumbernya jelas.":`Anger can make a claim feel worth sharing before its source is clear.`,"Apa pemeriksaan paling independen untuk klaim viral?":`What is the most independent way to check a viral claim?`,"Penjaga D mengambil satu Kartu Bukti dari sisi ruangan.":`Guard D retrieves one Evidence Card from the side of the room.`,"Jumlah share":`Share count`,"Komentar yang setuju":`Supporting comments`,"Sumber primer dan laporan pembanding":`Primary sources and independent reports`,"Viralitas bukan bukti; sumber primer dan pembanding memberi konteks.":`Virality is not evidence; primary sources and independent reports provide context.`,"Apa tindakan aman ketika konteks belum lengkap?":`What is a safer action when the context is incomplete?`,"Warga berpindah ke Zona Keputusan sebelum timer habis.":`Decision Makers move to a Decision Zone before time runs out.`,"Bagikan dengan tanda tanya":`Share it with a question mark`,"Tunda dan cari konteks":`Wait and find more context`,"Kirim ke grup keluarga":`Send it to the family group`,"Menunda share mencegah klaim tanpa konteks menyebar lebih jauh.":`Delaying a share prevents a context-free claim from spreading further.`,"Apa yang membuat orang ingin langsung memindai QR?":`What makes people want to scan the QR code immediately?`,"Penjaga J mengambil Kartu Pemicu yang paling tepat.":`Guard J retrieves the most relevant Trigger Card.`,"Antrean dan ingin cepat selesai":`A queue and the desire to finish quickly`,"Warna stiker":`Sticker color`,"Ukuran kode":`Code size`,"Kebiasaan dan tekanan antrean dapat mengurangi pemeriksaan penerima.":`Habit and queue pressure can reduce attention to the payment recipient.`,"Kondisi apa yang sedang dimanfaatkan?":`Which condition is being exploited?`,"Tim bergerak ke Zona Emosi lalu menjelaskan pilihannya.":`The team moves to an Emotion Zone and explains its choice.`,"Nyaman dan terburu-buru":`Comfort and haste`,Sedih:`Sadness`,"Rasa nyaman pada rutinitas pembayaran dapat menurunkan kewaspadaan.":`Familiar payment routines can lower vigilance.`,"Bukti terkuat bahwa QR memang resmi adalah...":`The strongest evidence that the QR code is official is...`,"Penjaga D memilih satu Kartu Bukti dan menyerahkannya kepada Warga.":`Guard D selects one Evidence Card and gives it to the Decision Makers.`,"Logo pada stiker":`Logo on the sticker`,"Konfirmasi kasir dan nama penerima":`Cashier confirmation and recipient name`,"QR terlihat baru":`The QR code looks new`,"Konfirmasi kasir dan identitas penerima lebih kuat daripada tampilan stiker.":`Cashier confirmation and recipient identity are stronger than the sticker's appearance.`,"Apa yang harus dilakukan sebelum menyelesaikan pembayaran?":`What should you do before completing the payment?`,"Warga memilih Zona Keputusan secara fisik.":`Decision Makers physically choose a Decision Zone.`,"Masukkan PIN secepatnya":`Enter the PIN as quickly as possible`,"Periksa nama penerima":`Check the recipient name`,"Foto QR untuk nanti":`Photograph the QR code for later`,"Nama penerima harus sesuai sebelum transaksi yang sulit dibatalkan.":`The recipient name must match before completing a transaction that may be difficult to reverse.`,Urgency:`Urgency`,Authority:`Authority`,Fear:`Fear`,"Social Pressure":`Social Pressure`,"Waktu dipersempit agar korban bertindak sebelum berpikir.":`Time is compressed so the target acts before thinking.`,"Nama, seragam, atau institusi dipakai untuk meminjam kepercayaan.":`A name, uniform, or institution is used to borrow credibility.`,"Ancaman kerugian atau keadaan darurat memancing kepanikan.":`A threat of loss or an emergency is used to trigger panic.`,"Viralitas dan perilaku orang lain dipakai sebagai pengganti bukti.":`Virality and other people's behavior are used as substitutes for evidence.`,"Memuat model pose AI...":`Loading the AI pose model...`,"Posisikan satu pemain di dalam bingkai":`Position one player inside the frame`,"Tubuh belum terdeteksi":`No body detected`,Kalibrasi:`Calibration`,"Berdiri di tengah dan lihat kamera":`Stand in the center and face the camera`,"Tubuh terdeteksi - arena siap":`Body detected - arena ready`,"Semua garis berhasil dihadang":`All lines successfully defended`,"Pose Hadang terbaca":`Blocking pose detected`,"Tahan pose Hadang...":`Hold the blocking pose...`,"Garis berhasil dihadang":`Line successfully defended`,"Menyiapkan kalibrasi":`Preparing calibration`,"Kamera tidak didukung browser ini":`This browser does not support camera access`,"Meminta izin kamera...":`Requesting camera permission...`,"Izin kamera ditolak. Gunakan kontrol manual.":`Camera permission was denied. Use the manual control.`,"Model AI gagal dimuat. Gunakan kontrol manual.":`The AI model could not be loaded. Use the manual control.`,"Panduan fasilitator":`Facilitator Guide`,"Cara memainkan Arena Offline":`How to Play the Offline Arena`,"Baca sebelum mulai":`Read Before Starting`,"Lihat alur, fungsi kartu, dan skor":`View the Flow, Card Roles, and Scoring`,"Alur satu ronde":`One-Round Flow`,"Website dipegang fasilitator. Peserta bergerak, berdiskusi, dan mengangkat kartu fisik.":`The facilitator operates the website. Participants move, discuss, and raise physical cards.`,"Siapkan arena dan peran":`Set Up the Arena and Roles`,"Tempel penanda J, E, D, A berurutan. Bagi peserta menjadi Tim Arus, Tim Hadang, dan Warga.":`Place the J, E, D, and A markers in order. Divide participants into the Flow Team, Guard Team, and Decision Makers.`,"Voting awal":`Initial Vote`,"Fasilitator menampilkan kasus. Semua Warga mengangkat Kartu Keputusan tanpa berdiskusi; jumlahnya dicatat di website.":`The facilitator presents the case. All Decision Makers raise a Decision Card without discussion; the facilitator records the totals on the website.`,"Tim Arus mulai bergerak":`The Flow Team Starts Moving`,"Strategist mengambil satu Kartu Taktik secara rahasia. Runner membawa Token Informasi dari MASUK menuju TINDAKAN.":`The Strategist secretly draws one Tactic Card. The Runner carries the Information Token from ENTRY toward ACTION.`,"Hadang di empat garis":`Defend the Four Lines`,"Di setiap garis, Tim Hadang punya 30 detik untuk membahas pertanyaan dan memilih jawaban. Tim Arus boleh memakai tekanan -5 detik satu kali, lalu fasilitator mengunci jawaban.":`At each line, the Guard Team has 30 seconds to discuss the question and select an answer. The Flow Team may apply the five-second pressure once, then the facilitator locks the answer.`,"Buka taktik dan AI Lens":`Reveal the Tactic and AI Lens`,"Setelah garis A, Tim Arus membuka Kartu Taktik. Fasilitator memilih kartu yang sama agar pola manipulasi dijelaskan.":`After line A, the Flow Team reveals its Tactic Card. The facilitator selects the same card so the manipulation pattern can be explained.`,"Voting akhir dan tukar peran":`Final Vote and Role Swap`,"Warga memilih ulang, lalu kelompok membahas perubahan keputusan. Tukar Tim Arus dan Tim Hadang sebelum ronde berikutnya.":`Decision Makers vote again, then the group discusses any changes. Swap the Flow Team and Guard Team before the next round.`,"Fungsi kit cetak":`How to Use the Printable Kit`,"Potong kartu sebelum sesi dan bagikan sesuai peran berikut.":`Cut out the cards before the session and distribute them according to these roles.`,"Token Informasi":`Information Token`,"Dibawa Runner dan dipindahkan satu garis setelah setiap tantangan selesai.":`Carried by the Runner and advanced one line after each challenge is resolved.`,"Kartu J.E.D.A.":`J.E.D.A. Cards`,"Diletakkan di garis Jeda, Emosi, Data, dan Aksi sebagai pengingat pertanyaan.":`Placed at the Pause, Emotion, Evidence, and Action lines as question prompts.`,"Kartu Taktik":`Tactic Cards`,"Dipegang Strategist Tim Arus secara rahasia dan dibuka setelah empat garis.":`Kept secret by the Flow Team Strategist and revealed after all four lines.`,"Kartu Keputusan":`Decision Cards`,"Satu set untuk setiap Warga: Lanjut, Verifikasi, Berhenti, atau Belum Yakin.":`One set for each Decision Maker: Proceed, Verify, Stop, or Not Sure.`,"Penanda garis":`Line Markers`,"Ditempel di lantai dengan selotip untuk membentuk jalur MASUK sampai TINDAKAN.":`Taped to the floor to create a path from ENTRY to ACTION.`,"Tim Hadang +1":`Guard Team +1`,"jika jawaban benar.":`for a correct answer.`,"Tim Arus +1":`Flow Team +1`,"jika jawaban salah atau waktu habis. Keputusan aman terbanyak pada voting akhir memberi Tim Hadang":`for an incorrect answer or when time runs out. A majority of safer final votes gives the Guard Team a`,"bonus +2":`+2 bonus`,"Untuk 8-24 peserta: tempatkan 2-4 orang di Tim Arus, 4 penjaga di Tim Hadang, dan peserta lain sebagai Warga. Mainkan dua ronde agar tim bertukar peran. Gunakan kasus yang tersedia, tanpa data pribadi dan tanpa kontak fisik.":`For 8-24 participants, assign 2-4 people to the Flow Team, four guards to the Guard Team, and everyone else as Decision Makers. Play two rounds so the teams swap roles. Use the provided cases, avoid personal data, and keep the game non-contact.`,"Bagaimana HADANGIN Bekerja?":`How HADANGIN Works`},ae=`Nak, Mama kecelakaan. HP Mama rusak. Transfer Rp3 juta sekarang ke rekening ini. Tolong cepat, ya!`,oe=new URL(`/assets/hadangin-offline-kit-CI_rPnBc.png`,``+import.meta.url).href,se=new URL(`/assets/tolong_buatkan_video_songnya-B60BK3da.mp4`,``+import.meta.url).href,ce=new URL(`/assets/Logo_only_vector-BH9aTUxw.svg`,``+import.meta.url).href,le=new URL(`/assets/HADANGIN_CAPT_HORIZONTAL-qXG8iKBR.svg`,``+import.meta.url).href,ue=new URL(`/assets/gobak-sodor-identity-BBF7BzsS.png`,``+import.meta.url).href,de=[{id:`family-emergency`,no:`01`,title:`Pesan Keluarga Darurat`,description:`Nomor baru mengaku sebagai keluarga dan meminta transfer segera.`,triggers:[`Urgency`,`Fear`,`Attachment`],inputType:`text`,format:`Teks / Pesan`,source:`Pesan WhatsApp dari nomor baru`,mission:`Pastikan identitas pengirim sebelum merespons permintaan transfer.`,content:ae,featured:!0},{id:`qr-payment`,no:`02`,title:`QR Pembayaran`,description:`QR pengganti ditempel di atas kode pembayaran resmi sebuah merchant.`,triggers:[`Trust`,`Habit`,`Convenience`],inputType:`qr`,inputMode:`image`,format:`Gambar QR`,source:`Foto QR di meja kasir`,mission:`Periksa pemilik QR dan nama penerima sebelum pembayaran diproses.`,content:`QR di meja kasir sedang bermasalah. Scan kode baru ini agar pembayaran langsung diproses.`},{id:`job-offer`,no:`03`,title:`Lowongan Kerja`,description:`Tawaran kerja bergaji tinggi meminta deposit untuk proses administrasi.`,triggers:[`Hope`,`Authority`,`Scarcity`],inputType:`image`,format:`Screenshot`,source:`Poster lowongan dari grup percakapan`,mission:`Bedakan tampilan profesional dari bukti rekrutmen yang dapat diverifikasi.`,content:`Selamat, Anda lolos seleksi awal. Transfer biaya administrasi hari ini untuk mengamankan posisi.`},{id:`bank-message`,no:`04`,title:`Pesan Bank`,description:`Pesan mengancam pemblokiran rekening dan mengarahkan ke sebuah tautan.`,triggers:[`Fear`,`Authority`,`Urgency`],inputType:`qr`,inputMode:`link`,format:`Tautan`,source:`SMS mengatasnamakan bank`,mission:`Baca struktur alamat tanpa membuka tautan dan cocokkan dengan kanal bank resmi.`,content:`Rekening Anda akan diblokir dalam 30 menit. Klik tautan ini untuk verifikasi identitas.`,payload:`https://secure-verifikasi-akun.example/login?session=30min`},{id:`viral-info`,no:`05`,title:`Informasi Viral`,description:`Unggahan emosional mendorong pengguna menyebarkan klaim tanpa sumber.`,triggers:[`Anger`,`Social Pressure`],inputType:`image`,format:`Screenshot`,source:`Tangkapan layar unggahan viral`,mission:`Temukan sumber primer, tanggal, dan konteks sebelum membagikan ulang.`,content:`Mereka tidak ingin kamu tahu fakta ini. Sebarkan sekarang sebelum unggahan dihapus!`},{id:`manipulated-media`,no:`06`,title:`Media Manipulatif`,description:`Video tokoh publik tampak nyata, tetapi konteks dan sumbernya tidak jelas.`,triggers:[`Realism`,`Authority`],inputType:`image`,format:`Frame Video`,source:`Potongan video dari akun tidak dikenal`,mission:`Periksa sinkronisasi visual, sumber asli, dan legalitas ajakan investasi.`,content:`Video eksklusif tokoh publik membagikan peluang investasi yang hanya tersedia hari ini.`},{id:`ai-can-be-wrong`,no:`07`,title:`AI Bisa Salah`,description:`Bukti resmi dapat lebih kuat daripada sinyal AI. Latih keberanian untuk tidak setuju.`,triggers:[`Automation Bias`],inputType:`text`,format:`Notifikasi Resmi`,source:`Pemberitahuan dalam aplikasi layanan`,mission:`Bandingkan skor AI dengan bukti resmi dan kenali kemungkinan false positive.`,content:`Pemberitahuan resmi: jadwal layanan berubah. Periksa pembaruan pada aplikasi resmi.`,aiWrong:!0},{id:`audio-impersonation`,no:`08`,title:`Voice Note Keluarga`,description:`Rekaman suara mirip anggota keluarga meminta transfer dan melarang kamu menelepon.`,triggers:[`Voice Clone`,`Urgency`,`Fear`],inputType:`audio`,format:`Voice Note`,source:`Rekaman 18 detik dari nomor baru`,mission:`Nilai pola suara, isi permintaan, dan lakukan konfirmasi melalui kanal lain.`,content:`Nak, ini Mama. Nomor Mama sedang bermasalah. Tolong transfer sekarang dan jangan telepon dulu.`}],fe={"family-emergency":{neutralOriginal:`MAMA KECELAKAAN! TRANSFER SEKARANG!`,neutralVersion:`Seseorang meminta kamu mentransfer Rp3.000.000.`,claim:`Pengirim mengaku sebagai ibu dan sedang mengalami keadaan darurat.`,evidenceOptions:[`Foto dari nomor tersebut`,`Voice note dari nomor tersebut`,`Nomor rekening yang diberikan`,`Telepon nomor ibu yang tersimpan`],preferredEvidence:`Telepon nomor ibu yang tersimpan`,actionOptions:[`Transfer`,`Klik`,`Berikan OTP`,`Share`],riskOptions:[`Kehilangan uang`,`Akun diambil alih`,`Data pribadi bocor`,`Misinformasi menyebar`],saferOptions:[`Telepon nomor tersimpan`,`Buka aplikasi resmi sendiri`,`Cari sumber independen`,`Tunggu dan cek ulang`],aiNotices:[[`Pressure`,`“sekarang”, “tolong cepat”`],[`Emotion`,`Emergency framing`],[`Identity`,`Identitas belum terkonfirmasi`],[`Requested action`,`Transfer segera`]],aiLevel:`High`,aiScore:82,unknowns:[`Identitas asli pengirim.`,`Apakah keadaan darurat benar terjadi.`,`Konteks lengkap di luar pesan ini.`,`Apakah model salah membaca sinyal.`],verification:[`Hubungi nomor keluarga yang tersimpan.`,`Periksa penerima sebelum pembayaran.`,`Tanya anggota keluarga lain.`,`Gunakan kanal di luar pesan ini.`]},"qr-payment":{neutralOriginal:`QR LAMA RUSAK. SCAN YANG BARU SEKARANG!`,neutralVersion:`Sebuah kode QR baru meminta kamu melakukan pembayaran.`,claim:`Kode QR baru diklaim sebagai kanal pembayaran resmi merchant.`,evidenceOptions:[`Logo merchant pada stiker`,`Warna QR yang terlihat resmi`,`Konfirmasi langsung kepada kasir`,`Jumlah orang yang sudah memindai`],preferredEvidence:`Konfirmasi langsung kepada kasir`,actionOptions:[`Scan`,`Transfer`,`Download`,`Berikan OTP`],riskOptions:[`Pembayaran masuk ke pihak salah`,`Data rekening bocor`,`Perangkat terinfeksi`,`Saldo tertahan`],saferOptions:[`Konfirmasi QR kepada kasir`,`Periksa nama penerima`,`Gunakan mesin pembayaran resmi`,`Batalkan dan cek ulang`],aiNotices:[[`Pressure`,`Dorongan menyelesaikan antrean`],[`Habit`,`Scan tanpa memeriksa penerima`],[`Identity`,`Pemilik QR belum terkonfirmasi`],[`Requested action`,`Pembayaran melalui QR baru`]],aiLevel:`Medium`,aiScore:74,unknowns:[`Siapa pemilik rekening tujuan.`,`Apakah QR benar diganti merchant.`,`Kondisi stiker sebelum difoto.`,`Apakah deteksi visual melewatkan perubahan.`],verification:[`Tanyakan QR resmi kepada kasir.`,`Periksa nama penerima sebelum membayar.`,`Bandingkan dengan QR di kasir utama.`,`Simpan bukti transaksi.`]},"job-offer":{neutralOriginal:`POSISI TERBATAS! BAYAR DEPOSIT HARI INI!`,neutralVersion:`Pihak yang menawarkan pekerjaan meminta biaya administrasi.`,claim:`Pengirim mengaku mewakili perusahaan dan menjanjikan posisi kerja.`,evidenceOptions:[`Testimoni di pesan`,`Logo perusahaan`,`Kontak HR pada situs resmi perusahaan`,`Screenshot slip gaji`],preferredEvidence:`Kontak HR pada situs resmi perusahaan`,actionOptions:[`Transfer`,`Kirim data pribadi`,`Download`,`Klik`],riskOptions:[`Kehilangan uang`,`Identitas disalahgunakan`,`Perangkat terinfeksi`,`Akun diambil alih`],saferOptions:[`Hubungi HR melalui situs resmi`,`Cari lowongan di kanal perusahaan`,`Tolak biaya di muka`,`Periksa legalitas perusahaan`],aiNotices:[[`Pressure`,`Posisi disebut terbatas`],[`Emotion`,`Harapan mendapat pekerjaan`],[`Authority`,`Mengatasnamakan perusahaan`],[`Requested action`,`Deposit administrasi`]],aiLevel:`High`,aiScore:88,unknowns:[`Hubungan pengirim dengan perusahaan.`,`Apakah posisi tersebut benar tersedia.`,`Keaslian dokumen yang dilampirkan.`,`Kebijakan rekrutmen perusahaan.`],verification:[`Cari lowongan pada situs resmi.`,`Hubungi HR melalui kontak independen.`,`Periksa domain email pengirim.`,`Jangan membayar biaya rekrutmen di muka.`]},"bank-message":{neutralOriginal:`REKENING DIBLOKIR 30 MENIT LAGI. KLIK!`,neutralVersion:`Sebuah pesan meminta verifikasi rekening melalui tautan.`,claim:`Pengirim mengaku sebagai bank dan menyatakan rekening akan diblokir.`,evidenceOptions:[`Logo bank di pesan`,`Nomor pengirim terlihat rapi`,`Notifikasi di aplikasi bank resmi`,`Tautan yang dikirim`],preferredEvidence:`Notifikasi di aplikasi bank resmi`,actionOptions:[`Klik`,`Berikan OTP`,`Download`,`Kirim data pribadi`],riskOptions:[`Akun diambil alih`,`Kehilangan uang`,`Data pribadi bocor`,`Perangkat terinfeksi`],saferOptions:[`Buka aplikasi bank sendiri`,`Hubungi nomor di kartu`,`Ketik alamat resmi secara manual`,`Tunggu dan cek notifikasi resmi`],aiNotices:[[`Pressure`,`Ancaman blokir dalam 30 menit`],[`Authority`,`Mengatasnamakan bank`],[`Link`,`Domain tujuan perlu diperiksa`],[`Requested action`,`Verifikasi identitas`]],aiLevel:`High`,aiScore:91,unknowns:[`Status rekening sebenarnya.`,`Pemilik domain tujuan.`,`Apakah bank mengirim pemberitahuan lain.`,`Identitas operator pesan.`],verification:[`Buka aplikasi bank tanpa memakai tautan.`,`Hubungi nomor resmi pada kartu.`,`Periksa domain di situs resmi bank.`,`Jangan pernah membagikan OTP.`]},"viral-info":{neutralOriginal:`SEBARKAN SEBELUM DIHAPUS! MEREKA MENUTUPI FAKTA!`,neutralVersion:`Sebuah unggahan membuat klaim tanpa menyertakan sumber yang jelas.`,claim:`Unggahan mengklaim informasi penting sedang sengaja disembunyikan.`,evidenceOptions:[`Jumlah share`,`Komentar yang setuju`,`Sumber primer dan laporan independen`,`Akun yang pertama mengirim`],preferredEvidence:`Sumber primer dan laporan independen`,actionOptions:[`Share`,`Klik`,`Download`,`Kirim data pribadi`],riskOptions:[`Misinformasi menyebar`,`Reputasi pihak dirugikan`,`Konflik meningkat`,`Data pribadi bocor`],saferOptions:[`Cari sumber primer`,`Baca laporan dari beberapa sumber`,`Periksa tanggal dan konteks`,`Tunda membagikan`],aiNotices:[[`Pressure`,`Dorongan menyebarkan segera`],[`Emotion`,`Kemarahan dan rasa curiga`],[`Source`,`Sumber primer tidak terlihat`],[`Requested action`,`Membagikan ulang`]],aiLevel:`Medium`,aiScore:77,unknowns:[`Asal klaim pertama.`,`Konteks kejadian lengkap.`,`Apakah materi sudah dipotong.`,`Motif akun yang menyebarkan.`],verification:[`Cari sumber primer.`,`Bandingkan laporan independen.`,`Periksa tanggal, lokasi, dan konteks.`,`Jangan jadikan viralitas sebagai bukti.`]},"manipulated-media":{neutralOriginal:`VIDEO ASLI! INVESTASI INI HANYA HARI INI!`,neutralVersion:`Sebuah video tokoh publik mempromosikan peluang investasi.`,claim:`Video diklaim menampilkan tokoh publik yang mendukung sebuah investasi.`,evidenceOptions:[`Wajah terlihat realistis`,`Banyak komentar positif`,`Pernyataan pada kanal resmi tokoh`,`Kualitas video tinggi`],preferredEvidence:`Pernyataan pada kanal resmi tokoh`,actionOptions:[`Investasi / pembelian`,`Klik`,`Transfer`,`Share`],riskOptions:[`Kehilangan uang`,`Misinformasi menyebar`,`Identitas disalahgunakan`,`Akun diambil alih`],saferOptions:[`Periksa kanal resmi tokoh`,`Cari unggahan asli`,`Periksa izin lembaga terkait`,`Tunda keputusan investasi`],aiNotices:[[`Visual`,`Sinkronisasi wajah perlu ditinjau`],[`Audio`,`Pola suara tampak tidak konsisten`],[`Context`,`Sumber unggahan tidak jelas`],[`Requested action`,`Investasi segera`]],aiLevel:`High`,aiScore:84,unknowns:[`Siapa pembuat video.`,`Apakah cuplikan sudah disunting.`,`Konteks rekaman asli.`,`Legalitas produk investasi.`],verification:[`Cari video pada kanal resmi tokoh.`,`Gunakan pencarian balik frame.`,`Periksa izin produk investasi.`,`Jangan bertindak hanya dari kemiripan visual.`]},"audio-impersonation":{neutralOriginal:`NAK, INI MAMA. TOLONG TRANSFER SEKARANG, JANGAN TELEPON DULU!`,neutralVersion:`Seseorang dalam rekaman suara meminta kamu mentransfer uang.`,claim:`Pembicara mengaku sebagai anggota keluarga dan sedang mengalami keadaan darurat.`,evidenceOptions:[`Suara terdengar mirip`,`Nomor pengirim memakai foto keluarga`,`Telepon nomor keluarga yang tersimpan`,`Rekaman menyebut nama panggilan`],preferredEvidence:`Telepon nomor keluarga yang tersimpan`,actionOptions:[`Transfer`,`Kirim voice note balasan`,`Berikan OTP`,`Teruskan rekaman`],riskOptions:[`Kehilangan uang`,`Identitas suara disalahgunakan`,`Akun diambil alih`,`Kepanikan menyebar`],saferOptions:[`Telepon nomor tersimpan`,`Ajukan pertanyaan rahasia keluarga`,`Konfirmasi ke anggota keluarga lain`,`Tunda transfer`],aiNotices:[[`Voice pattern`,`Pola prosodi tidak konsisten`],[`Urgency`,`Transfer diminta segera`],[`Identity`,`Kemiripan suara bukan bukti identitas`],[`Audio trace`,`Jejak kompresi terdeteksi`]],aiLevel:`High`,aiScore:81,unknowns:[`Identitas asli pembicara.`,`Apakah suara sintetis atau rekaman asli yang terkompresi.`,`Konteks sebelum dan sesudah potongan audio.`,`Apakah pola suara kebetulan mirip data referensi.`],verification:[`Telepon nomor keluarga yang sudah tersimpan.`,`Gunakan pertanyaan yang hanya diketahui keluarga.`,`Konfirmasi kepada anggota keluarga lain.`,`Jangan transfer berdasarkan kemiripan suara.`]},"ai-can-be-wrong":{neutralOriginal:`PEMBERITAHUAN RESMI: JADWAL LAYANAN BERUBAH.`,neutralVersion:`Sebuah layanan menginformasikan perubahan jadwal.`,claim:`Pemberitahuan menyatakan jadwal layanan resmi telah berubah.`,evidenceOptions:[`AI menandainya mencurigakan`,`Tampilan pesannya formal`,`Pembaruan yang sama di aplikasi resmi`,`Pendapat di media sosial`],preferredEvidence:`Pembaruan yang sama di aplikasi resmi`,actionOptions:[`Buka aplikasi resmi`,`Share`,`Klik`,`Download`],riskOptions:[`Salah memahami jadwal`,`Membagikan informasi usang`,`Mengabaikan pengumuman sah`,`Tidak ada risiko besar`],saferOptions:[`Cocokkan dengan aplikasi resmi`,`Hubungi layanan resmi`,`Periksa waktu publikasi`,`Gunakan kanal resmi lain`],aiNotices:[[`Language`,`Bahasa formal terdeteksi`],[`Pattern`,`Format mirip pesan massal`],[`Identity`,`Pengirim tampak resmi`],[`Requested action`,`Buka aplikasi resmi`]],aiLevel:`Medium`,aiScore:68,unknowns:[`AI tidak mengakses akun layananmu.`,`Model belum melihat bukti di aplikasi resmi.`,`Format resmi dapat menyerupai pesan palsu.`,`Sinyal model dapat menjadi false positive.`],verification:[`Cocokkan isi di aplikasi resmi.`,`Periksa pengirim pada kanal resmi.`,`Prioritaskan bukti yang dapat diverifikasi.`,`Tidak perlu mengikuti AI jika bukti lebih kuat.`]}},pe={"family-emergency":{mode:`message`,title:`Pesan darurat keluarga`,subtitle:`Simulasi analisis teks WhatsApp`,summary:`Model menemukan tekanan aksi cepat, identitas belum terverifikasi, dan permintaan transfer yang sulit dibatalkan.`,confidenceLabel:`Manipulation likelihood`,highlights:[{label:`Urgency`,detail:`'sekarang' dan 'tolong cepat' mempersempit ruang berpikir.`,x:12,y:20,w:44,h:18},{label:`Identity gap`,detail:`Nomor baru mengaku keluarga tanpa bukti independen.`,x:36,y:44,w:48,h:18},{label:`Risky action`,detail:`Permintaan transfer muncul sebelum identitas dikonfirmasi.`,x:18,y:69,w:58,h:16}],clues:[`Tekanan waktu tinggi`,`Identitas pengirim belum dikonfirmasi`,`Aksi finansial diminta di awal`,`Kanal verifikasi independen tersedia`],reflectiveQuestions:[`Apakah kamu sudah menelepon nomor keluarga yang tersimpan?`,`Apa risiko jika transfer dilakukan sebelum konfirmasi?`,`Siapa sumber lain yang bisa mengonfirmasi keadaan darurat ini?`]},"qr-payment":{mode:`qr`,title:`QR pembayaran mencurigakan`,subtitle:`Simulasi analisis QR/link`,summary:`Model menandai kemungkinan QR pengganti, tetapi penerima pembayaran tetap harus diverifikasi langsung kepada merchant.`,confidenceLabel:`QR risk signal`,highlights:[{label:`Overlay`,detail:`Area stiker tampak seperti lapisan baru di atas permukaan lama.`,x:21,y:24,w:56,h:44},{label:`Recipient unknown`,detail:`Pemilik rekening tujuan belum terlihat sebelum pembayaran.`,x:18,y:73,w:64,h:14}],clues:[`QR baru menggantikan kanal lama`,`Penerima dana belum terlihat`,`Konteks kasir perlu dicek langsung`,`Pembayaran adalah aksi sulit dibatalkan`],reflectiveQuestions:[`Apakah nama penerima cocok dengan merchant?`,`Apakah kasir mengonfirmasi QR ini secara langsung?`,`Apakah ada kanal pembayaran resmi lain?`]},"job-offer":{mode:`message`,title:`Tawaran kerja berbiaya di muka`,subtitle:`Simulasi analisis teks rekrutmen`,summary:`Model menemukan kombinasi scarcity, otoritas palsu, dan permintaan deposit yang umum pada penipuan lowongan.`,confidenceLabel:`Scam pattern likelihood`,highlights:[{label:`Scarcity`,detail:`'posisi terbatas' mendorong keputusan cepat.`,x:14,y:19,w:48,h:18},{label:`Authority`,detail:`Mengatasnamakan perusahaan tanpa kanal resmi.`,x:26,y:43,w:54,h:18},{label:`Upfront fee`,detail:`Biaya administrasi diminta sebelum verifikasi HR.`,x:18,y:69,w:62,h:16}],clues:[`Ada biaya rekrutmen di muka`,`Klaim perusahaan belum diverifikasi`,`Tekanan waktu tinggi`,`Kontak HR resmi tersedia sebagai pembanding`],reflectiveQuestions:[`Apakah perusahaan resmi meminta deposit?`,`Apakah domain email pengirim cocok dengan perusahaan?`,`Bisakah posisi ini ditemukan di kanal karier resmi?`]},"bank-message":{mode:`link`,title:`Pesan bank dan tautan verifikasi`,subtitle:`Simulasi analisis teks + link`,summary:`Model menandai ancaman pemblokiran, otoritas bank, dan tautan verifikasi sebagai pola phishing berisiko tinggi.`,confidenceLabel:`Phishing likelihood`,highlights:[{label:`Threat`,detail:`Ancaman blokir 30 menit menciptakan rasa takut.`,x:12,y:18,w:55,h:18},{label:`External link`,detail:`Tautan mengarahkan keluar dari kanal resmi yang diketik sendiri.`,x:24,y:50,w:58,h:18},{label:`Credential risk`,detail:`Verifikasi identitas dapat berujung data pribadi/OTP.`,x:18,y:72,w:64,h:14}],clues:[`Menggunakan ancaman pemblokiran`,`Mengarahkan ke tautan`,`Mengatasnamakan institusi finansial`,`OTP dan kredensial tidak boleh dibagikan`],reflectiveQuestions:[`Apakah notifikasi yang sama ada di aplikasi bank resmi?`,`Apakah kamu mengetik alamat resmi sendiri, bukan dari link?`,`Apakah pesan meminta OTP atau data sensitif?`]},"viral-info":{mode:`message`,title:`Klaim viral tanpa sumber primer`,subtitle:`Simulasi analisis headline sosial`,summary:`Model menemukan ajakan menyebarkan segera, framing konspiratif, dan ketiadaan sumber primer.`,confidenceLabel:`Disinformation signal`,highlights:[{label:`Share pressure`,detail:`Ajakan menyebarkan muncul sebelum bukti diberikan.`,x:13,y:20,w:56,h:18},{label:`Conspiracy frame`,detail:`'mereka menutupi fakta' memancing curiga dan marah.`,x:22,y:45,w:58,h:18},{label:`No source`,detail:`Tidak ada sumber primer yang bisa diverifikasi.`,x:24,y:70,w:50,h:15}],clues:[`Viralitas dipakai sebagai tekanan sosial`,`Sumber primer tidak terlihat`,`Bahasa emosional kuat`,`Perlu cek tanggal dan konteks`],reflectiveQuestions:[`Sumber primer klaim ini apa?`,`Apakah ada laporan independen yang menyebut hal sama?`,`Apa dampaknya jika kamu share dan ternyata keliru?`]},"manipulated-media":{mode:`media`,title:`Video tokoh publik / media manipulatif`,subtitle:`Simulasi analisis visual + audio`,summary:`Model menandai area wajah, sinkronisasi audio, dan konteks unggahan sebagai sinyal yang perlu diverifikasi.`,confidenceLabel:`Synthetic media likelihood`,highlights:[{label:`Face sync`,detail:`Gerak mulut dan ekspresi tampak tidak sepenuhnya selaras.`,x:34,y:18,w:30,h:34},{label:`Hand / edge`,detail:`Tepi objek dan tangan tampak terlalu halus atau berubah bentuk.`,x:14,y:56,w:25,h:22},{label:`Call to invest`,detail:`Ajakan investasi segera muncul tanpa kanal resmi.`,x:47,y:67,w:38,h:16}],clues:[`Sinkronisasi wajah perlu diperiksa`,`Pola audio tampak tidak konsisten`,`Sumber unggahan tidak jelas`,`Ada ajakan finansial cepat`],reflectiveQuestions:[`Apakah video ini ada di kanal resmi tokoh?`,`Apakah ada versi asli dengan konteks lengkap?`,`Apakah produk investasi punya izin resmi?`]},"audio-impersonation":{mode:`audio`,title:`Rekaman suara impersonasi`,subtitle:`Simulasi pencocokan pola audio + transkrip`,summary:`Model simulasi menemukan tekanan transfer, perubahan prosodi, dan jejak kompresi. Kemiripan pola suara tidak membuktikan identitas pembicara.`,confidenceLabel:`Voice manipulation signal`,dataset:{name:`Voice Scam Pattern Set`,size:`18.420 sampel`,matches:`37 cluster serupa`},highlights:[{label:`Prosody shift`,detail:`Intonasi berubah tajam pada bagian permintaan transfer.`,start:`00:04`,end:`00:07`},{label:`Compression trace`,detail:`Ada pola kompresi berulang yang dapat berasal dari edit atau aplikasi pesan.`,start:`00:08`,end:`00:11`},{label:`Urgent instruction`,detail:`Frasa 'sekarang' dan 'jangan telepon' membatasi verifikasi.`,start:`00:12`,end:`00:16`}],clues:[`Kemiripan suara bukan bukti identitas`,`Ada larangan melakukan verifikasi`,`Aksi finansial diminta segera`,`Konteks rekaman tidak lengkap`],reflectiveQuestions:[`Sudahkah kamu menelepon nomor keluarga yang tersimpan?`,`Adakah pertanyaan yang hanya keluarga asli dapat jawab?`,`Apa risiko jika model salah membaca audio terkompresi?`]},"ai-can-be-wrong":{mode:`official`,title:`Kemungkinan false positive AI`,subtitle:`Simulasi analisis dengan bukti resmi lebih kuat`,summary:`Model menemukan format massal yang tampak mencurigakan, tetapi bukti pada aplikasi resmi dapat membantah sinyal AI.`,confidenceLabel:`Suspicious signal`,highlights:[{label:`Formal template`,detail:`Format pengumuman massal kadang mirip pesan palsu.`,x:14,y:22,w:54,h:18},{label:`Official channel needed`,detail:`Keputusan harus mengikuti bukti di aplikasi/kanal resmi.`,x:20,y:54,w:60,h:18}],clues:[`Sinyal AI tidak sama dengan kebenaran`,`Bukti resmi bisa lebih kuat`,`Format formal dapat memicu false positive`,`Manusia tetap memegang keputusan akhir`],reflectiveQuestions:[`Apakah aplikasi resmi menampilkan pengumuman yang sama?`,`Bukti mana yang lebih dapat diverifikasi daripada skor AI?`,`Kapan kamu perlu tidak setuju dengan AI?`]}};function me(){return fe[N.scenarioId]||fe[`family-emergency`]}function he(){return pe[N.scenarioId]||pe[`family-emergency`]}function ge(){return N.trainingScenario?me():N.inputType===`image`?fe[`manipulated-media`]:N.inputType===`audio`?fe[`audio-impersonation`]:N.inputType===`qr`?fe[N.qrInputMode===`image`?`qr-payment`:`bank-message`]:me()}function _e(){return N.trainingScenario?he():N.inputType===`image`?pe[`manipulated-media`]:N.inputType===`audio`?pe[`audio-impersonation`]:N.inputType===`qr`?pe[N.qrInputMode===`image`?`qr-payment`:`bank-message`]:he()}function ve(e){try{return new URL(e).hostname}catch{return`domain-belum-terbaca`}}function ye(){return de.find(e=>e.id===N.scenarioId)||de[0]}var N={route:`verify`,inputType:`text`,content:ae,fileName:``,imageDataUrl:``,audioDataUrl:``,qrImageDataUrl:``,qrInputMode:`link`,xaiMode:`bounding`,audioXaiMode:`voice`,qrXaiMode:`risk`,inFlow:!1,directDetection:!1,stage:2,hadangStep:0,initialDecision:``,initialConfidence:68,pressure:[],emotion:[],neutralImpact:``,evidence:``,requestedAction:``,consequence:``,saferAction:``,finalDecision:``,finalConfidence:72,reflection:[],priority:``,result:!1,questionOpen:!0,gameScore:0,gameLives:3,gameCombo:1,gameCatches:0,gameRoundComplete:!1,gameOver:!1,guardY:54,scenarioId:`family-emergency`,aiWrong:!1,trainingScenario:!1,casePrompt:``},be=document.querySelector(`#app`),xe=document.querySelector(`#toast`),Se,Ce=`hadangin-language`,P=new WeakMap,we=new WeakMap,Te=!1,Ee=new Map([[`Lewati ke konten`,`Skip to content`],[`Verifikasi`,`Verify`],[`Latihan Hadang`,`Hadang Training`],[`Komunitas`,`Community`],[`Cara Kerja`,`How It Works`],[`Tentang`,`About`],[`Mulai Verifikasi`,`Start Verification`],[`Hadang Sebelum Terjebak`,`Block It Before You Get Trapped`],[`Mulai Pemeriksaan`,`Start Checking`],[`Coba Latihan`,`Try Training`],[`Gulir untuk memahami alur`,`Scroll to understand the flow`],[`Sebelum mulai`,`Before you begin`],[`Periksa Informasi Mencurigakan`,`Check Suspicious Information`],[`Pilih jenis konten`,`Choose content type`],[`Pilih cara pemeriksaan`,`Choose a checking method`],[`Pemrosesan lokal`,`Local processing`],[`Deteksi AI`,`AI Detection`],[`Prediksi + XAI langsung`,`Instant prediction + XAI`],[`Bentuk penilaian awal`,`Form an initial judgment`],[`Question & check`,`Question & Check`],[`Bandingkan, lalu putuskan`,`Compare, then decide`],[`Tempel Tautan`,`Paste Link`],[`Upload QR`,`Upload QR`],[`QR siap diperiksa`,`QR ready to check`],[`Ganti QR`,`Replace QR`],[`Upload gambar QR`,`Upload QR image`],[`Pilih Gambar QR`,`Choose QR Image`],[`Alamat tujuan yang ingin diperiksa`,`Destination address to check`],[`Pratinjau aman: tanpa membuka situs tujuan`,`Safe preview: destination site is not opened`],[`Rekaman siap diperiksa`,`Recording ready to check`],[`Ganti Audio`,`Replace Audio`],[`Gambar siap diperiksa`,`Image ready to check`],[`Ganti Gambar`,`Replace Image`],[`Pilih File`,`Choose File`],[`Human First`,`Human First`],[`AI Second`,`AI Second`],[`Human Final`,`Human Final`],[`Sebelum AI Membantu`,`Before AI Helps`],[`Apa respons pertamamu jika ini terjadi di dunia nyata?`,`What would your first response be if this happened in real life?`],[`Seberapa yakin kamu dengan keputusan itu?`,`How confident are you in that decision?`],[`Kembali`,`Back`],[`Kunci Penilaian Awal`,`Lock Initial Judgment`],[`Gambar yang diperiksa`,`Image Being Checked`],[`Rekaman yang diperiksa`,`Recording Being Checked`],[`Transkrip simulasi`,`Simulated transcript`],[`QR yang diperiksa`,`QR Being Checked`],[`Tautan yang diperiksa`,`Link Being Checked`],[`Informasi yang diperiksa`,`Information Being Checked`],[`Bagikan`,`Share`],[`belum yakin`,`not confident yet`],[`STATUS ARENA`,`ARENA STATUS`],[`SKOR`,`SCORE`],[`NYAWA`,`LIVES`],[`POS PENJAGA`,`GUARD POST`],[`Buka Pertanyaan`,`Open Question`],[`MISI HADANGIN`,`HADANGIN MISSION`],[`Mulai Permainan`,`Start Game`],[`Jangan biarkan lolos`,`Do not let it pass`],[`MISI GAGAL`,`MISSION FAILED`],[`Ulangi Ronde`,`Retry Round`],[`Garis 01 - Jeda`,`Line 01 - Pause`],[`Garis 02 - Emosi`,`Line 02 - Emotion`],[`Garis 03 - Data`,`Line 03 - Data`],[`Garis 04 - Aksi`,`Line 04 - Action`],[`Berhenti sejenak dari dorongan bertindak`,`Pause the urge to act`],[`Kenali emosi yang sedang dipancing`,`Recognize the emotion being triggered`],[`Pisahkan klaim dari buktinya`,`Separate claims from evidence`],[`Lihat tindakan dan konsekuensinya`,`Consider the action and its consequences`],[`Tanpa tekanan emosi`,`Without emotional pressure`],[`Klaim`,`Claim`],[`Bukti independen`,`Independent evidence`],[`Pertanyaan reflektif`,`Reflective questions`],[`Visual Penjelasan XAI`,`XAI Explanation Visual`],[`Penjelasan Pola Audio`,`Audio Pattern Explanation`],[`Penjelasan Risiko Tujuan`,`Destination Risk Explanation`],[`Input pengguna`,`User input`],[`Form kredensial`,`Credential form`],[`Tujuan terbaca / simulasi`,`Detected destination / simulation`],[`Host terbaca`,`Detected host`],[`Pola terdeteksi`,`Detected pattern`],[`Status`,`Status`],[`Perlu verifikasi`,`Needs verification`],[`Ganti Konten`,`Change Content`],[`Hasil prediksi langsung`,`Instant prediction result`],[`Keputusan akhir`,`Final decision`],[`Keputusan final`,`Final decision`],[`Lanjut Latihan`,`Continue Training`],[`Periksa Lagi`,`Check Again`],[`Tentang Inisiatif`,`About the Initiative`],[`Untuk siapa`,`Who It Is For`],[`Pilih Skenario`,`Choose a Scenario`],[`Mulai Latihan`,`Start Training`],[`Pilih penjaga di arena`,`Choose a guard in the arena`],[`Mode permainan`,`Game mode`],[`Arena Offline`,`Offline Arena`],[`Arena Kamera AI`,`AI Camera Arena`],[`Perkiraan peserta`,`Estimated participants`],[`orang`,`people`],[`Mode utama`,`Main mode`],[`Persiapan`,`Preparation`],[`Mulai Sesi`,`Start Session`],[`Unduh Panduan`,`Download Guide`],[`Tim`,`Team`],[`Babak`,`Round`],[`Pertanyaan`,`Question`],[`Jawaban`,`Answer`],[`Benar`,`Correct`],[`Salah`,`Incorrect`],[`Selanjutnya`,`Next`],[`Selesai`,`Finish`],[`Jeda`,`Pause`],[`Emosi`,`Emotion`],[`Data`,`Evidence`],[`Aksi`,`Action`],[`Darurat`,`Emergency`],[`Ancaman`,`Threat`],[`Hadiah`,`Reward`],[`Kesempatan terbatas`,`Limited opportunity`],[`Tekanan sosial`,`Social pressure`],[`Tidak ada tekanan`,`No pressure`],[`Takut`,`Fear`],[`Panik`,`Panic`],[`Kasihan`,`Sympathy`],[`Percaya`,`Trust`],[`Marah`,`Anger`],[`Harapan`,`Hope`],[`Penasaran`,`Curiosity`],[`Kedekatan emosional`,`Emotional attachment`],[`Tidak yakin`,`Unsure`],[`Ya`,`Yes`],[`Sedikit`,`Slightly`],[`Tidak`,`No`],[`Belum dipilih`,`Not selected yet`],[`Transfer`,`Transfer`],[`Klik`,`Click`],[`Berikan OTP`,`Provide OTP`],[`Share`,`Share`],[`Scan`,`Scan`],[`Download`,`Download`],[`Kirim data pribadi`,`Send personal data`],[`Investasi / pembelian`,`Investment / purchase`],[`Kirim voice note balasan`,`Send a voice-note reply`],[`Teruskan rekaman`,`Forward the recording`],[`Kehilangan uang`,`Losing money`],[`Akun diambil alih`,`Account takeover`],[`Data pribadi bocor`,`Personal data leak`],[`Misinformasi menyebar`,`Misinformation spreading`],[`Pembayaran masuk ke pihak salah`,`Payment sent to the wrong party`],[`Perangkat terinfeksi`,`Device infection`],[`Saldo tertahan`,`Funds being held`],[`Identitas disalahgunakan`,`Identity misuse`],[`Reputasi pihak dirugikan`,`Damage to someone's reputation`],[`Konflik meningkat`,`Escalating conflict`],[`Mengabaikan pengumuman sah`,`Ignoring a legitimate announcement`],[`Tidak ada risiko besar`,`No major risk`],[`Kepanikan menyebar`,`Panic spreading`],[`Telepon nomor tersimpan`,`Call the saved number`],[`Buka aplikasi resmi sendiri`,`Open the official app yourself`],[`Cari sumber independen`,`Find an independent source`],[`Tunggu dan cek ulang`,`Wait and check again`],[`Konfirmasi QR kepada kasir`,`Confirm the QR with the cashier`],[`Batalkan dan cek ulang`,`Cancel and check again`],[`Tolak biaya di muka`,`Refuse upfront fees`],[`Tunda membagikan`,`Delay sharing`],[`Tunda transfer`,`Delay the transfer`],[`Hadang Garis 1`,`Block Line 1`],[`Hadang Garis 2`,`Block Line 2`],[`Hadang Garis 3`,`Block Line 3`],[`Hadang Sebelum Bertindak`,`Block Before Acting`],[`Bayangkan ada pesan yang membuatmu ingin langsung bertindak.`,`Imagine receiving a message that makes you want to act immediately.`],[`Metode J.E.D.A. menerjemahkan prinsip MIL menjadi pengalaman interaktif berbasis budaya hadang/gobak sodor.`,`The J.E.D.A. method turns MIL principles into an interactive experience inspired by the Indonesian game hadang/gobak sodor.`],[`Tujuannya bukan sekadar menemukan “hoaks” atau “bukan hoaks”, tetapi membangun kebiasaan berpikir: berhenti dulu, periksa konteks, gunakan AI sebagai lensa, lalu ambil keputusan sendiri.`,`The goal is not simply to label something as a hoax or not, but to build a thinking habit: pause, check the context, use AI as a lens, and make your own decision.`],[`Masukkan konten yang ingin kamu evaluasi. Pilih Deteksi AI untuk hasil langsung, atau AI Plus untuk alur Human First dan latihan J.E.D.A.`,`Enter the content you want to evaluate. Choose AI Detection for an instant result, or AI Plus for the Human First flow and J.E.D.A. training.`],[`Konten hanya diproses di perangkat ini untuk kebutuhan simulasi dan tidak dikirim ke server.`,`Content is processed only on this device for the simulation and is not sent to a server.`],[`Keduanya menggunakan Explainable AI. AI Plus menambahkan latihan penalaran dan permainan J.E.D.A.`,`Both use Explainable AI. AI Plus also includes reasoning exercises and the J.E.D.A. game.`],[`Respons dan keyakinanmu dicatat sebelum sinyal AI ditampilkan.`,`Your response and confidence are recorded before AI signals are shown.`],[`Metode lokal untuk mengenali tekanan, emosi, data, dan risiko aksi.`,`A localized method for recognizing pressure, emotion, evidence, and action risks.`],[`AI memberi second opinion. Keputusan final tetap berada padamu.`,`AI provides a second opinion. The final decision remains yours.`],[`Kami ingin tahu bagaimana kamu membaca situasi ini terlebih dahulu.`,`We want to understand how you interpret this situation first.`],[`AI belum akan ditampilkan sampai kamu menyelesaikan tahap berpikir awal.`,`AI will not be shown until you complete the initial thinking stage.`],[`Jangan biarkan informasi lolos menuju tindakan.`,`Do not let information pass straight into action.`],[`Gerakkan penjaga aktif di garisnya, tangkap token informasi, lalu jawab pertanyaan J.E.D.A. Jangan biarkan tiga token lolos menuju tindakan.`,`Move the active guard along the line, catch information tokens, then answer the J.E.D.A. question. Do not let three tokens reach the action zone.`],[`Tekanan waktu dapat mengurangi ruang untuk mengevaluasi informasi.`,`Time pressure can reduce your ability to evaluate information.`],[`Emosi bukan kesalahan. Mengenalinya membantu kamu menjaga jarak dari tekanan.`,`Emotions are not a mistake. Recognizing them helps you step back from pressure.`],[`Bukti yang baik tidak hanya berasal dari pihak yang membuat klaim.`,`Good evidence does not come only from the party making the claim.`],[`Pesan manipulatif sering dibuat untuk mempercepat aksi yang sulit dibatalkan.`,`Manipulative messages often push people toward actions that are difficult to reverse.`],[`Highlight menunjukkan area yang memengaruhi hasil analisis dan bukan merupakan bukti final.`,`Highlights show areas that influence the analysis and are not final evidence.`],[`Statistik dibuat untuk demonstrasi UI dan bukan hasil model produksi.`,`These statistics are for UI demonstration and are not produced by a production model.`],[`Hasil ini melewati latihan Human First dan game. Gunakan penjelasan XAI untuk menentukan apa yang masih perlu diverifikasi.`,`This result skips the Human First exercise and game. Use the XAI explanation to decide what still needs verification.`],[`AI adalah Lensa, Bukan Hakim.`,`AI Is a Lens, Not a Judge.`],[`Keputusan akhir tetap milik manusia.`,`The final decision always belongs to people.`],[`Latih Nalar Sebelum Situasi Nyata Datang.`,`Train Your Judgment Before a Real Situation Arises.`],[`Literasi yang dekat dengan kehidupan digital sehari-hari`,`Literacy Grounded in Everyday Digital Life`],[`AI Context Guard Web yang Dilokalkan Menjadi HADANGIN`,`AI Context Guard Web Localized as HADANGIN`],[`HADANGIN adalah prototipe lokal dari konsep AI Context Guard Web untuk Indonesia: web ringan yang membantu masyarakat berhenti, berpikir, memverifikasi, dan mengambil keputusan dengan lebih sadar.`,`HADANGIN is an Indonesian prototype of the AI Context Guard Web concept: a lightweight website that helps people pause, think, verify, and make more informed decisions.`],[`Identitas HADANGIN`,`HADANGIN Identity`],[`Hadang Informasi. Jaga Keputusan.`,`Block Information. Protect Decisions.`],[`HADANGIN membantu masyarakat membangun refleks untuk berhenti, membaca konteks, memeriksa bukti, dan memilih tindakan yang lebih aman di tengah arus informasi digital.`,`HADANGIN helps people build the reflex to pause, read the context, check evidence, and choose safer actions amid the flow of digital information.`],[`Makna nama`,`The Meaning Behind the Name`],[`HADANGIN adalah ajakan untuk berhenti sebelum bertindak.`,`HADANGIN Is a Call to Pause Before Acting.`],[`Nama HADANGIN berasal dari kata hadang: menahan sesuatu agar tidak langsung melewati batas. Akhiran percakapan -in membuatnya terdengar dekat, aktif, dan mudah diingat sebagai ajakan sehari-hari.`,`The name HADANGIN comes from hadang: stopping something before it crosses a boundary. The conversational ending -in makes it feel approachable, active, and memorable as an everyday call to action.`],[`Akar budaya Indonesia`,`Indonesian Cultural Foundation`],[`HADANGIN terinspirasi oleh Gobak Sodor, permainan tradisional Indonesia tentang menghadang pergerakan melintasi batas. Prinsip itu kami terjemahkan menjadi intervensi perilaku digital: menghentikan reaksi impulsif sebelum manipulasi berubah menjadi tindakan.`,`HADANGIN is inspired by Gobak Sodor, an Indonesian traditional game about blocking movement across boundaries. We translate that into a behavioral digital intervention: stopping impulsive reactions before manipulation becomes action.`],[`Gerak`,`Movement`],[`Batas`,`Boundary`],[`Hadang`,`Block`],[`Perilaku digital`,`Digital Behavior`],[`Informasi`,`Information`],[`Tindakan aman`,`Safe Action`],[`perlindungan yang menjadi tindakan`,`protection put into action`],[`Menahan laju informasi manipulatif sebelum menjadi tindakan impulsif.`,`Stopping manipulative information before it turns into impulsive action.`],[`Membawa semangat permainan hadang atau gobak sodor ke dalam latihan literasi digital.`,`Bringing the spirit of hadang or gobak sodor into digital literacy training.`],[`Mengajak pengguna terlibat aktif, bukan sekadar menerima penilaian AI.`,`Inviting users to participate actively instead of merely accepting an AI judgment.`],[`Sistem identitas`,`Identity System`],[`Simbol utama`,`Primary Mark`],[`Logo horizontal`,`Horizontal Logo`],[`Simbol perisai H HADANGIN`,`HADANGIN H-shaped shield symbol`],[`Logo horizontal HADANGIN`,`HADANGIN horizontal logo`],[`Perisai berbentuk H mewakili perlindungan, batas, dan ruang aman untuk berpikir. Huruf H adalah abstraksi visual dari garis batas dan garis penghubung lapangan Gobak Sodor, bukan salinan bentuk lapangannya.`,`The H-shaped shield represents protection, boundaries, and a safe space to think. The letter H is a visual abstraction of the boundary and connecting lines in a Gobak Sodor court, not a literal copy of the court.`],[`Wordmark memadukan simbol penjaga dengan nama yang tegas dan mudah dikenali.`,`The wordmark combines the guard symbol with a clear and recognizable name.`],[`Bahasa visual`,`Visual Language`],[`Garis permainan menjadi sistem identitas.`,`The Lines of Play Become an Identity System.`],[`Elemen budaya diterjemahkan secara konsisten ke dalam bentuk, huruf, dan warna.`,`One cultural idea, translated consistently through shape, type, and color.`],[`Akar budaya`,`Cultural Foundation`],[`Dari garis lapangan ke simbol H`,`From Court Lines to the H Symbol`],[`Lapangan Gobak Sodor umumnya berbentuk persegi panjang yang dibagi menjadi enam petak, dengan garis horizontal yang dijaga dan satu garis vertikal tengah untuk penjaga sodor. Identitas HADANGIN tidak menyalin bentuk lapangan secara harfiah. Garis batas dan penghubungnya diabstraksikan menjadi huruf H: simbol untuk menghadang, memberi jeda, lalu menilai sebelum melintas.`,`A Gobak Sodor court is typically a rectangle divided into six cells, with guarded horizontal lines and one central vertical line for the sodor guard. HADANGIN does not copy the court literally. Its boundary and connecting lines are abstracted into the letter H: a symbol for blocking, pausing, and assessing before crossing.`],[`Dua tim memainkan Gobak Sodor pada lapangan enam petak dengan garis horizontal dan garis vertikal tengah`,`Two teams playing Gobak Sodor on a six-cell court with horizontal lines and one central vertical line`],[`Tim biru · Pembawa informasi`,`Blue Team · Information Carriers`],[`Hoaks, scam, QR, audio, dan gambar manipulatif`,`Hoaxes, scams, QR codes, audio, and manipulated images`],[`Tim hijau · Penjaga literasi`,`Green Team · Literacy Guards`],[`Jeda, bertanya, periksa bukti, dan putuskan dengan aman`,`Pause, question, check evidence, and decide safely`],[`Tipografi`,`Typography`],[`Antarmuka digital`,`Digital Interface`],[`Tipografi utama untuk judul, navigasi, dan teks antarmuka. Geometris, tegas, dan tetap mudah dibaca pada layar kecil.`,`The primary typeface for headings, navigation, and interface text. Geometric, confident, and highly readable on small screens.`],[`Palet warna`,`Color Palette`],[`Navy Penjaga`,`Guard Navy`],[`stabilitas & kepercayaan`,`stability & trust`],[`Biru Aksi`,`Action Blue`],[`kejelasan & aksi`,`clarity & action`],[`Teal Jeda`,`Pause Teal`],[`keseimbangan & rasa aman`,`balance & safety`],[`Terakota Manusia`,`Human Terracotta`],[`energi & kedekatan manusia`,`energy & human warmth`],[`Putih Kanvas`,`Canvas White`],[`keterbukaan & ruang bernapas`,`openness & breathing room`],[`Teori warna lintas budaya`,`Cross-cultural Color Theory`],[`Dalam desain digital global, navy dan biru sering dikaitkan dengan kepercayaan dan kejelasan; teal dengan keseimbangan dan rasa aman; terakota dengan energi serta kedekatan manusia; putih dengan keterbukaan.`,`In global digital design, navy and blue are often associated with trust and clarity; teal with balance and safety; terracotta with energy and human warmth; and white with openness.`],[`Makna warna dapat berbeda antarbudaya. Karena itu HADANGIN selalu memasangkan warna dengan label, ikon, dan kontras yang jelas.`,`Color meanings can vary across cultures. HADANGIN therefore always pairs color with clear labels, icons, and contrast.`],[`Warna + label + ikon`,`Color + label + icon`],[`Dua mode, satu metode`,`Two Modes, One Method`],[`Berlatih sendiri atau bergerak bersama.`,`Practice Independently or Move Together.`],[`Pilihan mode mengubah cara bermain, bukan prinsipnya. Keduanya melatih kebiasaan berhenti, memeriksa bukti, menggunakan AI sebagai lensa, lalu mengambil keputusan sendiri.`,`The mode changes how people play, not the principle. Both build the habit of pausing, checking evidence, using AI as a lens, and making the final decision yourself.`],[`Mode individu · 1 pemain`,`Individual Mode · 1 Player`],[`Periksa dan latih keputusanmu sendiri.`,`Check Information and Practice Your Own Decisions.`],[`Gunakan ponsel atau laptop untuk memeriksa konten nyata maupun skenario latihan secara mandiri.`,`Use a phone or laptop to check real content or work through a practice scenario independently.`],[`Yang kamu lakukan`,`What You Do`],[`Unggah konten`,`Add Content`],[`Nilai sendiri`,`Judge First`],[`Main J.E.D.A.`,`Play J.E.D.A.`],[`Bandingkan AI`,`Compare AI`],[`Refleksi`,`Reflect`],[`Format`,`Format`],[`Deteksi AI cepat atau AI Plus dengan permainan J.E.D.A.`,`Quick AI Detection or AI Plus with the J.E.D.A. game.`],[`Cocok untuk`,`Best For`],[`Keputusan sehari-hari, belajar mandiri, dan latihan singkat.`,`Everyday decisions, independent learning, and short practice sessions.`],[`Mulai mode individu`,`Start Individual Mode`],[`Mode komunitas · 4–120 peserta`,`Community Mode · 4–120 Participants`],[`Hadang informasi sebagai permainan tim.`,`Block Information Through Team Play.`],[`Fasilitator membagi peserta menjadi tim pembawa informasi dan tim penjaga literasi. Satu tim mencoba meloloskan skenario; tim lain menghadangnya dengan pertanyaan, bukti, dan tindakan aman.`,`A facilitator divides participants into information carriers and literacy guards. One team tries to move a scenario through the arena; the other blocks it with questions, evidence, and safer actions.`],[`Yang kelompok lakukan`,`What the Group Does`],[`Buat ruang`,`Create Room`],[`Bagi tim`,`Form Teams`],[`Mainkan arena`,`Play the Arena`],[`Voting`,`Vote`],[`Debrief`,`Debrief`],[`Offline, hybrid, atau Arena Kamera berbasis computer vision.`,`Offline, hybrid, or the computer-vision Camera Arena.`],[`Keluarga, sekolah, organisasi pemuda, dan komunitas.`,`Families, schools, youth organizations, and communities.`],[`Siapkan mode komunitas`,`Set Up Community Mode`],[`Metode yang sama pada kedua mode`,`The Same Method in Both Modes`],[`Yang berubah hanya skala dan cara interaksi; keputusan tetap berada pada manusia.`,`Only the scale and interaction change; the final decision always remains with people.`],[`Arah gerak`,`Our Direction`],[`Visi`,`Vision`],[`Mewujudkan masyarakat digital yang tangguh, kritis, dan tetap memegang kendali atas keputusannya di tengah perkembangan AI dan manipulasi informasi.`,`To foster a resilient and critical digital society that remains in control of its decisions amid advances in AI and information manipulation.`],[`Misi`,`Mission`],[`Bangun kebiasaan jeda`,`Build the Habit of Pausing`],[`Menjadikan berhenti sejenak sebagai respons pertama sebelum klik, transfer, scan, atau membagikan.`,`Make a brief pause the first response before clicking, transferring, scanning, or sharing.`],[`Jelaskan, jangan menghakimi`,`Explain, Do Not Judge`],[`Menyajikan sinyal AI dan XAI dengan bahasa yang mudah dipahami tanpa mengambil alih keputusan.`,`Present AI and XAI signals in accessible language without taking over the decision.`],[`Bawa literasi ke ruang bersama`,`Bring Literacy Into Shared Spaces`],[`Mengubah latihan berpikir kritis menjadi pengalaman bermain yang relevan bagi keluarga, sekolah, dan komunitas.`,`Turn critical-thinking practice into a playful experience relevant to families, schools, and communities.`],[`Jaga pilihan manusia dan privasi`,`Protect Human Choice and Privacy`],[`Memprioritaskan perlindungan data, aksesibilitas, dan kendali manusia, termasuk kebebasan untuk mempertanyakan atau menolak rekomendasi AI.`,`Prioritize data protection, accessibility, and human control, including the freedom to question or reject AI recommendations.`],[`HADANGIN menyisipkan ruang berpikir.`,`HADANGIN creates space to think.`],[`Dalam bahasa Indonesia, jeda berarti berhenti atau mengambil jarak sejenak sebelum bereaksi. J.E.D.A. menerjemahkan Pause, Question, Check, Decide ke dalam logika budaya Gobak Sodor: menahan informasi di batas sebelum berubah menjadi tindakan berisiko.`,`Jeda is an Indonesian word for a pause: taking a brief step back before reacting. J.E.D.A. translates Pause, Question, Check, Decide into the cultural logic of Gobak Sodor, holding information at the boundary before it can become a risky action.`]]),F={dan:`and`,atau:`or`,untuk:`for`,dengan:`with`,tanpa:`without`,dari:`from`,ke:`to`,di:`in`,yang:`that`,ini:`this`,itu:`that`,adalah:`is`,akan:`will`,belum:`not yet`,tidak:`not`,bukan:`not`,kamu:`you`,pengguna:`user`,informasi:`information`,pesan:`message`,konten:`content`,hasil:`result`,model:`model`,bukti:`evidence`,keputusan:`decision`,tindakan:`action`,risiko:`risk`,sinyal:`signal`,konteks:`context`,sumber:`source`,periksa:`check`,pilih:`choose`,mulai:`start`,lanjut:`continue`,lihat:`view`,gunakan:`use`,masukkan:`enter`,tampilkan:`show`,buka:`open`,tutup:`close`,hapus:`remove`,ganti:`replace`,kembali:`back`,ulangi:`retry`,membantu:`helps`,mengenali:`recognize`,menentukan:`determine`,menampilkan:`display`,memengaruhi:`influence`,membagikan:`share`,memverifikasi:`verify`,diperiksa:`checked`,terdeteksi:`detected`,tersedia:`available`,sebelum:`before`,setelah:`after`,sekarang:`now`,langsung:`immediately`,terlebih:`first`,hanya:`only`,aman:`safe`,resmi:`official`,mencurigakan:`suspicious`,aktif:`active`,lokal:`local`,akhir:`final`,awal:`initial`,tinggi:`high`,rendah:`low`,baru:`new`,utama:`main`,sebenarnya:`actually`,sendiri:`yourself`,gambar:`image`,audio:`audio`,rekaman:`recording`,tautan:`link`,alamat:`address`,situs:`site`,file:`file`,tekanan:`pressure`,emosi:`emotion`,data:`data`,aksi:`action`,klaim:`claim`,pertanyaan:`question`,jawaban:`answer`,latihan:`training`,permainan:`game`,arena:`arena`,garis:`line`,penjaga:`guard`,ronde:`round`,skor:`score`,waktu:`time`,tujuan:`destination`,area:`area`,nama:`name`,penerima:`recipient`,contoh:`example`,simulasi:`simulation`,berhasil:`successfully`,gagal:`failed`,yakin:`confident`,pilihan:`choice`,langkah:`step`,kasus:`case`,metode:`method`,ada:`there is`,agar:`so`,akhirnya:`finally`,akun:`account`,alasan:`reason`,ambil:`take`,anggota:`member`,apakah:`whether`,apa:`what`,bagaimana:`how`,bagian:`part`,bagi:`for`,bahasa:`language`,bantuan:`help`,bantu:`help`,banyak:`many`,baru:`new`,berada:`remains`,berasal:`comes`,berbeda:`different`,berdiri:`stand`,bergerak:`move`,berhenti:`stop`,berikutnya:`next`,bermain:`play`,berpikir:`think`,bertindak:`act`,berubah:`change`,bisa:`can`,buat:`create`,cukup:`enough`,dalam:`within`,dampak:`impact`,dapat:`can`,darurat:`emergency`,datang:`arrives`,dekat:`close`,depan:`front`,diberikan:`provided`,dibagikan:`shared`,dibatalkan:`reversed`,dibaca:`read`,dibangun:`built`,dibantu:`assisted`,dibawa:`carried`,dibuat:`created`,dihapus:`deleted`,dikirim:`sent`,dilakukan:`performed`,dilihat:`viewed`,dilokalkan:`localized`,dimanfaatkan:`exploited`,diminta:`requested`,dipengaruhi:`influenced`,dipilih:`selected`,dipindai:`scanned`,dipotong:`cut`,diproses:`processed`,disimpan:`stored`,disediakan:`provided`,ditampilkan:`displayed`,diterapkan:`applied`,ditindaklanjuti:`acted upon`,dunia:`world`,empat:`four`,fakta:`facts`,hal:`things`,harus:`must`,hari:`day`,hubungi:`contact`,identitas:`identity`,independen:`independent`,ingin:`want`,isi:`contents`,jadi:`become`,jadwal:`schedule`,jaga:`guard`,jika:`if`,jumlah:`number`,kanal:`channel`,karena:`because`,kartu:`card`,keadaan:`situation`,keamanan:`safety`,keaslian:`authenticity`,kebenaran:`truth`,kebiasaan:`habit`,kebutuhan:`needs`,kedua:`both`,keliru:`wrong`,kelompok:`group`,keluarga:`family`,kemungkinan:`possibility`,kerja:`work`,kerugian:`loss`,kesadaran:`awareness`,kesempatan:`opportunity`,ketika:`when`,ketidakpastian:`uncertainty`,klik:`click`,kuat:`strong`,kualitas:`quality`,lain:`other`,langsung:`directly`,layanan:`service`,lebih:`more`,lewat:`through`,lengkap:`complete`,lolos:`pass`,mampu:`able`,mana:`which`,masih:`still`,masyarakat:`people`,membaca:`read`,membantah:`disprove`,membayar:`pay`,membutuhkan:`need`,memastikan:`ensure`,membentuk:`form`,memberi:`provide`,membuka:`reveal`,membuat:`make`,memicu:`trigger`,memindai:`scan`,meminta:`request`,memilih:`choose`,memperkuat:`strengthen`,mencatat:`record`,mencetak:`print`,mendapat:`receive`,mendorong:`push`,menemukan:`find`,mengaku:`claim`,mengangkat:`raise`,mengambil:`take`,mengapa:`why`,mengarah:`lead`,mengatasi:`address`,mengecek:`check`,menghindari:`avoid`,mengikuti:`follow`,mengirim:`send`,mengubah:`change`,menilai:`assess`,menjadi:`become`,menjaga:`protect`,menunjukkan:`show`,menuju:`toward`,menyebarkan:`spread`,menyelesaikan:`complete`,menyerupai:`resemble`,menyatakan:`state`,mereka:`they`,milik:`belongs to`,mirip:`similar`,muncul:`appears`,nyata:`real`,oleh:`by`,orang:`people`,pada:`on`,paling:`most`,palsu:`fake`,pembayaran:`payment`,pembanding:`comparison`,pembicara:`speaker`,pembaruan:`update`,pembuat:`creator`,pemilik:`owner`,penalaran:`reasoning`,penerima:`recipient`,pengalaman:`experience`,pengirim:`sender`,pengumuman:`announcement`,penipuan:`scam`,penjelasan:`explanation`,penilaian:`judgment`,penyebar:`distributor`,perangkat:`device`,percaya:`trust`,permintaan:`request`,pernah:`ever`,perusahaan:`company`,pihak:`party`,pikir:`think`,potongan:`clip`,prioritaskan:`prioritize`,produk:`product`,ruang:`space`,saat:`when`,sama:`same`,scan:`scan`,sebagai:`as`,sebuah:`a`,segera:`immediately`,sejenak:`briefly`,selalu:`always`,selama:`during`,semua:`all`,sendiri:`independently`,sering:`often`,sesuai:`appropriate`,sesudah:`after`,setuju:`agree`,siapa:`who`,situasi:`situation`,sudah:`already`,supaya:`so`,tahap:`stage`,tahu:`know`,tampak:`appears`,terasa:`feels`,terbatas:`limited`,terbentuk:`formed`,terjadi:`happened`,terjebak:`trapped`,terkait:`relevant`,terlihat:`visible`,terlebih:`first`,tersebut:`that`,tetap:`remains`,tiga:`three`,tokoh:`figure`,transfer:`transfer`,ubah:`change`,ukuran:`size`,unggahan:`post`,viral:`viral`,warga:`participants`,waspada:`alert`,wajah:`face`,waktu:`time`,warna:`color`};function De(){return document.documentElement.dataset.language===`en`?`en`:`id`}function I(e){let t=document.querySelector(`[data-language-toggle]`);if(!t)return;let n=e===`en`;t.querySelector(`.language-flag`).className=`language-flag ${n?`flag-id`:`flag-us`}`,t.querySelector(`.language-code`).textContent=n?`ID`:`EN`,t.setAttribute(`aria-pressed`,String(n)),t.setAttribute(`aria-label`,n?`Switch to Indonesian`:`Translate website to English`),t.title=n?`Switch to Indonesian`:`Translate website to English`}function L(e=document.body){return e}function Oe(e,t){return e===e.toUpperCase()&&/[A-Z]/i.test(e)?t.toUpperCase():e[0]===e[0]?.toUpperCase()?t[0]?.toUpperCase()+t.slice(1):t}function ke(e){let t=String(e),n=ie[t.trim()]||Ee.get(t.trim())||M[t.trim()];return n?t.replace(t.trim(),n):([...Object.entries(ie),...Ee].sort((e,t)=>t[0].length-e[0].length).forEach(([e,n])=>{let r=e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`),i=/^[\p{L}\p{N}]/u.test(e)?`(?<![\\p{L}\\p{N}])`:``,a=/[\p{L}\p{N}]$/u.test(e)?`(?![\\p{L}\\p{N}])`:``;t=t.replace(RegExp(`${i}${r}${a}`,`giu`),e=>Oe(e,n))}),t=t.replace(/\b[\p{L}]+\b/gu,e=>{if(/^hadangin$/i.test(e))return e;let t=F[e.toLocaleLowerCase(`id`)];return t?Oe(e,t):e}),t)}function Ae(e=document.body){if(!e||Te)return;Te=!0;let t=De(),n=[];if(e.nodeType===Node.TEXT_NODE)n.push(e);else{let t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(;t.nextNode();)n.push(t.currentNode)}n.forEach(e=>{if(!e.nodeValue.trim()||e.parentElement?.closest(`script, style, .notranslate, [translate='no']`))return;P.has(e)||P.set(e,e.nodeValue);let n=P.get(e);e.nodeValue=t===`en`?ke(n):n}),(e.nodeType===Node.ELEMENT_NODE?[e,...e.querySelectorAll(`[aria-label], [title], [placeholder], [alt]`)]:[]).forEach(e=>{if(e.closest(`.notranslate, [translate='no']`))return;we.has(e)||we.set(e,{});let n=we.get(e);[`aria-label`,`title`,`placeholder`,`alt`].forEach(r=>{e.hasAttribute(r)&&(r in n||(n[r]=e.getAttribute(r)),e.setAttribute(r,t===`en`?ke(n[r]):n[r]))})}),[[`#community-team-arus`,`Tim Arus`,`Flow Team`],[`#community-team-hadang`,`Tim Hadang`,`Guard Team`]].forEach(([e,n,r])=>{let i=document.querySelector(e);i&&(t===`en`&&i.value===n&&(i.value=r),t===`id`&&i.value===r&&(i.value=n))}),Te=!1,document.title=t===`en`?`HADANGIN - Indonesian AI Context Guard Web`:`HADANGIN - AI Context Guard Web Indonesia`;let r=document.querySelector(`meta[name="description"]`);r&&(r.content=t===`en`?`HADANGIN, a localized AI Context Guard Web prototype that helps users pause, verify, reflect, and evaluate before trusting or sharing digital information.`:`HADANGIN, prototipe lokal AI Context Guard Web untuk membantu pengguna pause, verify, reflect, dan evaluate sebelum mempercayai atau membagikan informasi digital.`)}function je(e,t=!0){let n=e===`en`?`en`:`id`;if(L(),document.documentElement.dataset.language=n,document.documentElement.lang=n,I(n),t)try{localStorage.setItem(Ce,n)}catch{}Ae(),Ne(document.documentElement.dataset.theme,!1),window.dispatchEvent(new CustomEvent(`hadang:language-change`,{detail:{language:n}}))}var Me=`id`;try{Me=localStorage.getItem(Ce)===`en`?`en`:`id`}catch{}new URLSearchParams(location.search).get(`lang`)===`en`&&(Me=`en`),document.documentElement.dataset.language=Me,document.documentElement.lang=Me,I(Me),new MutationObserver(e=>{e.forEach(e=>e.addedNodes.forEach(e=>{De()===`en`&&Ae(e.nodeType===Node.TEXT_NODE?e.parentElement:e)}))}).observe(document.body,{childList:!0,subtree:!0}),L();function Ne(e,t=!0){let n=e===`light`?`light`:`blue`;document.documentElement.dataset.theme=n;let r=document.querySelector(`[data-theme-toggle]`),i=n===`light`;if(r){let e=De()===`en`?i?`Use dark blue theme`:`Use white and blue theme`:i?`Gunakan tema biru gelap`:`Gunakan tema putih biru`;r.setAttribute(`aria-label`,e),r.setAttribute(`aria-pressed`,String(i)),r.title=e}if(t)try{localStorage.setItem(`hadangin-theme`,n)}catch{}}Ne(document.documentElement.dataset.theme,!1);function R(e=``){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function Pe(e){clearTimeout(Se),xe.textContent=e,xe.classList.add(`show`),Se=setTimeout(()=>xe.classList.remove(`show`),2800)}function Fe(){let e=location.hash.replace(/^#\/?/,``).split(`/`)[0];return e===`training`?`training`:e===`community`?`community`:e===`dashboard`?`dashboard`:e===`how-it-works`?`how`:e===`about`?`about`:`verify`}function Ie(){document.querySelectorAll(`[data-route]`).forEach(e=>{e.classList.toggle(`active`,e.dataset.route===N.route)}),document.querySelector(`.main-nav`).classList.remove(`open`),document.querySelector(`.menu-toggle`).setAttribute(`aria-expanded`,`false`)}function Le(){Object.assign(N,{inFlow:!1,directDetection:!1,stage:2,hadangStep:0,initialDecision:``,initialConfidence:68,pressure:[],emotion:[],neutralImpact:``,evidence:``,requestedAction:``,consequence:``,saferAction:``,finalDecision:``,finalConfidence:72,reflection:[],priority:``,result:!1,questionOpen:!0,gameScore:0,gameLives:3,gameCombo:1,gameCatches:0,gameRoundComplete:!1,gameOver:!1,guardY:54,aiWrong:!1})}function z(e={}){rt(),Nt(),ee(),window.dispatchEvent(new CustomEvent(`hadang:before-render`));let t=window.scrollY,n=document.querySelector(`.game-question-panel`)?.scrollTop||0;N.route=Fe(),Ie(),be.innerHTML=N.route===`training`?nn():N.route===`community`?Ft():N.route===`dashboard`?tn():N.route===`how`?rn():N.route===`about`?an():N.inFlow?Ge():Be(),window.dispatchEvent(new CustomEvent(`hadang:rendered`,{detail:{route:N.route}})),requestAnimationFrame(it),N.route===`community`&&V.mode===`vision`&&V.phase===1?requestAnimationFrame(()=>te(V.completedLines)):re()&&ne(),document.body.classList.toggle(`game-active`,N.route===`verify`&&N.inFlow&&N.stage===3),requestAnimationFrame(()=>{if(e.preserveScroll){window.scrollTo({top:t,behavior:`instant`});let e=document.querySelector(`.game-question-panel`);e&&(e.scrollTop=n)}else window.scrollTo({top:0,behavior:`instant`})})}function Re(){return`
    <section class="hero">
      <video class="hero-video" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1">
        <source src="${se}" type="video/mp4" />
      </video>
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">AI Context Guard Web &middot; Indonesian Local Prototype</p>
          <h1>HADANGIN: Hadang Sebelum Terjebak.</h1>
          <p class="lead">HADANGIN memposisikan AI Context Guard Web dalam konteks Indonesia: bantu pengguna pause, verify, reflect, dan evaluate sebelum klik, transfer, scan, atau membagikan informasi digital.</p>
          <div class="localization-note"><strong>Localized from AI Context Guard Web</strong><span>Metode J.E.D.A. menerjemahkan prinsip MIL menjadi pengalaman interaktif berbasis budaya hadang/gobak sodor.</span></div>
          <div class="hero-actions button-row">
            <button class="button" data-scroll-to="verify-tool">Mulai Pemeriksaan <span aria-hidden="true">&#8594;</span></button>
            <a class="button button-secondary" href="#/training">Coba Latihan</a>
          </div>
          <div class="hero-principle"><span>Human First</span><i></i><span>AI Second</span><i></i><span>Human Final</span></div>
        </div>
      </div>
      <span class="hero-scroll">Gulir untuk memahami alur</span>
    </section>`}function ze(){return`<section class="section section-white onboarding-section" id="onboarding">
    <div class="page-shell">
      <div class="onboarding-layout">
        <div class="onboarding-story">
          <p class="section-kicker">Sebelum mulai</p>
          <h2>Bayangkan ada pesan yang membuatmu ingin langsung bertindak.</h2>
          <p>HADANGIN tidak memulai dari jawaban AI. Pengguna diajak memahami situasi dulu: apa isi informasinya, tekanan apa yang muncul, bukti apa yang tersedia, dan tindakan apa yang paling aman.</p>
          <p class="story-highlight">Tujuannya bukan sekadar menemukan “hoaks” atau “bukan hoaks”, tetapi membangun kebiasaan berpikir: berhenti dulu, periksa konteks, gunakan AI sebagai lensa, lalu ambil keputusan sendiri.</p>
        </div>
        <div class="onboarding-path" aria-label="Alur onboarding HADANGIN">
          ${[[`1`,`Informasi datang`,`Pesan, screenshot, QR, audio, atau tautan terasa mendesak dan meminta tindakan cepat.`],[`2`,`Ambil J.E.D.A.`,`Berhenti sejenak untuk membaca tekanan, emosi, bukti, dan risiko tindakan yang diminta.`],[`3`,`Minta second opinion`,`AI Lens membantu melihat sinyal manipulasi dan hal yang masih perlu diverifikasi.`],[`4`,`Putuskan dengan sadar`,`Keputusan akhir tetap milikmu, lalu refleksi mencatat apa yang mengubah penilaianmu.`]].map(([e,t,n])=>`<article class="onboarding-card"><span>${e}</span><div><h3>${t}</h3><p>${n}</p></div></article>`).join(``)}
        </div>
      </div>
    </div>
  </section>`}function Be(){return`${Re()}
    ${ze()}
    <section class="section" id="verify-tool">
      <div class="page-shell">
        <div class="section-header center">
          <p class="section-kicker">AI Context Guard versi lokal</p>
          <h2>Periksa Informasi Mencurigakan</h2>
          <p>Masukkan konten yang ingin kamu evaluasi. Pilih Deteksi AI untuk hasil langsung, atau AI Plus untuk alur Human First dan latihan J.E.D.A.</p>
        </div>
        <div class="card tool-card">
          <div class="card-header">
            <div><h3>Pilih jenis konten</h3><p>Gunakan contoh yang tersedia atau masukkan kontenmu sendiri.</p></div>
            <span class="status-pill">Pemrosesan lokal</span>
          </div>
          <div class="tabs" role="tablist" aria-label="Jenis konten">
            ${Ve(`image`,`Gambar / Screenshot`)}
            ${Ve(`text`,`Teks / Pesan`)}
            ${Ve(`audio`,`Audio`)}
            ${Ve(`qr`,`QR / Link`)}
          </div>
          ${He()}
          <div class="privacy-note">Konten hanya diproses di perangkat ini untuk kebutuhan simulasi dan tidak dikirim ke server.</div>
          <div class="check-mode-picker">
            <div><strong>Pilih cara pemeriksaan</strong><span>Keduanya menggunakan Explainable AI. AI Plus menambahkan latihan penalaran dan permainan J.E.D.A.</span></div>
            <div class="check-mode-actions"><button class="button button-secondary" data-action="direct-ai"><span class="mode-button-icon" aria-hidden="true">AI</span><span><strong>Deteksi AI</strong><small>Prediksi + XAI langsung</small></span></button><button class="button" data-action="start-check"><span class="mode-button-icon plus" aria-hidden="true">+</span><span><strong>AI Plus</strong><small>Human First + Game J.E.D.A.</small></span><i aria-hidden="true">&#8594;</i></button></div>
          </div>
        </div>
      </div>
    </section>
    <div class="feature-strip" aria-label="Prinsip pemeriksaan">
      <article><span class="feature-number">01 / PAUSE</span><h3>Bentuk penilaian awal</h3><p>Respons dan keyakinanmu dicatat sebelum sinyal AI ditampilkan.</p></article>
      <article><span class="feature-number">02 / J.E.D.A.</span><h3>Question &amp; check</h3><p>Metode lokal untuk mengenali tekanan, emosi, data, dan risiko aksi.</p></article>
      <article><span class="feature-number">03 / DECIDE</span><h3>Bandingkan, lalu putuskan</h3><p>AI memberi second opinion. Keputusan final tetap berada padamu.</p></article>
    </div>`}function Ve(e,t){return`<button class="tab ${N.inputType===e?`active`:``}" role="tab" aria-selected="${N.inputType===e}" data-input-type="${e}">${t}</button>`}function He(){if(N.inputType===`text`)return`<div class="input-zone"><textarea id="content-input" aria-label="Teks atau pesan mencurigakan" placeholder="Tempel pesan atau klaim di sini...">${R(N.content)}</textarea></div>`;if(N.inputType===`qr`){let e=`<div class="media-input-modes" role="group" aria-label="Cara memasukkan QR atau tautan"><button type="button" class="${N.qrInputMode===`link`?`active`:``}" data-qr-input-mode="link">Tempel Tautan</button><button type="button" class="${N.qrInputMode===`image`?`active`:``}" data-qr-input-mode="image">Upload QR</button></div>`;return N.qrInputMode===`image`?N.qrImageDataUrl?`${e}<div class="image-upload-preview qr-upload-preview" data-drop-zone><div class="uploaded-image-frame"><img src="${N.qrImageDataUrl}" alt="Preview QR ${R(N.fileName)}" /></div><div class="uploaded-file-meta"><div><span>QR siap diperiksa</span><strong>${R(N.fileName)}</strong><small>AI simulasi akan memetakan struktur QR dan tujuan yang terbaca.</small></div><div class="button-row"><label class="button button-secondary button-small" for="file-input">Ganti QR</label><button class="icon-remove" type="button" data-action="remove-qr" aria-label="Hapus QR" title="Hapus QR">&times;</button></div></div><input class="file-input" id="file-input" type="file" accept="image/*" /></div>`:`${e}<div class="input-zone" data-drop-zone><div class="upload-content"><div class="upload-symbol" aria-hidden="true">#</div><strong>Upload gambar QR</strong><p>Tarik screenshot atau foto QR ke sini. PNG, JPG, dan WEBP hingga 10 MB.</p><label class="button button-secondary" for="file-input">Pilih Gambar QR</label><input class="file-input" id="file-input" type="file" accept="image/*" /></div></div>`:`${e}<div class="link-input-zone"><div class="link-input-icon" aria-hidden="true">//</div><div><strong>Alamat tujuan yang ingin diperiksa</strong><p>Tautan tidak akan dibuka. Simulasi hanya membaca struktur alamatnya.</p></div><input id="content-input" type="url" aria-label="Tautan mencurigakan" placeholder="https://contoh-tautan.com/verifikasi" value="${N.content.startsWith(`http`)?R(N.content):``}" /><div class="link-safety-note"><span></span>Pratinjau aman: tanpa membuka situs tujuan</div></div>`}let e=N.inputType===`audio`;return e&&N.audioDataUrl?`<div class="audio-upload-preview" data-drop-zone><div class="audio-file-head"><div class="audio-file-icon" aria-hidden="true">~</div><div><span>Rekaman siap diperiksa</span><strong>${R(N.fileName)}</strong><small>Putar dan dengarkan konteks sebelum memulai.</small></div><button class="icon-remove" type="button" data-action="remove-audio" aria-label="Hapus audio" title="Hapus audio">&times;</button></div>${Ue(42,`input-wave`)}<audio controls preload="metadata" src="${N.audioDataUrl}">Browser tidak mendukung pemutar audio.</audio><label class="button button-secondary button-small" for="file-input">Ganti Audio</label><input class="file-input" id="file-input" type="file" accept="audio/*" /></div>`:!e&&N.imageDataUrl?`<div class="image-upload-preview" data-drop-zone>
      <div class="uploaded-image-frame"><img src="${N.imageDataUrl}" alt="Preview ${R(N.fileName)}" /></div>
      <div class="uploaded-file-meta"><div><span>Gambar siap diperiksa</span><strong>${R(N.fileName)}</strong><small>Gambar akan tetap terlihat sampai tahap Explainable AI.</small></div><div class="button-row"><label class="button button-secondary button-small" for="file-input">Ganti Gambar</label><button class="icon-remove" type="button" data-action="remove-image" aria-label="Hapus gambar" title="Hapus gambar">&times;</button></div></div>
      <input class="file-input" id="file-input" type="file" accept="image/*" />
    </div>`:`<div class="input-zone" data-drop-zone><div class="upload-content"><div class="upload-symbol" aria-hidden="true">${e?`~`:`+`}</div><strong>${N.fileName?R(N.fileName):`Pilih ${e?`rekaman audio`:`gambar atau screenshot`}`}</strong><p>${e?`Tarik MP3, WAV, atau M4A hingga 10 MB`:`Tarik gambar ke sini atau pilih PNG, JPG, dan WEBP hingga 10 MB`}</p><label class="button button-secondary" for="file-input">Pilih File</label><input class="file-input" id="file-input" type="file" accept="${e?`audio/*`:`image/*`}" /></div></div>`}function Ue(e=48,t=``){return`<div class="audio-waveform ${t}" aria-hidden="true">${Array.from({length:e},(e,t)=>`<i style="--amp:${22+(t*37+t*t*3)%70}%"></i>`).join(``)}</div>`}function We(){let e=[`Content`,`My Judgment`,`J.E.D.A.`,`AI Lens`,`Final Decision`,`Reflection`],t=N.result?6:N.stage;return`<div class="progress-wrap">
    <div class="progress-steps">${e.map((e,n)=>{let r=n+1;return`<div class="progress-step ${r<t?`done`:r===t?`active`:``}"><span class="num">${r<t?`&#10003;`:r}</span><span>${e}</span></div>`}).join(``)}</div>
    <div class="mobile-progress"><div class="mobile-progress-head"><span>Langkah ${t} dari 6</span><span>${e[t-1]}</span></div><div class="meter"><span style="width:${t/6*100}%"></span></div></div>
  </div>`}function Ge(){if(N.directDetection)return xt();let e=Ke();N.stage===3&&(e=Qe()),N.stage===4&&(e=St()),N.stage===5&&(e=Ct()),N.stage===6&&(e=N.result?Tt():wt());let t=N.stage===3;return`${We()}<section class="flow-canvas ${t?`game-flow-canvas`:``}"><div class="${t?`game-flow-shell`:`page-shell`}">${e}</div></section>`}function Ke(){let e=[`Lanjut`,`Verifikasi Dulu`,`Berhenti`,`Belum Yakin`],t=ye();return`<div class="flow-card">
    <header><p class="section-kicker">Human First</p><h2>Sebelum AI Membantu...</h2><p>Kami ingin tahu bagaimana kamu membaca situasi ini terlebih dahulu.</p>${N.trainingScenario?`<div class="active-case-ribbon"><span>Kasus ${t.no}</span><strong>${R(t.title)}</strong><i>${R(t.format)}</i></div>`:``}</header>
    ${qe()}
    <div class="question">
      <span class="question-label">Apa respons pertamamu jika ini terjadi di dunia nyata?</span>
      <div class="choice-grid">${e.map(e=>Xe(e,N.initialDecision,`initial-decision`)).join(``)}</div>
    </div>
    <div class="question">
      <span class="question-label">Seberapa yakin kamu dengan keputusan itu?</span>
      ${Ye(`initial-confidence`,N.initialConfidence)}
      <p class="helper">AI belum akan ditampilkan sampai kamu menyelesaikan tahap berpikir awal.</p>
    </div>
    <div class="flow-actions"><button class="button button-ghost" data-action="cancel-flow">Kembali</button><button class="button" data-action="lock-initial" ${N.initialDecision?``:`disabled`}>Kunci Penilaian Awal</button></div>
  </div>`}function qe(){return N.trainingScenario?Je(ye()):N.inputType===`image`&&N.imageDataUrl?`<div class="human-image-context"><img src="${N.imageDataUrl}" alt="Gambar yang sedang diperiksa" /><div><span class="label">Gambar yang diperiksa</span><strong>${R(N.fileName)}</strong><p>Amati konteks, sumber, detail visual, dan tindakan yang diminta sebelum melihat analisis AI.</p></div></div>`:N.inputType===`audio`&&N.audioDataUrl?`<div class="human-audio-context"><div><span class="label">Rekaman yang diperiksa</span><strong>${R(N.fileName)}</strong>${Ue(38,`human-wave`)}<audio controls preload="metadata" src="${N.audioDataUrl}"></audio></div><div class="transcript-preview"><span>Transkrip simulasi</span><p>"Nak, ini Mama. Nomor Mama sedang bermasalah. Tolong transfer sekarang dan jangan telepon dulu."</p><small>Transkrip ini adalah contoh frontend, bukan hasil speech-to-text aktual.</small></div></div>`:N.inputType===`qr`&&N.qrInputMode===`image`&&N.qrImageDataUrl?`<div class="human-image-context"><img src="${N.qrImageDataUrl}" alt="QR yang sedang diperiksa" /><div><span class="label">QR yang diperiksa</span><strong>${R(N.fileName)}</strong><p>Periksa lokasi QR, pemilik media, serta nama penerima sebelum memindai atau membayar.</p></div></div>`:N.inputType===`qr`?`<div class="human-link-context"><span class="label">Tautan yang diperiksa</span><strong>${R(ve(N.content))}</strong><code>${R(N.content)}</code><p>Jangan buka tautan dari panel ini. Nilai klaim pengirim dan cari kanal resmi secara mandiri.</p></div>`:`<div class="message-panel"><span class="label">Informasi yang diperiksa</span><blockquote>${R(N.content||ae)}</blockquote></div>`}function Je(e){return e.inputType===`qr`&&e.inputMode===`image`?`<div class="training-case-context"><div class="case-visual qr-case"><div class="qr-pattern" aria-label="Ilustrasi QR pembayaran"><span></span><span></span><span></span></div><i>STIKER BARU</i><small>MEJA KASIR</small></div><div class="case-copy"><span class="label">${R(e.source)}</span><strong>QR pembayaran pengganti</strong><blockquote>${R(e.content)}</blockquote><p>Amati posisi stiker dan pastikan nama penerima sebelum memindai.</p></div></div>`:e.inputType===`qr`?`<div class="human-link-context"><span class="label">${R(e.source)}</span><blockquote>${R(e.content)}</blockquote><strong>${R(ve(N.content))}</strong><code>${R(N.content)}</code><p>Alamat ditampilkan tanpa dibuka. Cocokkan dengan domain resmi melalui kanal independen.</p></div>`:e.inputType===`audio`?`<div class="human-audio-context training-audio-context"><div><span class="label">${R(e.source)}</span><strong>Voice note keluarga / 00:18</strong>${Ue(38,`human-wave`)}<div class="audio-simulation-status"><i></i>Rekaman latihan siap dianalisis</div></div><div class="transcript-preview"><span>Transkrip kasus</span><p>"${R(e.content)}"</p><small>Perhatikan larangan menelepon dan permintaan transfer mendesak.</small></div></div>`:e.inputType===`image`?`<div class="training-case-context"><div class="case-visual ${e.id===`manipulated-media`?`video-case`:`social-case`}">${e.id===`manipulated-media`?`<div class="video-person"><span></span></div><b>LIVE</b><em>INVESTASI HANYA HARI INI</em>`:`<div class="social-avatar"></div><small>${e.id===`job-offer`?`INFO KARIER`:`UNGGAHAN VIRAL`}</small><strong>${R(e.content)}</strong><div class="social-stats"><span>12,8K</span><span>Bagikan</span></div>`}</div><div class="case-copy"><span class="label">${R(e.source)}</span><strong>${R(e.title)}</strong><blockquote>${R(e.content)}</blockquote><p>${R(e.mission)}</p></div></div>`:`<div class="message-panel training-message-context"><div class="message-meta"><span>${R(e.source)}</span><i>${R(e.format)}</i></div><span class="label">Informasi yang diperiksa</span><blockquote>${R(e.content)}</blockquote><p>${R(e.mission)}</p></div>`}function Ye(e,t){return`<div class="confidence-box"><div class="confidence-head"><span>0 - belum yakin</span><span class="confidence-value">${t}% yakin</span></div><input type="range" min="0" max="100" value="${t}" data-range="${e}" aria-label="Tingkat keyakinan ${t} persen" /></div>`}function Xe(e,t,n,r=``){return`<button class="choice ${t===e?`selected ${r}`:``}" data-select="${n}" data-value="${R(e)}">${R(e)}</button>`}function Ze(e,t,n){return`<button class="choice ${t.includes(e)?`selected selected-teal`:``}" data-multi="${n}" data-value="${R(e)}">${R(e)}</button>`}function Qe(){if(N.hadangStep===-1)return $e();let e=[`Jeda`,`Emosi`,`Data`,`Aksi`],t=[N.pressure.length>0,N.emotion.length>0,!!N.evidence,!!N.requestedAction][N.hadangStep];return`<div class="hadang-play-layout fullscreen-play-layout">
    <div class="game-world fullscreen-game-world">
      ${et()}
      <div class="live-readout"><span class="live-dot"></span><div><small>STATUS ARENA</small><strong data-game-status>${N.gameRoundComplete?`Token tertangkap. Buka pertanyaan ${e[N.hadangStep]}.`:`Gerakkan penjaga ${e[N.hadangStep]} dan tangkap token.`}</strong></div><div class="game-live-stats"><span><small>SKOR</small><b data-game-score>${N.gameScore}</b></span><span><small>NYAWA</small><b data-game-lives>${`&#9829;`.repeat(N.gameLives)}${`&#9825;`.repeat(3-N.gameLives)}</b></span></div></div>
      ${N.questionOpen?`<div class="question-scrim" aria-hidden="true"></div>`:``}
      ${N.questionOpen?`<aside class="game-question-panel game-question-modal ${t?`settled`:`entering`}" id="game-question-panel" role="dialog" aria-modal="false" aria-label="Pertanyaan penjaga ${e[N.hadangStep]}">
        <div class="question-panel-top"><span>POS PENJAGA 0${N.hadangStep+1}</span><span>${N.hadangStep+1} / 4</span><button class="question-close" type="button" data-action="hide-question" aria-label="Tutup pertanyaan" title="Tutup pertanyaan">&times;</button></div>
        ${pt()}
      </aside>`:`<button class="question-reopen" type="button" data-action="focus-question"><span>0${N.hadangStep+1}</span><strong>Buka Pertanyaan ${e[N.hadangStep]}</strong></button>`}
    </div>
  </div>`}function $e(){return`<div class="transition-panel game-transition game-fullscreen-intro">
    ${tt(-1,!0)}
    <div class="game-start-modal" role="dialog" aria-label="Misi Arena Hadang">
      <span class="start-level">MISI HADANGIN</span>
      <h2>Jangan biarkan informasi lolos menuju tindakan.</h2>
      <p>Gerakkan penjaga aktif di garisnya, tangkap token informasi, lalu jawab pertanyaan J.E.D.A. Jangan biarkan tiga token lolos menuju tindakan.</p>
      <div class="start-rules"><span><b>J</b> Jeda</span><span><b>E</b> Emosi</span><span><b>D</b> Data</span><span><b>A</b> Aksi</span></div>
      <div class="game-control-hint desktop-game-control-hint"><span><kbd>W</kbd><kbd>&uarr;</kbd> Naik</span><span><kbd>S</kbd><kbd>&darr;</kbd> Turun</span><span><kbd>Spasi</kbd> Hadang</span></div>
      <div class="touch-game-control-hint"><strong>Kontrol HP</strong><span>Ketuk posisi di lapangan atau tahan tombol arah, lalu tekan HADANG.</span></div>
      <button class="button button-teal" data-action="enter-arena">Mulai Permainan <span aria-hidden="true">&#8594;</span></button>
    </div>
  </div>`}function et(){return tt(N.hadangStep,!1)}function tt(e,t=!1){let n=[[`J`,`JEDA`,22],[`E`,`EMOSI`,40],[`D`,`DATA`,58],[`A`,`AKSI`,76]],r=e<0?0:e,i=t?8:[12,31,49,67][r];return`<div class="hadang-game-stage ${t?`intro-stage`:`arena-stage interactive-arena`}" style="--token-left:${i}%; --player-y:${N.guardY}%" tabindex="${t?`-1`:`0`}" aria-label="Arena Gobak Sodor Hadang Nalar, garis aktif ${n[r][1]}">
    <div class="game-stage-art" aria-hidden="true"></div>
    <div class="game-stage-shade" aria-hidden="true"></div>
    <div class="game-hud"><span class="hud-badge">LEVEL 01</span><span class="hud-status"><i></i>${t?`4 garis nalar`:`Garis ${r+1} dari 4`}</span></div>
    <div class="incoming-zone"><span>MASUK</span></div>
    ${n.map(([e,n,i],a)=>{let o=a<r&&!t?`done`:a===r?`active`:`locked`;return`<span class="checkpoint-line ${o}" style="--guard-left:${i}%" aria-hidden="true"></span><button class="guard-marker ${o} ${o===`active`&&!t?`player-guard`:``}" style="--guard-left:${i}%" type="button" ${o===`active`?`data-action="focus-question"`:`tabindex="-1"`} aria-label="Penjaga ${n}, ${o===`done`?`selesai`:o===`active`?`aktif`:`terkunci`}"><b>${e}</b><span>${n}</span>${o===`done`?`<i>&#10003;</i>`:``}</button>`}).join(``)}
    <div class="info-runner ${t?`is-running`:`game-token`}" data-game-token><span class="runner-card"><i></i><i></i><i></i></span><strong>INFO</strong><small data-token-kind>${t?`mencurigakan`:`pesan mendesak`}</small></div>
    <div class="action-gate"><span>TINDAKAN</span><small>Jangan biarkan lolos</small></div>
    ${t?``:`<div class="arena-controls" aria-label="Kontrol permainan">
      <button class="arena-control-move" type="button" data-game-control="up" aria-label="Gerakkan penjaga ke atas"><span aria-hidden="true">&#9650;</span><small>NAIK</small></button>
      <button class="arena-control-block" type="button" data-game-control="block" aria-label="Hadang token informasi"><span aria-hidden="true">H</span><strong>HADANG</strong></button>
      <button class="arena-control-move" type="button" data-game-control="down" aria-label="Gerakkan penjaga ke bawah"><span aria-hidden="true">&#9660;</span><small>TURUN</small></button>
    </div>`}
    <div class="game-mission-bar"><span>${t?`Informasi bergerak menuju aksi`:[`Kenali tekanan sebelum bergerak`,`Pisahkan emosi dari isi pesan`,`Cari bukti yang berdiri sendiri`,`Ukur risiko sebelum bertindak`][r]}${t?``:` · W/S atau panah untuk bergerak`}</span><div class="mission-pips">${n.map((e,n)=>`<i class="${n<r&&!t?`done`:n===r?`active`:``}"></i>`).join(``)}</div></div>
    ${!t&&N.gameOver?`<div class="game-over-panel"><span>MISI GAGAL</span><strong>Tiga informasi lolos.</strong><p>Ulangi ronde dan jaga garis ${n[r][1]}.</p><button class="button button-teal" type="button" data-action="retry-round">Ulangi Ronde</button></div>`:``}
  </div>`}var B=null,nt=new Set;function rt(){B&&(cancelAnimationFrame(B.frame),B=null,nt.clear())}function it(){let e=document.querySelector(`.arena-stage.interactive-arena`);!e||N.questionOpen||N.gameRoundComplete||N.gameOver||at(e)}function at(e){rt();let t=[22,40,58,76][N.hadangStep],n=[`pesan mendesak`,`tautan palsu`,`QR mencurigakan`,`voice note`,`klaim viral`],r=N.gameCatches+(3-N.gameLives)+N.hadangStep,i=matchMedia(`(max-width: 680px)`).matches,a=i?18:31,o=i?34:70,s=(i?[21,32,25,30,19,28]:[36,66,43,62,32,57])[r%6],c={stage:e,token:e.querySelector(`[data-game-token]`),guard:e.querySelector(`.player-guard`),x:Math.max(6,t-17),y:s,guardY:Math.min(o,Math.max(a,N.guardY)),yMin:a,yMax:o,nudge:i?4:9,guardLeft:t,speed:7.3+N.hadangStep*.65,blockingUntil:0,lastTime:performance.now(),frame:0};B=c,c.token?.classList.remove(`caught`,`escaped`),c.guard?.classList.remove(`caught-token`,`is-blocking`);let l=n[r%n.length];c.token?.querySelector(`[data-token-kind]`)?.replaceChildren(l),e.classList.add(`game-running`),e.focus({preventScroll:!0});let u=e=>{if(B!==c||!c.token||!c.guard)return;let t=Math.min((e-c.lastTime)/1e3,.05);c.lastTime=e;let n=(nt.has(`arrowdown`)||nt.has(`s`)?1:0)-(nt.has(`arrowup`)||nt.has(`w`)?1:0);c.guardY=Math.min(c.yMax,Math.max(c.yMin,c.guardY+n*38*t)),c.x+=c.speed*t,c.guard.style.top=`${c.guardY}%`,c.token.style.left=`${c.x}%`,c.token.style.top=`${c.y}%`,c.guard.classList.toggle(`is-blocking`,e<c.blockingUntil);let r=e<c.blockingUntil?14:8,i=Math.abs(c.x-c.guardLeft)<1.25,a=Math.abs(c.y-c.guardY)<r;if(i&&a){lt(c);return}if(c.x>c.guardLeft+8){ut(c);return}c.frame=requestAnimationFrame(u)};c.frame=requestAnimationFrame(u)}function ot(){B&&(B.blockingUntil=performance.now()+650,B.guard?.classList.add(`is-blocking`))}function st(e){if(!B)return;let t=B.stage.getBoundingClientRect();if(!t.height)return;let n=(e-t.top)/t.height*100;B.guardY=Math.min(B.yMax,Math.max(B.yMin,n)),N.guardY=B.guardY,B.guard&&(B.guard.style.top=`${B.guardY}%`)}function ct(){nt.delete(`arrowup`),nt.delete(`arrowdown`),document.querySelectorAll(`[data-game-control].is-pressed`).forEach(e=>e.classList.remove(`is-pressed`))}function lt(e){B===e&&(cancelAnimationFrame(e.frame),e.token.classList.add(`caught`),e.guard.classList.add(`caught-token`),N.guardY=e.guardY,N.gameCatches+=1,N.gameScore+=100*N.gameCombo,N.gameCombo=Math.min(4,N.gameCombo+1),N.gameRoundComplete=!0,dt(`Token tertangkap di garis ${[`Jeda`,`Emosi`,`Data`,`Aksi`][N.hadangStep]}!`,!0),B=null,setTimeout(()=>{N.questionOpen=!0,z({preserveScroll:!0})},520))}function ut(e){B===e&&(cancelAnimationFrame(e.frame),e.token.classList.add(`escaped`),N.guardY=e.guardY,N.gameLives=Math.max(0,N.gameLives-1),N.gameCombo=1,dt(`Informasi lolos. Bersiap untuk token berikutnya.`,!1),B=null,N.gameLives===0?(N.gameOver=!0,setTimeout(()=>z({preserveScroll:!0}),480)):setTimeout(()=>it(),620))}function dt(e,t){let n=document.querySelector(`[data-game-status]`),r=document.querySelector(`[data-game-score]`),i=document.querySelector(`[data-game-lives]`);n&&(n.textContent=e),r&&(r.textContent=N.gameScore),i&&(i.innerHTML=`${`&#9829;`.repeat(N.gameLives)}${`&#9825;`.repeat(3-N.gameLives)}`),document.querySelector(`.live-readout`)?.classList.toggle(`catch-success`,t)}function ft(e=!1){rt(),e&&(N.gameLives=3,N.gameCombo=1),N.gameRoundComplete=!1,N.gameOver=!1,N.questionOpen=!1,N.guardY=54}function pt(){let e=me();if(N.hadangStep===0)return`<header><p class="section-kicker">Garis 01 - Jeda</p><h2>Berhenti sejenak dari dorongan bertindak.</h2><p>Apa yang membuat informasi ini terasa harus segera ditindaklanjuti?</p></header>
      <div class="choice-grid compact">${[`Deadline`,`Darurat`,`Ancaman`,`Hadiah`,`Kesempatan terbatas`,`Tekanan sosial`,`Tidak ada tekanan`].map(e=>Ze(e,N.pressure,`pressure`)).join(``)}</div>
      ${N.pressure.length?`<div class="insight"><div><strong>Ruang berpikir sedang dipersempit.</strong><br>Tekanan waktu dapat mengurangi ruang untuk mengevaluasi informasi.</div></div>`:``}
      ${mt(`Hadang Garis 1`,N.pressure.length>0)}`;if(N.hadangStep===1)return`<header><p class="section-kicker">Garis 02 - Emosi</p><h2>Kenali emosi yang sedang dipancing.</h2><p>Emosi bukan kesalahan. Mengenalinya membantu kamu menjaga jarak dari tekanan.</p></header>
      <div class="choice-grid compact">${[`Takut`,`Panik`,`Kasihan`,`Percaya`,`Marah`,`FOMO`,`Harapan`,`Penasaran`,`Kedekatan emosional`,`Tidak yakin`].map(e=>Ze(e,N.emotion,`emotion`)).join(``)}</div>
      <div class="neutralizer">
        <div class="message-panel"><span class="label">Pesan asli - tekanan aktif</span><blockquote>${R(e.neutralOriginal)}</blockquote></div>
        <div class="message-panel neutral"><span class="label">Tanpa tekanan emosi</span><blockquote>${R(e.neutralVersion)}</blockquote></div>
      </div>
      <div class="question"><span class="question-label">Setelah bahasanya dibuat netral, apakah keputusanmu terasa berbeda?</span><div class="choice-grid compact">${[`Ya`,`Sedikit`,`Tidak`].map(e=>Xe(e,N.neutralImpact,`neutral-impact`)).join(``)}</div></div>
      ${mt(`Hadang Garis 2`,N.emotion.length>0&&N.neutralImpact)}`;if(N.hadangStep===2){let t=e.evidenceOptions;return`<header><p class="section-kicker">Garis 03 - Data</p><h2>Pisahkan klaim dari buktinya.</h2><p>Bukti yang baik tidak hanya berasal dari pihak yang membuat klaim.</p></header>
      <div class="split-evidence"><section><h4>Klaim</h4><p>${R(e.claim)}</p></section><section><h4>Bukti independen</h4><p>${N.evidence?R(N.evidence):`Belum dipilih`}</p></section></div>
      <div class="question"><span class="question-label">Mana yang paling independen untuk memverifikasi klaim ini?</span><div class="choice-grid">${t.map(e=>Xe(e,N.evidence,`evidence`)).join(``)}</div></div>
      ${N.evidence?`<div class="insight"><div><strong>${N.evidence===e.preferredEvidence?`Pilihan verifikasi yang kuat.`:`Bukti ini belum cukup independen.`}</strong><br>Bandingkan informasi melalui kanal yang tidak diberikan oleh pesan mencurigakan.</div></div>`:``}
      ${mt(`Hadang Garis 3`,!!N.evidence)}`}let t=e.actionOptions,n=e.riskOptions,r=e.saferOptions;return`<header><p class="section-kicker">Garis 04 - Aksi</p><h2>Lihat tindakan dan konsekuensinya.</h2><p>Pesan manipulatif sering dibuat untuk mempercepat aksi yang sulit dibatalkan.</p></header>
    <div class="question"><span class="question-label">Apa sebenarnya yang diminta informasi ini darimu?</span><div class="choice-grid compact">${t.map(e=>Xe(e,N.requestedAction,`requested-action`)).join(``)}</div></div>
    <div class="question"><span class="question-label">Apa konsekuensinya jika keputusanmu salah?</span><div class="choice-grid">${n.map(e=>Xe(e,N.consequence,`consequence`)).join(``)}</div></div>
    <div class="question"><span class="question-label">Apa langkah alternatif yang lebih aman?</span><div class="choice-grid">${r.map(e=>Xe(e,N.saferAction,`safer-action`)).join(``)}</div></div>
    ${mt(`Hadang Sebelum Bertindak`,N.requestedAction&&N.consequence&&N.saferAction)}`}function mt(e,t){return`<div class="flow-actions"><button class="button button-ghost" data-action="hadang-back">Kembali</button><button class="button button-teal" data-action="hadang-next" ${t?``:`disabled`}>${e}</button></div>`}function ht(e,t){let n=N.content||ae,r=N.inputType===`image`&&N.imageDataUrl,i=N.inputType===`audio`&&N.audioDataUrl,a=N.inputType===`image`&&(r||N.trainingScenario),o=N.inputType===`audio`&&(i||N.trainingScenario),s=N.inputType===`qr`,c=t.dataset||(s?{name:N.qrInputMode===`image`?`QR Abuse Reference Set`:`URL Threat Pattern Set`,size:N.qrInputMode===`image`?`42.680 struktur QR`:`1,2 juta snapshot URL`,matches:N.qrInputMode===`image`?`19 pola tujuan serupa`:`63 pola domain serupa`}:null),l=`${bt(t,n)}${t.highlights.map((e,t)=>`<span class="red-box" style="--x:${e.x}%; --y:${e.y}%; --w:${e.w}%; --h:${e.h}%"><b>${t+1}</b></span>`).join(``)}`;return a&&(l=`<div class="xai-image-stage">${r?`<img class="xai-source-image" src="${N.imageDataUrl}" alt="Gambar upload dengan penjelasan XAI" />`:gt(ye())}${N.xaiMode===`heatmap`?`<div class="xai-heatmap" aria-hidden="true">${t.highlights.map(e=>`<span style="--hx:${e.x+e.w/2}%; --hy:${e.y+e.h/2}%; --hs:${Math.max(e.w,e.h)*1.7}%"></span>`).join(``)}</div>`:t.highlights.map((e,t)=>`<span class="red-box" style="--x:${e.x}%; --y:${e.y}%; --w:${e.w}%; --h:${e.h}%"><b>${t+1}</b></span>`).join(``)}</div>`),o&&(l=vt()),s&&(l=yt()),`<section class="detection-panel" aria-label="Explainable AI detection simulation">
    <div class="detection-header">
      <div><p class="section-kicker">Explainable detection</p><h3>${R(t.title)}</h3><p>${R(t.subtitle)}</p></div>
      <div class="confidence-badge"><span>${R(t.confidenceLabel)}</span><strong>${e.aiScore}%</strong></div>
    </div>
    ${_t(a,o,s)}
    <div class="detection-grid">
      <div class="detection-preview ${R(t.mode)}">
        <div class="preview-toolbar"><span></span><span></span><span></span><strong>AI Context Scan</strong></div>
        <div class="preview-canvas ${a?`uploaded-xai ${N.xaiMode}`:``} ${o?`audio-xai ${N.audioXaiMode}`:``} ${s?`qr-xai ${N.qrXaiMode}`:``}">
          ${l}
          ${a?`<div class="xai-legend"><span><i></i>${N.xaiMode===`heatmap`?`Pengaruh tinggi`:`Area perhatian model`}</span><small>Simulasi XAI</small></div>`:``}
        </div>
        <p class="preview-disclaimer">Highlight menunjukkan area yang memengaruhi hasil analisis dan bukan merupakan bukti final.</p>
      </div>
      <div class="detection-explain">
        <p class="detection-summary">${R(t.summary)}</p>
        ${c?`<div class="dataset-card"><span>Dataset referensi simulasi</span><strong>${R(c.name)}</strong><div><small>${R(c.size)}</small><small>${R(c.matches)}</small></div><p>Statistik dibuat untuk demonstrasi UI dan bukan hasil model produksi.</p></div>`:``}
        <div class="highlight-list">
          ${t.highlights.map((e,t)=>`<article><span>${t+1}</span><div><h4>${R(e.label)}${e.start?`<small>${R(e.start)}-${R(e.end)}</small>`:``}</h4><p>${R(e.detail)}</p></div></article>`).join(``)}
        </div>
      </div>
    </div>
    <div class="clue-question-grid">
      <section class="info-panel clue-panel"><h3>Clue yang terlihat</h3><ul>${t.clues.map(e=>`<li>${R(e)}</li>`).join(``)}</ul></section>
      <section class="info-panel question-panel"><h3>Pertanyaan reflektif</h3><ul>${t.reflectiveQuestions.map(e=>`<li>${R(e)}</li>`).join(``)}</ul></section>
    </div>
  </section>`}function gt(e){return e.id===`manipulated-media`?`<div class="training-xai-source video-xai-source"><span class="xai-subject"></span><b>LIVE</b><div><small>AKUN TIDAK TERVERIFIKASI</small><strong>Investasi eksklusif hanya hari ini</strong></div></div>`:`<div class="training-xai-source social-xai-source"><div class="xai-post-head"><span></span><div><small>${e.id===`job-offer`?`INFO KARIER`:`AKUN VIRAL`}</small><b>${e.id===`job-offer`?`Rekrutmen prioritas`:`12,8 ribu kali dibagikan`}</b></div></div><strong>${R(e.content)}</strong><div class="xai-post-action">${e.id===`job-offer`?`Bayar biaya administrasi`:`Sebarkan sekarang`}</div></div>`}function _t(e,t,n){return e?`<div class="xai-mode-bar"><div><strong>Visual Penjelasan XAI</strong><span>Pilih cara model menampilkan area yang memengaruhi sinyal.</span></div><div class="xai-segmented" role="group" aria-label="Mode visual XAI"><button class="${N.xaiMode===`bounding`?`active`:``}" type="button" data-xai-mode="bounding">Bounding Box</button><button class="${N.xaiMode===`heatmap`?`active`:``}" type="button" data-xai-mode="heatmap">Heatmap</button></div></div>`:t?`<div class="xai-mode-bar"><div><strong>Penjelasan Pola Audio</strong><span>Bandingkan sinyal suara dan distribusi frekuensi simulatif.</span></div><div class="xai-segmented" role="group" aria-label="Mode analisis audio"><button class="${N.audioXaiMode===`voice`?`active`:``}" type="button" data-audio-xai-mode="voice">Voice Pattern</button><button class="${N.audioXaiMode===`spectrogram`?`active`:``}" type="button" data-audio-xai-mode="spectrogram">Spectrogram</button></div></div>`:n?`<div class="xai-mode-bar"><div><strong>Penjelasan Risiko Tujuan</strong><span>Lihat sinyal struktur dan jalur yang mungkin dilalui.</span></div><div class="xai-segmented" role="group" aria-label="Mode analisis QR atau tautan"><button class="${N.qrXaiMode===`risk`?`active`:``}" type="button" data-qr-xai-mode="risk">Risk Map</button><button class="${N.qrXaiMode===`redirect`?`active`:``}" type="button" data-qr-xai-mode="redirect">Redirect Chain</button></div></div>`:``}function vt(){return`<div class="audio-analysis-stage"><div class="audio-analysis-meta"><span>VOICE SAMPLE / 00:18</span><b>${N.audioXaiMode===`voice`?`Pola suara`:`Spektrum frekuensi`}</b></div><div class="${N.audioXaiMode===`spectrogram`?`spectrogram-panel`:`voice-pattern-panel`}">${Ue(58,`analysis-wave`)}<span class="audio-marker marker-one">1</span><span class="audio-marker marker-two">2</span><span class="audio-marker marker-three">3</span></div><div class="audio-time-axis"><span>00:00</span><span>00:06</span><span>00:12</span><span>00:18</span></div>${N.audioDataUrl?`<audio controls preload="metadata" src="${N.audioDataUrl}"></audio>`:`<div class="audio-simulation-status"><i></i>Sampel audio skenario aktif</div>`}<div class="ai-transcript"><span>Transkrip simulasi</span><p>Nak, ini Mama. Nomor Mama bermasalah. <mark>Tolong transfer sekarang</mark> dan <mark>jangan telepon dulu</mark>.</p></div></div>`}function yt(){let e=N.qrInputMode===`image`&&(N.qrImageDataUrl||N.trainingScenario);if(N.qrXaiMode===`redirect`)return`<div class="redirect-analysis"><span class="analysis-label">SIMULATED REDIRECT TRACE</span><div class="redirect-chain"><div><i>1</i><span>Input pengguna<small>${e?`QR image decode`:R(ve(N.content))}</small></span></div><b></b><div class="warn"><i>2</i><span>Short redirect<small>tracking-gateway.example</small></span></div><b></b><div class="danger"><i>3</i><span>Form kredensial<small>secure-login-check.example</small></span></div></div><p>Rantai ini adalah visualisasi dataset simulasi. HADANGIN tidak membuka alamat tersebut.</p></div>`;if(e)return`<div class="qr-image-analysis">${N.qrImageDataUrl?`<img src="${N.qrImageDataUrl}" alt="QR upload dalam pemetaan risiko" />`:`<div class="qr-case-scan"><div class="qr-pattern" aria-label="QR skenario latihan"><span></span><span></span><span></span></div><small>STIKER TERDETEKSI</small></div>`}<span class="qr-scan-line"></span><span class="qr-focus focus-a">1</span><span class="qr-focus focus-b">2</span></div><div class="qr-destination"><span>Tujuan terbaca / simulasi</span><strong>merchant-pay-check.example</strong><small>Nama penerima belum cocok dengan merchant</small></div>`;let t=ve(N.content);return`<div class="url-risk-analysis"><span class="analysis-label">URL TOKEN RISK MAP</span><div class="url-token-map">${N.content.replace(/^https?:\/\//i,``).split(/([./?=&-])/).filter(Boolean).slice(0,18).map((e,t)=>`<span class="${t===0||/login|verify|secure|otp/i.test(e)?`flagged`:``}">${R(e)}</span>`).join(``)}</div><div class="domain-facts"><div><span>Host terbaca</span><strong>${R(t)}</strong></div><div><span>Pola terdeteksi</span><strong>Login + urgency</strong></div><div><span>Status</span><strong>Perlu verifikasi</strong></div></div></div>`}function bt(e,t){return e.mode===`qr`?`<div class="qr-preview"><span></span><span></span><span></span><i></i></div><div class="preview-caption">QR baru di area pembayaran</div>`:e.mode===`media`?`<div class="media-preview"><span class="media-face"></span><span class="media-body"></span><i></i><em></em></div><div class="preview-caption">Frame video / gambar yang dianalisis</div>`:e.mode===`link`?`<div class="link-preview"><strong>Bank Alert</strong><p>Rekening Anda akan diblokir dalam 30 menit.</p><code>https://secure-verifikasi.example/login</code></div>`:e.mode===`official`?`<div class="official-preview"><strong>Pemberitahuan Resmi</strong><p>${R(t)}</p><span>Perlu dicocokkan dengan aplikasi resmi.</span></div>`:`<div class="message-preview"><p>${R(t)}</p></div>`}function xt(){let e=ge(),t=_e(),n=[[`J`,`Jeda`,e.aiNotices[0]?.[1]||`Tekanan perlu diperiksa`,Math.min(96,e.aiScore+6),`amber`],[`E`,`Emosi`,e.aiNotices[1]?.[1]||`Respons emosional terdeteksi`,Math.max(42,e.aiScore-9),`red`],[`D`,`Data`,e.aiNotices[2]?.[1]||`Bukti belum terkonfirmasi`,Math.max(48,e.aiScore-4),`blue`],[`A`,`Aksi`,e.aiNotices[3]?.[1]||`Tindakan berisiko terdeteksi`,Math.min(98,e.aiScore+3),`teal`]],r=e.aiScore>=80?`Risiko tinggi - verifikasi sebelum bertindak`:e.aiScore>=70?`Perlu verifikasi lebih lanjut`:`Sinyal sedang - periksa bukti resmi`;return`<section class="direct-detection-page"><div class="page-shell">
    <div class="direct-result-topbar"><button class="button button-ghost button-small" type="button" data-action="back-to-input">&#8592; Ganti Konten</button><span>Mode Deteksi AI &middot; Explainable AI</span><button class="button button-small" type="button" data-action="switch-to-plus">Lanjut AI Plus &#8594;</button></div>
    <header class="direct-result-header"><div><p class="section-kicker">Hasil prediksi langsung</p><h1>AI menghadang empat sinyal sebelum tindakan.</h1><p>Hasil ini melewati latihan Human First dan game. Gunakan penjelasan XAI untuk menentukan apa yang masih perlu diverifikasi.</p></div><div class="direct-verdict"><span>${R(t.confidenceLabel)}</span><strong>${e.aiScore}%</strong><p>${R(r)}</p></div></header>
    <section class="ai-court-board" aria-label="Papan sinyal J.E.D.A. hasil prediksi AI"><div class="court-entry"><span>INPUT</span><i></i></div><div class="court-track">${n.map(([e,t,n,r,i],a)=>`<article class="court-signal ${i}"><div class="court-line"></div><span class="court-letter">${e}</span><div><small>GARIS 0${a+1}</small><strong>${t}</strong><p>${R(n)}</p><div class="court-score"><i style="--score:${r}%"></i><b>${r}</b></div></div></article>`).join(``)}</div><div class="court-gate"><span>AKSI</span><strong>${e.aiScore>=80?`TAHAN`:`CEK`}</strong></div></section>
    ${ht(e,t)}
    <div class="ai-notice-grid">${e.aiNotices.map(([e,t])=>`<div class="signal-card"><small>${R(e)}</small><strong>${R(t)}</strong></div>`).join(``)}</div>
    <div class="ai-columns direct-ai-columns"><section class="info-panel unknown"><h3>Yang belum dapat dipastikan AI</h3><ul>${e.unknowns.map(e=>`<li>${R(e)}</li>`).join(``)}</ul></section><section class="info-panel verify"><h3>Langkah verifikasi berikutnya</h3><ul>${e.verification.map(e=>`<li>${R(e)}</li>`).join(``)}</ul></section></div>
    <div class="direct-result-footer"><div><strong>Butuh penilaian yang lebih lengkap?</strong><p>Masuk ke AI Plus untuk membentuk penilaian awal, memainkan J.E.D.A., lalu membandingkannya dengan AI.</p></div><button class="button" type="button" data-action="switch-to-plus">Mulai AI Plus &#8594;</button></div>
  </div></section>`}function St(){let e=ge();return`<div class="flow-card">
    <header class="ai-header"><span class="ai-scan-icon" aria-hidden="true"></span><div><p class="section-kicker">AI Second</p><h2>AI Lens</h2><p>Second opinion dengan visual clue, confidence score, dan pertanyaan reflektif - bukan keputusan akhir.</p></div></header>
    ${ht(e,_e())}
    <div class="ai-notice-grid">${e.aiNotices.map(([e,t])=>`<div class="signal-card"><small>${R(e)}</small><strong>${R(t)}</strong></div>`).join(``)}</div>
    <div class="forensic-meter"><div class="forensic-meter-head"><strong>${N.aiWrong?`Suspicious Signals`:`Manipulation Signals`}: ${e.aiLevel}</strong><span>${e.aiScore}% indikator model</span></div><div class="meter"><span style="width:${e.aiScore}%"></span></div><p>Nilai ini menunjukkan sinyal model, bukan kebenaran final. Gunakan hasil ini untuk menentukan apa yang perlu dicek, bukan untuk langsung percaya.</p></div>
    <div class="ai-columns">
      <section class="info-panel unknown"><h3>Yang belum dapat dipastikan AI</h3><ul>${e.unknowns.map(e=>`<li>${R(e)}</li>`).join(``)}</ul></section>
      <section class="info-panel verify"><h3>Yang dapat kamu verifikasi</h3><ul>${e.verification.map(e=>`<li>${R(e)}</li>`).join(``)}</ul></section>
    </div>
    <div class="flow-actions"><button class="button button-ghost" data-action="back-to-hadang">Kembali ke J.E.D.A.</button><button class="button" data-action="compare-judgment">Bandingkan dengan Penilaian Saya</button></div>
  </div>`}function Ct(){let e=ge(),t=N.aiWrong?[`Saya setuju dengan AI`,`Saya tidak setuju dengan AI`,`Verifikasi lagi`,`Belum yakin`]:[`Lanjut`,`Verifikasi Dulu`,`Berhenti`,`Belum Yakin`];return`<div class="flow-card">
    <header><p class="section-kicker">Human Final</p><h2>Bandingkan. Pertimbangkan. Putuskan.</h2><p>AI memberi sinyal; bukti dan penalaranmu menentukan maknanya.</p></header>
    <div class="comparison"><div><span class="comparison-label">Penilaian awal saya</span><strong>${R(N.initialDecision)}</strong><p>Confidence: ${N.initialConfidence}%</p></div><div><span class="comparison-label">AI Lens</span><strong>${N.aiWrong?`Suspicious`:`Manipulation`} Signals: ${e.aiScore}%</strong><p>${R(e.aiNotices.slice(2).map(([e,t])=>`${e}: ${t}`).join(` · `))}</p></div></div>
    <div class="question"><span class="question-label">Setelah melihat bukti dan AI Lens, apa keputusanmu sekarang?</span><div class="choice-grid">${t.map(e=>Xe(e,N.finalDecision,`final-decision`)).join(``)}</div></div>
    <div class="question"><span class="question-label">Seberapa yakin kamu dengan keputusan final itu?</span>${Ye(`final-confidence`,N.finalConfidence)}</div>
    <div class="flow-actions"><button class="button button-ghost" data-action="back-to-ai">Kembali</button><button class="button button-teal" data-action="lock-final" ${N.finalDecision?``:`disabled`}>Kunci Keputusan Akhir</button></div>
  </div>`}function wt(){return`<div class="flow-card">
    <header><p class="section-kicker">Reflect &amp; Learn</p><h2>Apa yang Mengubah Pikiranmu?</h2><p>Refleksi membantu kamu mengenali pola yang dapat digunakan di situasi berikutnya.</p></header>
    <div class="question"><div class="question-label">Pilih paling banyak dua faktor. <span class="max-note">${N.reflection.length}/2 dipilih</span></div><div class="choice-grid compact">${[`Bukti / sumber`,`Emosi`,`Tekanan waktu`,`Risiko tindakan`,`Analisis AI`,`Verifikasi independen`,`Tidak berubah`].map(e=>Ze(e,N.reflection,`reflection`)).join(``)}</div></div>
    <div class="question"><span class="question-label">Jika AI bertentangan dengan bukti independen, mana yang seharusnya kamu prioritaskan?</span><div class="choice-grid">${[`AI`,`Bukti independen`,`Opini viral`,`Kanal resmi`,`Belum yakin`].map(e=>Xe(e,N.priority,`priority`)).join(``)}</div></div>
    ${N.priority&&![`Bukti independen`,`Kanal resmi`].includes(N.priority)?`<div class="insight"><div><strong>Berhenti sejenak.</strong><br>Pertimbangkan kembali sumber mana yang dapat diverifikasi secara independen.</div></div>`:``}
    <div class="flow-actions"><button class="button button-ghost" data-action="back-to-final">Kembali</button><button class="button button-teal" data-action="show-result" ${N.reflection.length&&N.priority?``:`disabled`}>Lihat Snapshot Nalar</button></div>
  </div>`}function Tt(){let e=ge(),t=[`Verifikasi Dulu`,`Berhenti`,`Saya tidak setuju dengan AI`,`Verifikasi lagi`].includes(N.finalDecision),n=[[`Mengenali tekanan`,N.pressure.length>1?88:76],[`Kesadaran emosi`,N.emotion.length>1?84:72],[`Pemeriksaan bukti`,N.evidence===e.preferredEvidence?92:70],[`Kesadaran risiko aksi`,N.saferAction?86:68]];return`<div class="flow-card">
    <header><p class="section-kicker">Critical Thinking Snapshot</p><h2>${N.aiWrong&&N.finalDecision===`Saya tidak setuju dengan AI`?`Penilaian baik. AI bukan otoritas final.`:`Pemeriksaan selesai.`}</h2><p>${t?`Kamu memberi ruang bagi bukti baru sebelum menentukan tindakan.`:`Snapshot ini menunjukkan area yang bisa diperkuat pada pemeriksaan berikutnya.`}</p></header>
    <div class="skill-list">${n.map(([e,t])=>`<div class="skill-row"><span>${e}</span><div class="skill-bar"><i style="width:${t}%"></i></div><b>${t}</b></div>`).join(``)}</div>
    <div class="before-after"><div class="snapshot-box"><small>Sebelum</small><strong>${R(N.initialDecision)} - ${N.initialConfidence}% yakin</strong></div><span class="arrow" aria-hidden="true">&#8594;</span><div class="snapshot-box after"><small>Sesudah</small><strong>${R(N.finalDecision)} - ${N.finalConfidence}% yakin</strong></div></div>
    <p class="learning-message"><strong>Perubahan keputusan bukan kelemahan.</strong> Itu tanda kamu memasukkan bukti baru ke dalam penilaian.</p>
    <div class="flow-actions"><button class="button button-ghost" data-action="restart-flow">Periksa Lagi</button><a class="button" href="#/training">Lanjut Latihan</a></div>
  </div>`}var Et=[`Keluarga`,`Dewasa & Lansia`,`Sekolah`,`Komunitas Umum`],Dt=[`30 menit`,`60 menit`,`90 menit`],Ot=[{id:`family`,title:`Keluarga & Keuangan`,format:`Teks + Voice Note`,caseTitle:`Pesan Keluarga Darurat`,content:ae,note:`Fokus pada urgency, identitas, dan transfer yang sulit dibatalkan.`},{id:`public`,title:`Hoaks di Ruang Publik`,format:`Screenshot + Video`,caseTitle:`Informasi Viral`,content:`Mereka tidak ingin kamu tahu fakta ini. Sebarkan sekarang sebelum unggahan dihapus!`,note:`Fokus pada sumber primer, konteks, dan tekanan untuk membagikan.`},{id:`transaction`,title:`Aman Bertransaksi`,format:`QR + Tautan`,caseTitle:`QR Pembayaran`,content:`QR di meja kasir sedang bermasalah. Scan kode baru ini agar pembayaran langsung diproses.`,note:`Fokus pada penerima, domain tujuan, dan kanal pembayaran resmi.`}],kt=[[`urgency`,`Urgency`,`Waktu dipersempit agar korban bertindak sebelum berpikir.`],[`authority`,`Authority`,`Nama, seragam, atau institusi dipakai untuk meminjam kepercayaan.`],[`fear`,`Fear`,`Ancaman kerugian atau keadaan darurat memancing kepanikan.`],[`social`,`Social Pressure`,`Viralitas dan perilaku orang lain dipakai sebagai pengganti bukti.`]],At={family:[{letter:`J`,title:`Jeda`,prompt:`Bagian mana yang paling mempersempit waktu berpikir?`,instruction:`Letakkan tiga Kartu Kutipan di seberang garis. Penjaga J mengambil satu kartu sebelum timer habis.`,options:[`Transfer Rp3 juta sekarang`,`HP Mama rusak`,`Nomor rekening ini`],correct:0,insight:`Kata 'sekarang' mendorong tindakan sebelum identitas dikonfirmasi.`},{letter:`E`,title:`Emosi`,prompt:`Emosi utama apa yang sedang dimanfaatkan?`,instruction:`Buat tiga zona emosi di lantai. Tim Hadang berpindah bersama ke zona pilihannya.`,options:[`Takut dan panik`,`Bangga`,`Bosan`],correct:0,insight:`Keadaan darurat keluarga memanfaatkan rasa takut dan tanggung jawab.`},{letter:`D`,title:`Data`,prompt:`Bukti independen mana yang paling kuat?`,instruction:`Sebar tiga Kartu Bukti di ruangan. Penjaga D mengambil bukti terkuat dan membawanya ke garis.`,options:[`Voice note nomor baru`,`Telepon nomor Mama yang tersimpan`,`Foto profil pengirim`],correct:1,insight:`Konfirmasi lewat kanal yang sudah dikenal lebih kuat daripada bukti dari pengirim yang sama.`},{letter:`A`,title:`Aksi`,prompt:`Tindakan paling aman sebelum transfer adalah...`,instruction:`Warga berdiri di salah satu Zona Keputusan: Lanjut, Verifikasi, atau Berhenti.`,options:[`Transfer sebagian dulu`,`Hubungi keluarga lewat kanal lain`,`Balas dan minta foto`],correct:1,insight:`Pindah kanal dan konfirmasi identitas sebelum melakukan tindakan finansial.`}],public:[{letter:`J`,title:`Jeda`,prompt:`Frasa mana yang mendorong kita menyebarkan tanpa memeriksa?`,instruction:`Penjaga J memilih Kartu Kutipan dan menaruhnya di garis.`,options:[`Sebarkan sekarang sebelum dihapus`,`Informasi ini sedang ramai`,`Ada unggahan baru`],correct:0,insight:`Ancaman penghapusan menciptakan kelangkaan waktu palsu.`},{letter:`E`,title:`Emosi`,prompt:`Emosi apa yang paling mungkin mendorong tombol share?`,instruction:`Peserta bergerak ke Zona Emosi yang paling sesuai lalu menyebut alasannya.`,options:[`Marah dan curiga`,`Tenang`,`Bingung ringan`],correct:0,insight:`Kemarahan membuat klaim terasa layak dibagikan sebelum sumbernya jelas.`},{letter:`D`,title:`Data`,prompt:`Apa pemeriksaan paling independen untuk klaim viral?`,instruction:`Penjaga D mengambil satu Kartu Bukti dari sisi ruangan.`,options:[`Jumlah share`,`Komentar yang setuju`,`Sumber primer dan laporan pembanding`],correct:2,insight:`Viralitas bukan bukti; sumber primer dan pembanding memberi konteks.`},{letter:`A`,title:`Aksi`,prompt:`Apa tindakan aman ketika konteks belum lengkap?`,instruction:`Warga berpindah ke Zona Keputusan sebelum timer habis.`,options:[`Bagikan dengan tanda tanya`,`Tunda dan cari konteks`,`Kirim ke grup keluarga`],correct:1,insight:`Menunda share mencegah klaim tanpa konteks menyebar lebih jauh.`}],transaction:[{letter:`J`,title:`Jeda`,prompt:`Apa yang membuat orang ingin langsung memindai QR?`,instruction:`Penjaga J mengambil Kartu Pemicu yang paling tepat.`,options:[`Antrean dan ingin cepat selesai`,`Warna stiker`,`Ukuran kode`],correct:0,insight:`Kebiasaan dan tekanan antrean dapat mengurangi pemeriksaan penerima.`},{letter:`E`,title:`Emosi`,prompt:`Kondisi apa yang sedang dimanfaatkan?`,instruction:`Tim bergerak ke Zona Emosi lalu menjelaskan pilihannya.`,options:[`Nyaman dan terburu-buru`,`Sedih`,`Bangga`],correct:0,insight:`Rasa nyaman pada rutinitas pembayaran dapat menurunkan kewaspadaan.`},{letter:`D`,title:`Data`,prompt:`Bukti terkuat bahwa QR memang resmi adalah...`,instruction:`Penjaga D memilih satu Kartu Bukti dan menyerahkannya kepada Warga.`,options:[`Logo pada stiker`,`Konfirmasi kasir dan nama penerima`,`QR terlihat baru`],correct:1,insight:`Konfirmasi kasir dan identitas penerima lebih kuat daripada tampilan stiker.`},{letter:`A`,title:`Aksi`,prompt:`Apa yang harus dilakukan sebelum menyelesaikan pembayaran?`,instruction:`Warga memilih Zona Keputusan secara fisik.`,options:[`Masukkan PIN secepatnya`,`Periksa nama penerima`,`Foto QR untuk nanti`],correct:1,insight:`Nama penerima harus sesuai sebelum transaksi yang sulit dibatalkan.`}]},jt=[`Lanjut`,`Verifikasi Dulu`,`Berhenti`,`Belum Yakin`],V={mode:`setup`,playMode:`offline`,audience:`Dewasa & Lansia`,duration:`60 menit`,packId:`family`,participants:24,teamArus:`Tim Arus`,teamHadang:`Tim Hadang`,round:1,scores:{arus:0,hadang:0},phase:0,lineIndex:0,lineResults:[],selectedAnswer:null,lineResolved:!1,timerRemaining:30,timerRunning:!1,pressureUsed:!1,revealedTactic:``,prepChecks:[],votes:{initial:[0,0,0,0],final:[0,0,0,0]},finalBonusApplied:!1,completedLines:[],visionUsed:!1},Mt=0;function Nt(){clearInterval(Mt),Mt=0,V.timerRunning=!1}function Pt(){return Ot.find(e=>e.id===V.packId)||Ot[0]}function Ft(){return`<section class="page-hero community-hero"><div class="page-shell"><p class="eyebrow">HADANGIN &middot; Arena Komunitas</p><h1>Satu Tim Meloloskan. Satu Tim Menghadang.</h1><p>Website menjadi game master untuk permainan fisik Gobak Sodor literasi digital. Tim Arus membawa informasi menuju tindakan, sementara Tim Hadang menjaga empat garis J.E.D.A.</p></div></section>
    ${V.mode===`setup`?Lt():V.mode===`prepare`?Rt():V.mode===`vision`?Vt():zt()}`}function It(e=!1){return`<details class="community-play-guide" ${e?`open`:``}>
    <summary><span><small>Panduan fasilitator</small><strong>Cara memainkan Arena Offline</strong></span><i>${e?`Baca sebelum mulai`:`Lihat alur, fungsi kartu, dan skor`}</i></summary>
    <div class="community-play-guide-body">
      <section class="community-guide-flow" aria-labelledby="community-guide-flow-title">
        <div class="community-guide-heading"><span>01</span><div><h3 id="community-guide-flow-title">Alur satu ronde</h3><p>Website dipegang fasilitator. Peserta bergerak, berdiskusi, dan mengangkat kartu fisik.</p></div></div>
        <ol>
          <li><span>1</span><div><strong>Siapkan arena dan peran</strong><p>Tempel penanda J, E, D, A berurutan. Bagi peserta menjadi Tim Arus, Tim Hadang, dan Warga.</p></div></li>
          <li><span>2</span><div><strong>Voting awal</strong><p>Fasilitator menampilkan kasus. Semua Warga mengangkat Kartu Keputusan tanpa berdiskusi; jumlahnya dicatat di website.</p></div></li>
          <li><span>3</span><div><strong>Tim Arus mulai bergerak</strong><p>Strategist mengambil satu Kartu Taktik secara rahasia. Runner membawa Token Informasi dari MASUK menuju TINDAKAN.</p></div></li>
          <li><span>4</span><div><strong>Hadang di empat garis</strong><p>Di setiap garis, Tim Hadang punya 30 detik untuk membahas pertanyaan dan memilih jawaban. Tim Arus boleh memakai tekanan -5 detik satu kali, lalu fasilitator mengunci jawaban.</p></div></li>
          <li><span>5</span><div><strong>Buka taktik dan AI Lens</strong><p>Setelah garis A, Tim Arus membuka Kartu Taktik. Fasilitator memilih kartu yang sama agar pola manipulasi dijelaskan.</p></div></li>
          <li><span>6</span><div><strong>Voting akhir dan tukar peran</strong><p>Warga memilih ulang, lalu kelompok membahas perubahan keputusan. Tukar Tim Arus dan Tim Hadang sebelum ronde berikutnya.</p></div></li>
        </ol>
      </section>
      <section class="community-guide-cards" aria-labelledby="community-guide-cards-title">
        <div class="community-guide-heading"><span>02</span><div><h3 id="community-guide-cards-title">Fungsi kit cetak</h3><p>Potong kartu sebelum sesi dan bagikan sesuai peran berikut.</p></div></div>
        <dl>
          <div><dt>Token Informasi</dt><dd>Dibawa Runner dan dipindahkan satu garis setelah setiap tantangan selesai.</dd></div>
          <div><dt>Kartu J.E.D.A.</dt><dd>Diletakkan di garis Jeda, Emosi, Data, dan Aksi sebagai pengingat pertanyaan.</dd></div>
          <div><dt>Kartu Taktik</dt><dd>Dipegang Strategist Tim Arus secara rahasia dan dibuka setelah empat garis.</dd></div>
          <div><dt>Kartu Keputusan</dt><dd>Satu set untuk setiap Warga: Lanjut, Verifikasi, Berhenti, atau Belum Yakin.</dd></div>
          <div><dt>Penanda garis</dt><dd>Ditempel di lantai dengan selotip untuk membentuk jalur MASUK sampai TINDAKAN.</dd></div>
        </dl>
      </section>
      <aside class="community-guide-rules">
        <div><span>SKOR</span><p><b>Tim Hadang +1</b> jika jawaban benar. <b>Tim Arus +1</b> jika jawaban salah atau waktu habis. Keputusan aman terbanyak pada voting akhir memberi Tim Hadang <b>bonus +2</b>.</p></div>
        <div><span>BEST PRACTICE</span><p>Untuk 8-24 peserta: tempatkan 2-4 orang di Tim Arus, 4 penjaga di Tim Hadang, dan peserta lain sebagai Warga. Mainkan dua ronde agar tim bertukar peran. Gunakan kasus yang tersedia, tanpa data pribadi dan tanpa kontak fisik.</p></div>
      </aside>
    </div>
  </details>`}function Lt(){let e=Pt(),t=V.playMode===`vision`;return`<section class="section community-workspace"><div class="page-shell community-setup-layout">
    <section class="community-builder" aria-labelledby="community-builder-title">
      <header><p class="section-kicker">Arena Komunitas</p><h2 id="community-builder-title">Pilih cara bermain</h2><p>Arena Offline memakai dua tim dan perlengkapan fisik. Arena Kamera AI memakai gerakan tubuh satu penjaga aktif.</p></header>
      ${It(!1)}
      <div class="community-field"><span class="community-field-label">Kelompok peserta</span><div class="community-choice-row">${Et.map(e=>`<button type="button" class="${V.audience===e?`active`:``}" data-community-audience="${R(e)}">${R(e)}</button>`).join(``)}</div></div>
      <div class="community-field"><span class="community-field-label">Durasi sesi</span><div class="community-segmented">${Dt.map(e=>`<button type="button" class="${V.duration===e?`active`:``}" data-community-duration="${R(e)}">${R(e)}</button>`).join(``)}</div></div>
      <div class="community-field"><span class="community-field-label">Paket kasus</span><div class="community-pack-grid">${Ot.map(e=>`<button type="button" class="community-pack ${V.packId===e.id?`active`:``}" data-community-pack="${e.id}"><span>${R(e.format)}</span><strong>${R(e.title)}</strong><small>${R(e.note)}</small></button>`).join(``)}</div></div>
      <div class="community-field"><span class="community-field-label">Mode permainan</span><div class="community-mode-grid">
        <button type="button" class="community-mode-card ${t?``:`active`}" data-community-mode="offline"><span class="community-mode-icon manual" aria-hidden="true">J</span><span><b>Arena Offline</b><small>Dua tim bergerak di lapangan fisik. Website mengatur kasus, timer, pertanyaan, dan skor.</small></span><i>Mode utama</i></button>
        <button type="button" class="community-mode-card ${t?`active`:``}" data-community-mode="vision"><span class="community-mode-icon" aria-hidden="true">CV</span><span><b>Arena Kamera AI</b><small>Satu penjaga aktif melakukan pose Hadang. Computer Vision membaca gerakan langsung di perangkat.</small></span><i>Beta</i></button>
      </div></div>
      ${t?`<div class="community-vision-setup-note"><span>CV</span><p><b>Posisi bermain</b>Satu peserta berdiri sekitar 2 meter dari kamera. Peserta lain mendiskusikan pertanyaan J.E.D.A. dan bergantian menjadi penjaga.</p></div>`:`<div class="community-team-fields"><label><span>Nama tim pembawa informasi</span><input id="community-team-arus" maxlength="24" value="${R(V.teamArus)}" /></label><label><span>Nama tim penjaga nalar</span><input id="community-team-hadang" maxlength="24" value="${R(V.teamHadang)}" /></label></div>`}
      <label class="community-number-field" for="community-participants"><span>Perkiraan peserta</span><input id="community-participants" type="number" min="4" max="120" value="${V.participants}" inputmode="numeric" /><small>4-120 orang</small></label>
      <button class="button community-start-button" type="button" data-action="start-community">${t?`Buka Arena Kamera AI`:`Siapkan Arena Offline`} <span aria-hidden="true">&#8594;</span></button>
    </section>
    <aside class="community-session-preview" aria-label="Ringkasan sesi yang akan dibuat">
      <div class="community-preview-head"><span>Pratinjau ${t?`Arena Kamera`:`pertandingan`}</span><i>${t?`AI lokal &middot; Tanpa rekaman`:`1 layar &middot; Tanpa login`}</i></div>
      <div class="community-preview-case"><small>Kasus pembuka</small><strong>${R(e.caseTitle)}</strong><blockquote>${R(e.content)}</blockquote></div>
      <dl><div><dt>Peserta</dt><dd>${R(V.audience)}</dd></div><div><dt>Durasi</dt><dd>${R(V.duration)}</dd></div><div><dt>Format</dt><dd>${R(e.format)}</dd></div><div><dt>Peralatan</dt><dd>${t?`Laptop, webcam, ruang gerak 2 meter`:`Laptop, proyektor, kartu, selotip`}</dd></div></dl>
      <div class="community-preview-path"><span>Vote</span><i></i><span>${t?`Pose J.E.D.A.`:`Arena`}</span><i></i><span>${t?`Vote Ulang`:`Reveal`}</span><i></i><span>Debrief</span></div>
      <p>${t?`Video diproses lokal di browser untuk membaca pose. Tidak direkam atau dikirim ke server.`:`Tim Arus memakai skenario yang sudah disediakan. Peserta tidak diminta membuat hoaks baru.`}</p>
    </aside>
  </div></section>`}function Rt(){let e=[`Empat garis sudah dibuat`,`Kartu permainan sudah dipotong`,`Peran kedua tim sudah dibagi`,`Layar dapat dilihat semua peserta`],t=V.prepChecks.length===e.length;return`<section class="section community-workspace"><div class="page-shell offline-prep">
    <header class="offline-prep-head"><div><p class="section-kicker">Persiapan &middot; sekitar 5 menit</p><h2>Bangun lapangan J.E.D.A.</h2><p>Buat empat garis dengan selotip. Tim Arus mulai dari sisi MASUK dan membawa Token Informasi menuju Zona Tindakan.</p></div><div class="offline-prep-actions"><button class="button button-secondary" data-action="print-community-kit">Cetak Kartu &amp; Penanda</button><button class="button button-ghost" data-action="download-community-kit">Unduh Panduan</button><button class="button button-ghost" data-action="reset-community">Ubah Pengaturan</button></div></header>
    <div class="offline-prep-grid"><figure class="offline-kit-visual"><img src="${oe}" alt="Perlengkapan Arena Hadang berupa kartu J.E.D.A., token Informasi, kartu keputusan, selotip, dan papan skor" /><figcaption><strong>Kit Arena Hadang</strong><span>Kartu J.E.D.A., kartu keputusan, kartu taktik, Token Informasi, dan penanda garis.</span></figcaption></figure>
      <section class="offline-court-plan"><div class="offline-court-title"><span>Denah ruangan</span><b>Minimal 3 x 6 meter</b></div><div class="offline-court-track"><span>MASUK</span>${[`J`,`E`,`D`,`A`].map(e=>`<i><b>${e}</b></i>`).join(``)}<span>TINDAKAN</span><em>Token Informasi bergerak ke arah ini &#8594;</em></div><div class="offline-role-grid"><div><span>1</span><p><b>Tim Arus</b>Runner membawa token; Strategist memainkan Kartu Taktik.</p></div><div><span>4</span><p><b>Tim Hadang</b>Satu penjaga untuk setiap garis J.E.D.A.</p></div><div><span>1</span><p><b>Warga</b>Mengambil keputusan akhir di Zona Tindakan.</p></div></div></section>
    </div>
    ${It(!0)}
    <section class="offline-ready-check"><div><p class="section-kicker">Checklist fasilitator</p><h3>Pastikan arena siap sebelum ditampilkan ke peserta.</h3></div><div class="offline-check-list">${e.map((e,t)=>`<button type="button" class="${V.prepChecks.includes(t)?`complete`:``}" data-community-prep="${t}"><span>${V.prepChecks.includes(t)?`&#10003;`:t+1}</span>${e}</button>`).join(``)}</div><button class="button" type="button" data-action="community-next" ${t?``:`disabled`}>Mulai Voting Awal &#8594;</button></section>
  </div></section>`}function zt(){let e=[`Voting Awal`,`Arena Hadang`,`Reveal`,`Voting Akhir`,`Debrief`],t=Pt();return`<section class="community-live"><div class="page-shell">
    <div class="community-live-topbar"><div><span>Ronde</span><strong>0${V.round}</strong><small>Arena offline &middot; Host lokal</small></div><div class="community-phase-track">${e.map((e,t)=>`<span class="${t<V.phase?`done`:t===V.phase?`active`:``}">${t<V.phase?`&#10003;`:t+1}<small>${e}</small></span>`).join(``)}</div><button class="button button-ghost button-small" type="button" data-action="reset-community">Akhiri Sesi</button></div>
    <div class="offline-scoreboard"><div class="arus"><span>PEMBAWA INFORMASI</span><strong>${R(V.teamArus)}</strong><b>${V.scores.arus}</b></div><i>VS</i><div class="hadang"><span>PENJAGA NALAR</span><strong>${R(V.teamHadang)}</strong><b>${V.scores.hadang}</b></div></div>
    ${Wt(t)}
  </div></section>`}function Bt(e){let t=V.votes[e],n=t.reduce((e,t)=>e+t,0);return`<div class="offline-vote-board">${jt.map((n,r)=>`<div><span>${R(n)}</span><button type="button" data-community-vote="${e}:${r}:-1" aria-label="Kurangi ${R(n)}">&minus;</button><strong>${t[r]}</strong><button type="button" data-community-vote="${e}:${r}:1" aria-label="Tambah ${R(n)}">+</button></div>`).join(``)}<p><b>${n}</b> suara tercatat &middot; Hitung kartu yang diangkat peserta, lalu masukkan jumlahnya.</p></div>`}function Vt(){let e=[`Voting Awal`,`Arena Kamera`,`Voting Akhir`,`Debrief`],t=Pt();return`<section class="community-live"><div class="page-shell">
    <div class="community-live-topbar vision-community-topbar"><div><span>Mode beta</span><strong>CV-204</strong><small>Arena Kamera AI &middot; Proses lokal</small></div><div class="community-phase-track">${e.map((e,t)=>`<span class="${t<V.phase?`done`:t===V.phase?`active`:``}">${t<V.phase?`&#10003;`:t+1}<small>${e}</small></span>`).join(``)}</div><button class="button button-ghost button-small" type="button" data-action="reset-community">Akhiri Sesi</button></div>
    ${Ht(t)}
  </div></section>`}function Ht(e){if(V.phase===0)return`<div class="community-stage-layout"><section class="community-projection"><div class="projection-label"><span>Kasus untuk peserta</span><b>${R(e.format)}</b></div><p class="projection-source">${R(e.caseTitle)}</p><blockquote>${R(e.content)}</blockquote><div class="projection-question">Apa respons pertamamu sebelum mendapat petunjuk?</div></section><aside class="community-facilitator-panel"><p class="section-kicker">Voting tanpa petunjuk</p><h2>Catat respons awal</h2><p>Peserta mengangkat kartu keputusan. Kamera belum digunakan pada tahap ini.</p>${Bt(`initial`)}<button class="button" type="button" data-action="community-vision-next">Masuk Arena Kamera &#8594;</button></aside></div>`;if(V.phase===1)return Ut(At[V.packId].map(({letter:e,title:t,prompt:n})=>[e,t,n]));if(V.phase===2)return`<div class="community-stage-layout"><section class="community-projection final"><div class="projection-label"><span>Human Final</span><b>Setelah empat pose</b></div><h2>Apakah keputusan kelompok berubah?</h2><p>Computer Vision hanya memastikan pose tubuh. Alasan, bukti, dan keputusan tetap berasal dari diskusi peserta.</p><div class="offline-decision-zones"><span>Lanjut</span><span>Verifikasi</span><span>Berhenti</span><span>Belum Yakin</span></div></section><aside class="community-facilitator-panel"><p class="section-kicker">Voting akhir</p><h2>Hitung kartu peserta</h2>${Bt(`final`)}<button class="button button-teal" type="button" data-action="community-vision-next">Lihat Debrief &#8594;</button></aside></div>`;let t=V.votes.initial.reduce((e,t)=>e+t,0),n=V.votes.final.reduce((e,t)=>e+t,0),r=t?Math.round(V.votes.initial[0]/t*100):0,i=n?Math.round((V.votes.final[1]+V.votes.final[2])/n*100):0;return`<section class="community-debrief"><header><p class="section-kicker">Ringkasan Arena Kamera AI</p><h2>Gerak tubuh membuka ruang untuk berpikir bersama.</h2><p>Pose mengaktifkan setiap garis, tetapi peserta tetap harus menjelaskan tekanan, emosi, bukti, dan tindakan aman sesuai kasus.</p></header><div class="community-impact-grid"><article><span>Pose Hadang</span><strong>${V.completedLines.length}/4</strong><p>Empat garis J.E.D.A. diselesaikan bergantian.</p></article><article><span>Risiko awal</span><strong>${r}%</strong><p>Peserta yang semula memilih langsung lanjut.</p></article><article><span>Keputusan aman</span><strong>${i}%</strong><p>Peserta memilih verifikasi atau berhenti pada voting akhir.</p></article></div><div class="community-learning"><div><strong>Apa yang dibaca AI?</strong><p>Posisi titik tubuh untuk mengenali pose kedua tangan terangkat. Video diproses lokal dan tidak disimpan.</p></div><div><strong>Apa yang dinilai manusia?</strong><p>Kualitas alasan, bukti independen, dan keputusan aman. AI tidak menentukan benar atau salahnya peserta.</p></div></div><div class="community-stage-actions"><button class="button button-secondary" type="button" data-action="download-community-kit">Unduh Panduan</button><button class="button" type="button" data-action="reset-community">Buat Sesi Baru</button></div></section>`}function Ut(e){let t=e.findIndex(([e])=>!V.completedLines.includes(e)),n=t===-1?e.length:t,r=e[n]||[``,`Arena selesai`,`Semua garis nalar berhasil dihadang.`],i=n===e.length;return`<section class="community-vision-stage" data-current-vision-line="${r[0]}">
    <header class="community-vision-heading"><div><p class="section-kicker">Virtual Gobak Sodor &middot; AI Computer Vision</p><h2>Hadang informasi dengan gerakan tubuh.</h2><p>Satu penjaga berdiri di depan kamera. Kelompok membahas pertanyaan kasus, lalu penjaga mengangkat kedua tangan untuk mengunci garis.</p></div><span class="vision-privacy-badge">Diproses lokal &middot; Tidak direkam</span></header>
    <div class="community-vision-layout">
      <div class="vision-game-board">
        <video id="community-vision-video" muted playsinline aria-label="Preview kamera pemain"></video>
        <canvas id="community-vision-canvas" aria-hidden="true"></canvas>
        <div class="vision-camera-empty"><span>CV</span><strong>Kamera belum aktif</strong><small>Aktifkan saat penjaga sudah siap di depan layar.</small></div>
        <div class="vision-court" aria-hidden="true">${e.map(([e,t],r)=>`<div class="vision-court-line ${r<n?`complete`:r===n?`active`:``}"><i></i><span>${e}<small>${t}</small></span></div>`).join(``)}</div>
        <div class="vision-player-marker" id="vision-player-marker" aria-hidden="true"><i></i><span>PENJAGA</span></div>
        <div class="vision-hud"><span class="vision-status-dot" data-vision-status="idle"></span><strong id="vision-status-text">Kamera tidak aktif</strong></div>
        <div class="vision-motion-meter"><i id="vision-hold-meter"></i><span id="vision-motion-label">Angkat kedua tangan untuk Hadang</span></div>
      </div>
      <aside class="vision-coach-panel">
        <div class="vision-coach-top"><span>GARIS AKTIF</span><b>${i?`SELESAI`:`0${n+1} / 04`}</b></div>
        <div class="vision-current-prompt"><span>${r[0]||`&#10003;`}</span><div><small>${R(r[1])}</small><h3>${R(r[2])}</h3></div></div>
        <ol class="vision-station-list">${e.map(([e,t],r)=>`<li class="${V.completedLines.includes(e)?`complete`:r===n?`active`:``}"><span>${e}</span><b>${t}</b><i>${V.completedLines.includes(e)?`Selesai`:r===n?`Giliran ini`:`Menunggu`}</i></li>`).join(``)}</ol>
        <div class="vision-instructions"><strong>Cara bermain</strong><p>1. Berdiri hingga skeleton muncul.<br>2. Bahas pertanyaan garis aktif.<br>3. Angkat kedua tangan selama 1 detik.</p></div>
        <button class="button vision-camera-button" type="button" data-action="toggle-community-camera">${re()?`Matikan Kamera`:`Aktifkan Kamera AI`}</button>
        ${i?``:`<button class="vision-manual-fallback" type="button" data-community-line="${r[0]}">Tandai manual</button>`}
      </aside>
    </div>
    <div class="community-stage-actions"><span>${V.completedLines.length} dari 4 garis berhasil dihadang</span><button class="button" type="button" data-action="community-vision-next" ${i?``:`disabled`}>Buka Voting Akhir &#8594;</button></div>
  </section>`}function Wt(e){if(V.phase===0)return`<div class="community-stage-layout"><section class="community-projection"><div class="projection-label"><span>Kasus untuk Warga</span><b>${R(e.format)}</b></div><p class="projection-source">${R(e.caseTitle)}</p><blockquote>${R(e.content)}</blockquote><div class="projection-question">Angkat Kartu Keputusan: apa respons pertamamu?</div></section><aside class="community-facilitator-panel"><p class="section-kicker">Voting tanpa petunjuk</p><h2>Hitung kartu peserta</h2><p>Jangan bahas jawabannya dulu. Catat respons spontan kelompok sebelum Tim Arus mulai bergerak.</p>${Bt(`initial`)}<button class="button" type="button" data-action="community-next">Lepaskan Tim Arus &#8594;</button></aside></div>`;if(V.phase===1)return Gt(e);if(V.phase===2){let e=kt.find(([e])=>e===V.revealedTactic);return`<section class="offline-reveal"><header><p class="section-kicker">Buka kartu &middot; AI Lens sebagai wasit penjelas</p><h2>Taktik apa yang dipakai Tim Arus?</h2><p>Tim Arus membuka kartu fisiknya. Fasilitator memilih kartu yang sama agar website menampilkan penjelasan.</p></header><div class="offline-tactic-grid">${kt.map(([e,t,n])=>`<button type="button" class="${V.revealedTactic===e?`active`:``}" data-community-tactic="${e}"><span>${t}</span><p>${n}</p></button>`).join(``)}</div>${e?`<div class="offline-ai-reveal"><span>AI LENS</span><div><strong>${e[1]} terdeteksi sebagai pola manipulasi</strong><p>${e[2]} AI hanya membuka pola setelah manusia bermain; keputusan dan skor tetap berasal dari peserta.</p></div></div>`:`<div class="offline-reveal-placeholder">Pilih kartu yang digunakan untuk membuka penjelasan AI.</div>`}<div class="offline-round-recap">${V.lineResults.map((e,t)=>`<div class="${e.outcome}"><span>${e.letter}</span><b>${e.outcome===`blocked`?`DIHADANG`:`LOLOS`}</b><p>${R(e.insight)}</p></div>`).join(``)}</div><div class="community-stage-actions"><button class="button" data-action="community-next" ${e?``:`disabled`}>Lanjut Voting Akhir &#8594;</button></div></section>`}if(V.phase===3)return`<div class="community-stage-layout"><section class="community-projection final"><div class="projection-label"><span>Human Final</span><b>Angkat kartu sekali lagi</b></div><h2>Setelah empat garis, apakah keputusanmu berubah?</h2><p>Warga dan seluruh peserta memilih ulang tanpa mengikuti keputusan tim lain.</p><div class="offline-decision-zones"><span>Lanjut</span><span>Verifikasi</span><span>Berhenti</span><span>Belum Yakin</span></div></section><aside class="community-facilitator-panel"><p class="section-kicker">Voting setelah permainan</p><h2>Hitung kartu peserta</h2>${Bt(`final`)}<button class="button button-teal" type="button" data-action="community-next">Lihat Debrief &#8594;</button></aside></div>`;let t=V.votes.initial.reduce((e,t)=>e+t,0),n=V.votes.final.reduce((e,t)=>e+t,0),r=t?Math.round(V.votes.initial[0]/t*100):0,i=n?Math.round((V.votes.final[1]+V.votes.final[2])/n*100):0;return`<section class="community-debrief"><header><p class="section-kicker">Ringkasan ronde 0${V.round}</p><h2>${V.scores.hadang>=V.scores.arus?`${R(V.teamHadang)} menjaga nalar lebih kuat.`:`${R(V.teamArus)} berhasil memberi tekanan.`}</h2><p>Skor membuat permainan kompetitif; debrief memastikan setiap taktik berubah menjadi pelajaran yang dapat dipakai di dunia nyata.</p></header><div class="community-impact-grid"><article><span>Risiko awal</span><strong>${r}%</strong><p>Peserta memilih langsung lanjut sebelum melewati J.E.D.A.</p></article><article><span>Keputusan aman</span><strong>${i}%</strong><p>Peserta memilih verifikasi atau berhenti setelah bermain.</p></article><article><span>Skor ronde</span><strong>${V.scores.arus}:${V.scores.hadang}</strong><p>${R(V.teamArus)} vs ${R(V.teamHadang)}</p></article></div><div class="community-learning"><div><strong>Debrief Tim Arus</strong><p>Taktik mana yang paling mudah membuat orang bereaksi? Mengapa tekanan itu terasa meyakinkan?</p></div><div><strong>Debrief Tim Hadang</strong><p>Garis mana yang paling sulit dijaga? Bukti apa yang benar-benar mengubah keputusan Warga?</p></div></div><div class="community-stage-actions"><button class="button button-secondary" type="button" data-action="print-community-kit">Cetak Kit Permainan</button><button class="button" type="button" data-action="community-swap-round">Tukar Peran &amp; Ronde Baru</button></div></section>`}function Gt(){let e=At[V.packId],t=e[V.lineIndex],n=V.lineResults[V.lineIndex];return`<section class="offline-arena-stage"><div class="offline-arena-board"><div class="offline-arena-hud"><span>RONDE 0${V.round}</span><strong>GARIS ${t.letter} &middot; ${t.title.toUpperCase()}</strong><b id="community-timer">00:${String(V.timerRemaining).padStart(2,`0`)}</b></div><div class="offline-digital-court"><span class="court-start">MASUK</span>${e.map((e,t)=>`<div class="offline-line ${t<V.lineIndex||V.lineResults[t]?V.lineResults[t]?.outcome||`complete`:t===V.lineIndex?`active`:``}"><i></i><b>${e.letter}</b><small>${e.title}</small></div>`).join(``)}<span class="court-action">TINDAKAN</span><div class="offline-info-token" style="--position:${12+V.lineIndex*21}%"><b>INFO</b><small>${n?.outcome===`blocked`?`TERHADANG`:`BERGERAK`}</small></div></div><div class="offline-arena-message"><span>AKSI FISIK</span><p>${R(t.instruction)}</p></div></div>
    <aside class="offline-facilitator-console"><div class="offline-console-head"><span>Kontrol fasilitator</span><b>0${V.lineIndex+1}/04</b></div><h2>${R(t.prompt)}</h2><div class="offline-answer-options">${t.options.map((e,n)=>`<button type="button" class="${V.selectedAnswer===n?`selected`:``} ${V.lineResolved?n===t.correct?`correct`:V.selectedAnswer===n?`wrong`:``:``}" data-community-answer="${n}" ${V.lineResolved?`disabled`:``}><span>${String.fromCharCode(65+n)}</span>${R(e)}</button>`).join(``)}</div>${V.lineResolved?`<div class="offline-answer-feedback ${n.outcome}"><strong>${n.outcome===`blocked`?`Berhasil dihadang`:`Informasi lolos`}</strong><p>${R(t.insight)}</p></div>`:`<div class="offline-arena-controls"><button class="button button-secondary" type="button" data-action="community-timer">${V.timerRunning?`Jeda Timer`:V.timerRemaining<30?`Lanjut Timer`:`Mulai Timer`}</button><button class="button pressure-button" type="button" data-action="community-pressure" ${V.pressureUsed?`disabled`:``}>Tim Arus: -5 detik</button><button class="button" type="button" data-action="community-lock-answer" ${V.selectedAnswer===null?`disabled`:``}>Kunci Jawaban</button></div>`}${V.lineResolved?`<button class="button offline-next-line" type="button" data-action="community-next-line">${V.lineIndex===3?`Buka Taktik & AI Lens`:`Lanjut ke Garis Berikutnya`} &#8594;</button>`:``}<p class="offline-console-note">Peserta bergerak dan memilih kartu fisik. Fasilitator mencatat pilihan yang sama di layar.</p></aside>
  </section>`}function Kt(){let e=Pt(),t=De()===`en`,n=e=>t?ke(e):e,r=`PANDUAN ARENA KAMERA AI (BETA)\n\nAudiens: ${V.audience}\nDurasi: ${V.duration}\nPeserta: ${V.participants}\nPaket: ${e.title}\nKasus: ${e.caseTitle}\n\nPERALATAN\nLaptop dengan webcam, layar yang dapat dilihat kelompok, dan ruang gerak sekitar 2 meter.\n\nALUR\n1. Lakukan voting awal tanpa petunjuk.\n2. Pilih satu penjaga untuk berdiri di depan kamera.\n3. Kelompok membahas pertanyaan pada garis Jeda, Emosi, Data, dan Aksi.\n4. Penjaga mengangkat kedua tangan selama satu detik untuk mengunci garis.\n5. Ganti penjaga pada garis berikutnya agar peserta bergiliran.\n6. Lakukan voting akhir dan debrief.\n\nPRIVASI DAN AKSESIBILITAS\nPose diproses lokal di browser; video tidak direkam atau dikirim ke server. Gunakan tombol Tandai manual bagi peserta yang tidak dapat atau tidak ingin melakukan pose. AI hanya membaca pose dan tidak menilai kualitas jawaban.\n`,i=`PANDUAN ARENA HADANG OFFLINE\n\nAudiens: ${V.audience}\nDurasi: ${V.duration}\nPeserta: ${V.participants}\nPaket: ${e.title}\nKasus: ${e.caseTitle}\n\nPERALATAN\nLaptop dan proyektor, selotip lantai, Token Informasi, kartu J.E.D.A., kartu keputusan, kartu taktik, dan kartu bukti.\n\nALUR\n1. Bagi peserta menjadi Tim Arus dan Tim Hadang.\n2. Buat empat garis fisik: Jeda, Emosi, Data, dan Aksi.\n3. Lakukan voting awal dengan Kartu Keputusan.\n4. Tim Arus membawa Token Informasi; Tim Hadang menyelesaikan tantangan setiap garis.\n5. Fasilitator mengatur timer, pilihan, dan skor melalui website.\n6. Buka Kartu Taktik dan AI Lens setelah semua garis dimainkan.\n7. Lakukan voting akhir, debrief, lalu tukar peran.\n\nKEAMANAN\nPermainan tanpa kontak fisik. Jangan berlari pada lantai licin. Gunakan hanya skenario yang disediakan dan jangan memakai data pribadi peserta.\n`,a=`AI CAMERA ARENA GUIDE (BETA)\n\nAudience: ${n(V.audience)}\nDuration: ${n(V.duration)}\nParticipants: ${V.participants}\nPack: ${n(e.title)}\nCase: ${n(e.caseTitle)}\n\nEQUIPMENT\nA laptop with a webcam, a screen visible to the group, and approximately two meters of movement space.\n\nFLOW\n1. Run the initial vote without clues.\n2. Choose one guard to stand in front of the camera.\n3. Discuss the questions for Pause, Emotion, Evidence, and Action.\n4. The guard raises both hands for one second to lock the line.\n5. Rotate guards at each line so participants take turns.\n6. Run the final vote and debrief.\n\nPRIVACY AND ACCESSIBILITY\nPoses are processed on the device in the browser; video is not recorded or sent to a server. Use Mark Manually for participants who cannot or prefer not to perform the pose. AI only reads the pose and does not evaluate answer quality.\n`,o=`OFFLINE BLOCKING ARENA GUIDE\n\nAudience: ${n(V.audience)}\nDuration: ${n(V.duration)}\nParticipants: ${V.participants}\nPack: ${n(e.title)}\nCase: ${n(e.caseTitle)}\n\nEQUIPMENT\nA laptop and projector, floor tape, an Information Token, J.E.D.A. cards, decision cards, tactic cards, and evidence cards.\n\nFLOW\n1. Divide participants into the Flow Team and Guard Team.\n2. Create four physical lines: Pause, Emotion, Evidence, and Action.\n3. Run the initial vote with Decision Cards.\n4. The Flow Team carries the Information Token; the Guard Team completes each line challenge.\n5. The facilitator manages the timer, choices, and score on the website.\n6. Reveal the Tactic Card and AI Lens after all lines have been played.\n7. Run the final vote and debrief, then swap roles.\n\nSAFETY\nThis is a non-contact game. Do not run on slippery floors. Use only the provided scenarios and never use participants' personal data.\n`,s=t?V.mode===`vision`?a:`${o}
KIT ROLES
- Information Token: carried by the Runner from ENTRY toward ACTION.
- J.E.D.A. Cards: placed at the four lines as question prompts.
- Tactic Card: kept secret by the Flow Team Strategist until the reveal.
- Decision Cards: raised by every Decision Maker during the initial and final votes.
- Line markers: taped to the floor to form the game path.

SCORING
- Guard Team +1 for a correct answer.
- Flow Team +1 for an incorrect answer or when time runs out.
- A majority of safer final votes gives the Guard Team a +2 bonus.

BEST PRACTICES
For 8-24 participants, assign 2-4 people to the Flow Team, four guards to the Guard Team, and everyone else as Decision Makers. Play two rounds so the teams swap roles. For larger groups, create several smaller arenas. Assign one facilitator to operate the website and maintain the pace of play.
`:V.mode===`vision`?r:`${i}
FUNGSI KIT
- Token Informasi: dibawa Runner dari MASUK menuju TINDAKAN.
- Kartu J.E.D.A.: diletakkan pada empat garis sebagai pengingat pertanyaan.
- Kartu Taktik: dipegang rahasia oleh Strategist Tim Arus sampai tahap reveal.
- Kartu Keputusan: diangkat setiap Warga saat voting awal dan akhir.
- Penanda garis: ditempel di lantai untuk membentuk jalur permainan.

SKOR
- Tim Hadang +1 untuk jawaban benar.
- Tim Arus +1 untuk jawaban salah atau ketika waktu habis.
- Mayoritas keputusan aman pada voting akhir memberi Tim Hadang bonus +2.

PRAKTIK TERBAIK
Untuk 8-24 peserta, tempatkan 2-4 orang di Tim Arus, 4 penjaga di Tim Hadang, dan peserta lain sebagai Warga. Mainkan dua ronde agar kedua tim bertukar peran. Untuk kelompok besar, buat beberapa arena kecil. Tunjuk satu fasilitator khusus untuk mengoperasikan website dan menjaga tempo permainan.
`,c=document.createElement(`a`);c.href=URL.createObjectURL(new Blob([s],{type:`text/plain;charset=utf-8`})),c.download=t?V.mode===`vision`?`hadangin-ai-camera-arena-guide.txt`:`hadangin-community-session-guide.txt`:V.mode===`vision`?`panduan-arena-kamera-hadangin.txt`:`panduan-sesi-hadangin.txt`,c.click(),setTimeout(()=>URL.revokeObjectURL(c.href),0),Pe(t?`Session guide downloaded.`:`Panduan sesi berhasil diunduh.`)}function qt(){let e=De()===`en`,t=e?[[`J`,`PAUSE`,`Pause briefly and identify the time pressure.`],[`E`,`EMOTION`,`Recognize the emotion being influenced.`],[`D`,`EVIDENCE`,`Choose the strongest independent evidence.`],[`A`,`ACTION`,`Assess the risk and choose a safer action.`],[`&#8594;`,`PROCEED`,`I will take the requested action.`],[`?`,`VERIFY`,`I will check through another channel.`],[`&#9632;`,`STOP`,`I will not continue the action.`],[`...`,`NOT SURE`,`I need more evidence.`],[`!`,`URGENCY`,`Reduce the other team's time by five seconds.`],[`ID`,`AUTHORITY`,`Use a claim tied to an institution or position.`],[`!`,`FEAR`,`Emphasize a threat or emergency.`],[`+`,`SOCIAL PRESSURE`,`Use virality as pressure.`]]:[[`J`,`JEDA`,`Berhenti sejenak. Temukan tekanan waktu.`],[`E`,`EMOSI`,`Kenali emosi yang sedang dipengaruhi.`],[`D`,`DATA`,`Pilih bukti independen yang paling kuat.`],[`A`,`AKSI`,`Nilai risiko dan pilih tindakan yang aman.`],[`&#8594;`,`LANJUT`,`Saya akan melakukan tindakan yang diminta.`],[`?`,`VERIFIKASI`,`Saya akan memeriksa lewat kanal lain.`],[`&#9632;`,`BERHENTI`,`Saya tidak akan melanjutkan tindakan.`],[`...`,`BELUM YAKIN`,`Saya membutuhkan bukti tambahan.`],[`!`,`URGENCY`,`Kurangi waktu lawan lima detik.`],[`ID`,`AUTHORITY`,`Gunakan klaim institusi atau jabatan.`],[`!`,`FEAR`,`Tekankan ancaman atau keadaan darurat.`],[`+`,`SOCIAL PRESSURE`,`Gunakan viralitas sebagai tekanan.`]],n=e?{title:`HADANGIN · Blocking Arena Kit`,instruction:`Cut along the card borders. Laminate the cards for repeated use.`,print:`Print`,token:`INFORMATION TOKEN`,lines:[`J · PAUSE`,`E · EMOTION`,`D · EVIDENCE`,`A · ACTION`,`ACTION ZONE`],safety:`Safety: use without physical contact, avoid slippery floors, and adapt movement distances to participants' needs.`}:{title:`HADANGIN · Arena Hadang`,instruction:`Potong kartu mengikuti batas. Laminasi bila akan digunakan berulang.`,print:`Cetak`,token:`TOKEN INFORMASI`,lines:[`J · JEDA`,`E · EMOSI`,`D · DATA`,`A · AKSI`,`ZONA TINDAKAN`],safety:`Keamanan: gunakan tanpa kontak fisik, hindari lantai licin, dan sesuaikan jarak gerak dengan kebutuhan peserta.`},r=e?`
    <section class="quick"><p class="quick-kicker">FACILITATOR QUICK START</p><h2>Run one round in six steps</h2>
      <ol><li>Build the four-line court and divide participants into the Flow Team, Guard Team, and Decision Makers.</li><li>Show the case and record an initial vote with Decision Cards before any discussion.</li><li>The Flow Team secretly draws a Tactic Card. Its Runner carries the Information Token from ENTRY.</li><li>At every J.E.D.A. line, give the Guard Team 30 seconds to answer. The Flow Team may apply the five-second pressure once.</li><li>After line A, reveal the Tactic Card and select the same tactic in AI Lens.</li><li>Record the final vote, debrief the decision shift, then swap roles for round two.</li></ol>
      <div class="quick-grid"><div><b>CARD ROLES</b><p><strong>Information Token:</strong> carried by the Runner.<br><strong>J.E.D.A. Cards:</strong> placed at each line.<br><strong>Tactic Card:</strong> kept secret by the Flow Team.<br><strong>Decision Cards:</strong> raised by every Decision Maker.</p></div><div><b>SCORING</b><p>Guard Team +1 for a correct answer. Flow Team +1 for an incorrect answer or timeout. A majority of safer final votes gives the Guard Team a +2 bonus.</p></div></div>
      <p class="quick-safety">For 8-24 players: assign 2-4 to the Flow Team, four to the Guard Team, and everyone else as Decision Makers. Play two non-contact rounds and never use participants' personal data.</p>
    </section>`:`
    <section class="quick"><p class="quick-kicker">PANDUAN CEPAT FASILITATOR</p><h2>Mainkan satu ronde dalam enam langkah</h2>
      <ol><li>Buat lapangan empat garis dan bagi peserta menjadi Tim Arus, Tim Hadang, dan Warga.</li><li>Tampilkan kasus dan catat voting awal dengan Kartu Keputusan sebelum berdiskusi.</li><li>Tim Arus mengambil Kartu Taktik secara rahasia. Runner membawa Token Informasi dari MASUK.</li><li>Di setiap garis J.E.D.A., beri Tim Hadang 30 detik untuk menjawab. Tim Arus boleh memakai tekanan -5 detik satu kali.</li><li>Setelah garis A, buka Kartu Taktik dan pilih taktik yang sama pada AI Lens.</li><li>Catat voting akhir, bahas perubahan keputusan, lalu tukar peran untuk ronde kedua.</li></ol>
      <div class="quick-grid"><div><b>FUNGSI KARTU</b><p><strong>Token Informasi:</strong> dibawa Runner.<br><strong>Kartu J.E.D.A.:</strong> diletakkan di setiap garis.<br><strong>Kartu Taktik:</strong> dirahasiakan Tim Arus.<br><strong>Kartu Keputusan:</strong> diangkat oleh setiap Warga.</p></div><div><b>SKOR</b><p>Tim Hadang +1 untuk jawaban benar. Tim Arus +1 untuk jawaban salah atau waktu habis. Mayoritas keputusan aman pada voting akhir memberi Tim Hadang bonus +2.</p></div></div>
      <p class="quick-safety">Untuk 8-24 pemain: 2-4 orang menjadi Tim Arus, 4 orang menjadi Tim Hadang, dan peserta lain menjadi Warga. Mainkan dua ronde, tanpa kontak fisik dan tanpa data pribadi peserta.</p>
    </section>`,i=window.open(``,`_blank`);if(!i){Pe(e?`Allow pop-ups to print the game kit.`:`Izinkan pop-up untuk mencetak kit permainan.`);return}i.opener=null,i.document.write(`<!doctype html><html lang="id"><head><title>Kit Arena Hadang</title><style>@page{size:A4;margin:10mm}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#0b1830}.head{display:flex;justify-content:space-between;align-items:end;margin-bottom:8mm;border-bottom:3px solid #2468ef;padding-bottom:4mm}.head h1{margin:0;font-size:22px}.head p{margin:0;font-size:10px}.quick{min-height:245mm;break-after:page}.quick-kicker{margin:18mm 0 3mm;color:#c65038;font-size:10px;font-weight:800}.quick h2{margin:0 0 9mm;font-size:28px}.quick ol{display:grid;grid-template-columns:1fr 1fr;gap:4mm 8mm;margin:0;padding:0;list-style:none;counter-reset:step}.quick li{min-height:28mm;padding:5mm;border-top:2px solid #2468ef;font-size:11px;line-height:1.55;counter-increment:step}.quick li:before{content:counter(step,decimal-leading-zero);display:block;margin-bottom:3mm;color:#2468ef;font-size:10px;font-weight:800}.quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:8mm}.quick-grid>div{padding:6mm;color:white;background:#10213d}.quick-grid b{color:#6dddd0;font-size:10px}.quick-grid p{margin:4mm 0 0;font-size:10px;line-height:1.6}.quick-safety{padding:4mm;border-left:3px solid #c65038;background:#edf3fa;font-size:10px;line-height:1.5}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm}.card{height:82mm;display:flex;flex-direction:column;padding:7mm;border:2px solid #10213d;break-inside:avoid}.card:nth-child(4n+2){border-color:#0e9689}.card:nth-child(4n+3){border-color:#dd9217}.card:nth-child(4n){border-color:#d45f42}.symbol{width:18mm;height:18mm;display:grid;place-items:center;color:white;background:#2468ef;font-size:24px;font-weight:800}.card h2{margin:12mm 0 3mm;font-size:16px}.card p{margin:0;font-size:10px;line-height:1.5}.token{grid-column:1/-1;height:55mm;display:grid;place-items:center;color:white;background:#c83f50;border:4px solid #10213d;font-size:34px;font-weight:800;letter-spacing:2px}.line{grid-column:1/-1;height:35mm;display:grid;place-items:center;border:3px dashed #10213d;font-size:25px;font-weight:800}.note{grid-column:1/-1;font-size:9px;line-height:1.5}@media print{button{display:none}}</style></head><body><div class="head"><div><h1>HADANGIN &middot; Arena Hadang</h1><p>Potong kartu mengikuti batas. Laminasi bila akan digunakan berulang.</p></div><button onclick="print()">Cetak</button></div>${r}<div class="cards">${t.map(([e,t,n])=>`<article class="card"><span class="symbol">${e}</span><h2>${t}</h2><p>${n}</p></article>`).join(``)}<div class="token">TOKEN INFORMASI</div>${[`J &middot; JEDA`,`E &middot; EMOSI`,`D &middot; DATA`,`A &middot; AKSI`,`ZONA TINDAKAN`].map(e=>`<div class="line">${e}</div>`).join(``)}<p class="note">Keamanan: gunakan tanpa kontak fisik, hindari lantai licin, dan sesuaikan jarak gerak dengan kebutuhan peserta.</p></div></body></html>`),i.document.close(),e&&(i.document.documentElement.lang=`en`,i.document.title=`HADANGIN Blocking Arena Kit`,i.document.querySelector(`.head h1`).textContent=n.title,i.document.querySelector(`.head p`).textContent=n.instruction,i.document.querySelector(`.head button`).textContent=n.print,i.document.querySelector(`.token`).textContent=n.token,i.document.querySelectorAll(`.line`).forEach((e,t)=>{e.textContent=n.lines[t]}),i.document.querySelector(`.note`).textContent=n.safety),i.focus()}function Jt(){let e=document.querySelector(`#community-timer`);e&&(e.textContent=`00:${String(V.timerRemaining).padStart(2,`0`)}`)}function Yt(){if(V.timerRunning){Nt();let e=document.querySelector(`[data-action="community-timer"]`);e&&(e.textContent=`Lanjut Timer`);return}V.timerRunning=!0;let e=document.querySelector(`[data-action="community-timer"]`);e&&(e.textContent=`Jeda Timer`),Mt=setInterval(()=>{V.timerRemaining=Math.max(0,V.timerRemaining-1),Jt(),V.timerRemaining===0&&Xt(!0)},1e3)}function Xt(e=!1){if(V.lineResolved)return;Nt();let t=At[V.packId][V.lineIndex],n=!e&&V.selectedAnswer===t.correct,r=n?`blocked`:`passed`;V.lineResults[V.lineIndex]={letter:t.letter,outcome:r,insight:e?`Timer habis sebelum Tim Hadang mengunci bukti.`:t.insight},V.scores[n?`hadang`:`arus`]+=1,V.lineResolved=!0,z({preserveScroll:!0})}function Zt(){V.selectedAnswer=null,V.lineResolved=!1,V.timerRemaining=30,V.pressureUsed=!1}function Qt(e=!1){e&&([V.teamArus,V.teamHadang]=[V.teamHadang,V.teamArus]),V.mode=`session`,V.phase=0,V.lineIndex=0,V.lineResults=[],V.revealedTactic=``,V.votes={initial:[0,0,0,0],final:[0,0,0,0]},V.finalBonusApplied=!1,Zt()}var $t={summary:[[`Pemeriksaan simulatif`,`128`,`+24 minggu ini`],[`Safer decision shift`,`64%`,`berubah ke verifikasi/berhenti`],[`MIL Habit Score`,`78`,`rata-rata dari 100`],[`Forward risk turun`,`34 pts`,`sebelum vs sesudah J.E.D.A.`]],before:[[`Lanjut`,42],[`Verifikasi Dulu`,28],[`Berhenti`,12],[`Belum Yakin`,18]],after:[[`Lanjut`,9],[`Verifikasi Dulu`,57],[`Berhenti`,25],[`Belum Yakin`,9]],patterns:[[`Urgency`,87],[`Fear`,73],[`Fake Authority`,59],[`Emotional Clickbait`,54],[`Suspicious Link`,41],[`Synthetic Media`,33],[`Financial Request`,28]],media:[[`Text / WhatsApp`,46],[`Image / Screenshot`,24],[`QR / Link`,18],[`Audio / Voice Note`,12]],jeda:[[`Jeda`,82,`User mulai mengenali tekanan waktu.`],[`Emosi`,76,`Fear dan urgency paling sering memengaruhi respons.`],[`Data`,71,`Masih perlu latihan memilih bukti independen.`],[`Aksi`,79,`Risiko transfer/klik makin terlihat sebelum bertindak.`]],explainability:[[`Visual highlights dilihat`,89],[`Pertanyaan reflektif dijawab`,76],[`Bukti independen dipilih`,68],[`Tidak mengikuti AI saat bukti lebih kuat`,22]],scenarios:[[`Pesan Keluarga Darurat`,`92%`,`+48%`,`Percaya nomor baru`],[`QR Pembayaran`,`81%`,`+36%`,`Tidak cek penerima`],[`Lowongan Kerja`,`77%`,`+42%`,`Percaya logo/testimoni`],[`AI Bisa Salah`,`69%`,`+25%`,`Terlalu percaya AI`]]};function en([e,t],n=``){return`<div class="dash-bar-row ${n}"><div><span>${R(e)}</span><b>${t}%</b></div><i style="--bar:${t}%"></i></div>`}function tn(){return`<section class="page-hero dashboard-hero"><div class="page-shell"><p class="eyebrow">Prototype analytics simulation</p><h1>HADANGIN Insight Dashboard</h1><p>Dashboard simulatif untuk menunjukkan dampak pembelajaran MIL: bagaimana pengguna pause, verify, reflect, decide, dan mengurangi risiko forward impulsif.</p></div></section>
    <section class="section dashboard-section"><div class="page-shell">
      <div class="dashboard-note"><strong>Catatan demo</strong><span>Angka di halaman ini adalah data simulatif untuk pitch UNESCO. Saat backend ditambahkan, struktur ini dapat diisi dari event pemeriksaan nyata.</span></div>
      <div class="metric-grid">${$t.summary.map(([e,t,n])=>`<article class="metric-card"><span>${R(e)}</span><strong>${R(t)}</strong><p>${R(n)}</p></article>`).join(``)}</div>
      <div class="dashboard-grid two">
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">Before vs after</p><h2>Perubahan keputusan pengguna</h2><p>Dari respons reaktif menuju verifikasi atau berhenti sebelum share.</p></div><div class="judgment-compare"><section><h3>Sebelum J.E.D.A.</h3>${$t.before.map(e=>en(e,`before`)).join(``)}</section><section><h3>Sesudah AI Lens</h3>${$t.after.map(e=>en(e,`after`)).join(``)}</section></div></article>
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">Pattern map</p><h2>Pola manipulasi dominan</h2><p>Insight untuk educator, komunitas, dan peneliti MIL.</p></div><div class="pattern-list">${$t.patterns.map(([e,t])=>en([e,t],`pattern`)).join(``)}</div></article>
      </div>
      <div class="dashboard-grid two compact">
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">Multimodal input</p><h2>Jenis konten diperiksa</h2></div><div class="media-donut" aria-label="Distribusi tipe media"><span>46%</span></div><div class="media-list">${$t.media.map(([e,t])=>`<p><i style="--dot:${t}%"></i><span>${R(e)}</span><b>${t}%</b></p>`).join(``)}</div></article>
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">J.E.D.A. growth</p><h2>Skill literasi yang terbentuk</h2></div><div class="skill-list dashboard-skills">${$t.jeda.map(([e,t,n])=>`<div class="skill-row"><span>${R(e)}<small>${R(n)}</small></span><div class="skill-bar"><i style="width:${t}%"></i></div><b>${t}</b></div>`).join(``)}</div></article>
      </div>
      <div class="dashboard-grid two compact">
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">Explainability engagement</p><h2>Apakah pengguna belajar dari clue?</h2></div><div class="explain-grid">${$t.explainability.map(([e,t])=>`<div><strong>${t}%</strong><span>${R(e)}</span></div>`).join(``)}</div></article>
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">Workshop insight</p><h2>Ringkasan untuk kelas/komunitas</h2><p>Contoh simulasi sesi literasi digital berbasis skenario QR Pembayaran.</p></div><div class="workshop-summary"><span>Peserta 32</span><span>47% langsung scan sebelum latihan</span><span>81% cek kasir/penerima sesudah latihan</span></div></article>
      </div>
      <article class="dashboard-card scenario-dashboard"><div class="dash-card-head"><p class="section-kicker">Scenario performance</p><h2>Skenario yang paling berguna untuk latihan</h2></div><div class="scenario-table"><div class="table-head"><span>Skenario</span><span>Completion</span><span>Risk shift</span><span>Common mistake</span></div>${$t.scenarios.map(([e,t,n,r])=>`<div><span>${R(e)}</span><b>${R(t)}</b><b>${R(n)}</b><span>${R(r)}</span></div>`).join(``)}</div></article>
    </div></section>`}function nn(){return`<section class="page-hero training-hero">
      <div class="training-3d-stage" id="training-3d-stage" role="img" aria-label="Arena Gobak Sodor 3D interaktif dengan empat penjaga J.E.D.A."><div class="training-3d-loading"><span></span><strong>Menyiapkan arena 3D</strong></div></div>
      <div class="training-3d-toolbar" aria-label="Kontrol arena 3D"><button type="button" data-3d-action="reset" aria-label="Atur ulang kamera" title="Atur ulang kamera">&#8635;</button><button type="button" data-3d-action="pause" aria-label="Jeda animasi" title="Jeda animasi">&#10074;&#10074;</button></div>
      <div class="training-3d-inspector" aria-live="polite"><span>Penjaga J.E.D.A.</span><strong>Pilih penjaga di arena</strong><p>Klik karakter untuk melihat tugasnya menghadang informasi.</p><button class="button button-small" type="button" data-scenario="family-emergency" disabled>Mulai Latihan</button></div>
      <div class="page-shell training-hero-inner"><div class="training-hero-copy"><p class="eyebrow">Latihan Hadang &middot; Arena 3D</p><h1>Latih Nalar Sebelum Situasi Nyata Datang.</h1><p>Hadapi simulasi manipulasi digital yang dekat dengan kehidupan sehari-hari. Setiap skenario berlangsung sekitar dua menit.</p><div class="training-hero-actions"><button class="button" type="button" data-scroll-to="training-arenas">Pilih Skenario <span aria-hidden="true">&#8595;</span></button><div class="training-hero-status"><span>8 arena</span><span>4 garis J.E.D.A.</span><span>Human First</span></div></div></div></div>
      <span class="training-hero-caption">Geser kamera &middot; Klik penjaga</span>
    </section>
    <section class="section training-arena-section" id="training-arenas"><div class="page-shell">
      <div class="section-header"><p class="section-kicker">8 skenario multimodal</p><h2>Pilih arena latihan</h2><p>Setiap arena membawa bentuk informasi yang berbeda. Tipe data, preview, pertanyaan J.E.D.A., dan hasil XAI akan mengikuti kasus yang dipilih.</p></div>
      <div class="scenario-grid">${de.map(e=>`<article class="scenario-card ${e.featured?`featured`:``}" data-scenario-card="${e.id}"><div class="scenario-card-top"><span class="scenario-no">${e.no}</span><span class="scenario-format scenario-format-${e.inputType}">${R(e.format)}</span></div><h3>${e.title}</h3><p>${e.description}</p><div class="scenario-source"><span>Sumber kasus</span><strong>${R(e.source)}</strong></div><div class="scenario-mission"><span>Misi latihan</span><p>${R(e.mission)}</p></div><div class="chip-row">${e.triggers.map(t=>`<span class="chip ${e.featured?`chip-terra`:``}">${t}</span>`).join(``)}</div><button class="button ${e.featured?``:`button-secondary`}" data-scenario="${e.id}">Buka Arena ${R(e.format)}</button></article>`).join(``)}</div>
    </div></section>`}function rn(){return`<section class="page-hero"><div class="page-shell"><p class="eyebrow">Cara Kerja</p><h1>Bagaimana HADANGIN Bekerja?</h1><p>HADANGIN adalah Indonesian-localized prototype dari AI Context Guard Web: menggabungkan psikologi, Media and Information Literacy, AI forensics, dan human judgment dalam satu alur reflektif.</p></div></section>
    <section class="section section-white"><div class="page-shell"><div class="context-bridge"><span>Proposal concept</span><strong>AI Context Guard Web</strong><i aria-hidden="true">&#8594;</i><span>Local experience</span><strong>HADANGIN + J.E.D.A.</strong></div><div class="steps-grid">${[[`Masukkan Informasi`,`Screenshot, teks, audio, QR, atau tautan menjadi konteks awal pemeriksaan.`],[`Human First`,`Buat keputusan dan ukur keyakinan sebelum melihat analisis otomatis.`],[`Hadang dengan J.E.D.A.`,`Periksa jeda, emosi, data, dan aksi yang diminta informasi.`],[`AI Lens`,`AI membantu membaca sinyal, konteks, pola forensik, dan ketidakpastian.`],[`Human Final`,`Bandingkan penalaranmu, sinyal AI, dan bukti yang independen.`],[`Reflect & Learn`,`Lihat perubahan keputusan dan pola berpikir yang telah dilatih.`]].map(([e,t])=>`<article class="step-card"><h3>${e}</h3><p>${t}</p></article>`).join(``)}</div></div></section>
    <section class="section how-modes"><div class="page-shell"><div class="how-modes-head"><div><p class="section-kicker">Dua mode, satu metode</p><h2>Berlatih sendiri atau bergerak bersama.</h2></div><p>Pilihan mode mengubah cara bermain, bukan prinsipnya. Keduanya melatih kebiasaan berhenti, memeriksa bukti, menggunakan AI sebagai lensa, lalu mengambil keputusan sendiri.</p></div><div class="how-mode-grid">
      <article class="how-mode-card individual"><div class="how-mode-top"><span>Mode individu · 1 pemain</span><b aria-hidden="true">1P</b></div><h3>Periksa dan latih keputusanmu sendiri.</h3><p>Gunakan ponsel atau laptop untuk memeriksa konten nyata maupun skenario latihan secara mandiri.</p><div class="how-mode-flow"><strong>Yang kamu lakukan</strong><div><span>Unggah konten</span><i>&#8594;</i><span>Nilai sendiri</span><i>&#8594;</i><span>Main J.E.D.A.</span><i>&#8594;</i><span>Bandingkan AI</span><i>&#8594;</i><span>Refleksi</span></div></div><dl><div><dt>Format</dt><dd>Deteksi AI cepat atau AI Plus dengan permainan J.E.D.A.</dd></div><div><dt>Cocok untuk</dt><dd>Keputusan sehari-hari, belajar mandiri, dan latihan singkat.</dd></div></dl><a class="button" href="#/verify">Mulai mode individu <span aria-hidden="true">&#8594;</span></a></article>
      <article class="how-mode-card community"><div class="how-mode-top"><span>Mode komunitas · 4–120 peserta</span><b aria-hidden="true">24P</b></div><h3>Hadang informasi sebagai permainan tim.</h3><p>Fasilitator membagi peserta menjadi tim pembawa informasi dan tim penjaga literasi. Satu tim mencoba meloloskan skenario; tim lain menghadangnya dengan pertanyaan, bukti, dan tindakan aman.</p><div class="how-mode-flow"><strong>Yang kelompok lakukan</strong><div><span>Buat ruang</span><i>&#8594;</i><span>Bagi tim</span><i>&#8594;</i><span>Mainkan arena</span><i>&#8594;</i><span>Voting</span><i>&#8594;</i><span>Debrief</span></div></div><dl><div><dt>Format</dt><dd>Offline, hybrid, atau Arena Kamera berbasis computer vision.</dd></div><div><dt>Cocok untuk</dt><dd>Keluarga, sekolah, organisasi pemuda, dan komunitas.</dd></div></dl><a class="button button-teal" href="#/community">Siapkan mode komunitas <span aria-hidden="true">&#8594;</span></a></article>
    </div><div class="how-shared-method"><span>Metode yang sama pada kedua mode</span><div><b>Human First</b><i>&#8594;</i><b>J.E.D.A.</b><i>&#8594;</i><b>AI Lens</b><i>&#8594;</i><b>Human Final</b></div><p>Yang berubah hanya skala dan cara interaksi; keputusan tetap berada pada manusia.</p></div></div></section>
    <section class="section"><div class="page-shell"><div class="dark-band"><div class="section-header"><p class="section-kicker">Human-centered AI</p><h2>AI adalah Lensa, Bukan Hakim.</h2><p>Label “aman”, “hoaks”, atau “scam” dapat membantu, tetapi tidak otomatis membangun kemampuan menilai ketika teknologi tidak tersedia.</p></div><div class="dark-mini-grid"><article><h3>Detect</h3><p>AI membantu menemukan pola dan sinyal yang mungkin terlewat.</p></article><article><h3>Explain</h3><p>AI menjelaskan mengapa sinyal muncul dan menunjukkan batasnya.</p></article><article><h3>Question</h3><p>AI membantu pengguna tahu bukti apa yang perlu diverifikasi.</p></article></div><p class="dark-footer-line">Keputusan akhir tetap milik manusia.</p></div></div></section>`}function an(){return`<section class="page-hero about-hero"><img class="about-hero-mark" src="${ce}" alt="" aria-hidden="true" /><div class="page-shell about-hero-inner"><div class="about-wordmark-shell"><img src="${le}" alt="HADANGIN" /></div><p class="eyebrow">Identitas HADANGIN</p><h1>Hadang Informasi. Jaga Keputusan.</h1><p>HADANGIN membantu masyarakat membangun refleks untuk berhenti, membaca konteks, memeriksa bukti, dan memilih tindakan yang lebih aman di tengah arus informasi digital.</p><div class="about-hero-principles"><span>Human First</span><i></i><span>AI Second</span><i></i><span>Human Final</span></div></div></section>
    <section class="section section-white about-identity"><div class="page-shell about-identity-grid"><div class="about-name-story"><p class="section-kicker">Makna nama</p><h2>HADANGIN adalah ajakan untuk berhenti sebelum bertindak.</h2><p>Nama HADANGIN berasal dari kata hadang: menahan sesuatu agar tidak langsung melewati batas. Akhiran percakapan -in membuatnya terdengar dekat, aktif, dan mudah diingat sebagai ajakan sehari-hari.</p><div class="about-name-formula"><strong class="notranslate" translate="no">HADANG</strong><span>+</span><strong class="notranslate" translate="no">IN</strong><i>perlindungan yang menjadi tindakan</i></div><div class="about-cultural-origin"><div class="about-cultural-copy"><span>Akar budaya Indonesia</span><p>HADANGIN terinspirasi oleh Gobak Sodor, permainan tradisional Indonesia tentang menghadang pergerakan melintasi batas. Prinsip itu kami terjemahkan menjadi intervensi perilaku digital: menghentikan reaksi impulsif sebelum manipulasi berubah menjadi tindakan.</p></div><div class="about-cultural-translation" aria-label="Transformasi filosofi Gobak Sodor menjadi intervensi digital"><div><small>GOBAK SODOR</small><p><b>Gerak</b><i>&#8594;</i><b>Batas</b><i>&#8594;</i><b>Hadang</b></p></div><span>&#8595;</span><div><small>PERILAKU DIGITAL</small><p><b>Informasi</b><i>&#8594;</i><b>J.E.D.A.</b><i>&#8594;</i><b>Tindakan aman</b></p></div></div></div><div class="about-meaning-list"><div><span>01</span><p>Menahan laju informasi manipulatif sebelum menjadi tindakan impulsif.</p></div><div><span>02</span><p>Membawa semangat permainan hadang atau gobak sodor ke dalam latihan literasi digital.</p></div><div><span>03</span><p>Mengajak pengguna terlibat aktif, bukan sekadar menerima penilaian AI.</p></div></div></div>
      <aside class="about-logo-system" aria-label="Sistem identitas HADANGIN"><div class="about-logo-head"><p class="section-kicker">Sistem identitas</p><span>01 / LOGO</span></div><figure class="about-logo-mark"><img src="${ce}" alt="Simbol perisai H HADANGIN" /><figcaption><strong>Simbol utama</strong><p>Perisai berbentuk H mewakili perlindungan, batas, dan ruang aman untuk berpikir. Huruf H adalah abstraksi visual dari garis batas dan garis penghubung lapangan Gobak Sodor, bukan salinan bentuk lapangannya.</p></figcaption></figure><figure class="about-logo-wordmark"><div><img src="${le}" alt="Logo horizontal HADANGIN" /></div><figcaption><strong>Logo horizontal</strong><p>Wordmark memadukan simbol penjaga dengan nama yang tegas dan mudah dikenali.</p></figcaption></figure></aside>
    </div></section>
    <section class="section about-visual-language"><div class="page-shell"><div class="about-visual-head"><div><p class="section-kicker">Bahasa visual</p><h2>Garis permainan menjadi sistem identitas.</h2></div><p>Elemen budaya diterjemahkan secara konsisten ke dalam bentuk, huruf, dan warna.</p></div><div class="about-visual-grid">
      <figure class="about-court-figure"><div class="about-court-image"><img src="${ue}" alt="Dua tim memainkan Gobak Sodor pada lapangan enam petak dengan garis horizontal dan garis vertikal tengah" /><span>02 / AKAR BUDAYA</span></div><figcaption><h3>Dari garis lapangan ke simbol H</h3><div class="about-team-legend"><div class="carrier"><i></i><span><strong>Tim biru · Pembawa informasi</strong><small>Hoaks, scam, QR, audio, dan gambar manipulatif</small></span></div><div class="guardian"><i></i><span><strong>Tim hijau · Penjaga literasi</strong><small>Jeda, bertanya, periksa bukti, dan putuskan dengan aman</small></span></div></div><p>Lapangan Gobak Sodor umumnya berbentuk persegi panjang yang dibagi menjadi enam petak, dengan garis horizontal yang dijaga dan satu garis vertikal tengah untuk penjaga sodor. Identitas HADANGIN tidak menyalin bentuk lapangan secara harfiah. Garis batas dan penghubungnya diabstraksikan menjadi huruf H: simbol untuk menghadang, memberi jeda, lalu menilai sebelum melintas.</p></figcaption></figure>
      <div class="about-brand-specs"><section class="about-type-spec"><div class="about-spec-head"><span>03 / TIPOGRAFI</span><small>Antarmuka digital</small></div><div class="about-type-sample"><b>Aa</b><div><h3>Plus Jakarta Sans</h3><p>Tipografi utama untuk judul, navigasi, dan teks antarmuka. Geometris, tegas, dan tetap mudah dibaca pada layar kecil.</p></div></div><div class="about-type-weights"><span><b>400</b> Regular</span><span><b>600</b> Semibold</span><span><b>700</b> Bold</span></div></section>
      <section class="about-color-spec"><div class="about-spec-head"><span>04 / PALET WARNA</span><small>Brand &amp; interface</small></div><div class="about-color-list"><div><i style="--swatch:#0f172a"></i><p><strong>Navy Penjaga</strong><span>#0F172A · stabilitas &amp; kepercayaan</span></p></div><div><i style="--swatch:#2563eb"></i><p><strong>Biru Aksi</strong><span>#2563EB · kejelasan &amp; aksi</span></p></div><div><i style="--swatch:#0f8f80"></i><p><strong>Teal Jeda</strong><span>#0F8F80 · keseimbangan &amp; rasa aman</span></p></div><div><i style="--swatch:#c66a49"></i><p><strong>Terakota Manusia</strong><span>#C66A49 · energi &amp; kedekatan manusia</span></p></div><div><i style="--swatch:#f8fafc"></i><p><strong>Putih Kanvas</strong><span>#F8FAFC · keterbukaan &amp; ruang bernapas</span></p></div></div><div class="about-color-theory"><div><strong>Teori warna lintas budaya</strong><span>Warna + label + ikon</span></div><p>Dalam desain digital global, navy dan biru sering dikaitkan dengan kepercayaan dan kejelasan; teal dengan keseimbangan dan rasa aman; terakota dengan energi serta kedekatan manusia; putih dengan keterbukaan.</p><small>Makna warna dapat berbeda antarbudaya. Karena itu HADANGIN selalu memasangkan warna dengan label, ikon, dan kontras yang jelas.</small></div></section></div>
    </div></div></section>
    <section class="section about-direction"><div class="page-shell"><div class="about-direction-head"><p class="section-kicker">Arah gerak</p><span>HADANGIN &middot; AI Context Guard Web Indonesia</span></div><div class="about-vision-mission"><article class="about-vision"><span>VISI</span><h2>Mewujudkan masyarakat digital yang tangguh, kritis, dan tetap memegang kendali atas keputusannya di tengah perkembangan AI dan manipulasi informasi.</h2></article><div class="about-missions"><div><span>01</span><div><strong>Bangun kebiasaan jeda</strong><p>Menjadikan berhenti sejenak sebagai respons pertama sebelum klik, transfer, scan, atau membagikan.</p></div></div><div><span>02</span><div><strong>Jelaskan, jangan menghakimi</strong><p>Menyajikan sinyal AI dan XAI dengan bahasa yang mudah dipahami tanpa mengambil alih keputusan.</p></div></div><div><span>03</span><div><strong>Bawa literasi ke ruang bersama</strong><p>Mengubah latihan berpikir kritis menjadi pengalaman bermain yang relevan bagi keluarga, sekolah, dan komunitas.</p></div></div><div><span>04</span><div><strong>Jaga pilihan manusia dan privasi</strong><p>Memprioritaskan perlindungan data, aksesibilitas, dan kendali manusia, termasuk kebebasan untuk mempertanyakan atau menolak rekomendasi AI.</p></div></div></div></div></div></section>
    <section class="section section-white"><div class="page-shell"><div class="section-header"><p class="section-kicker">Masalah yang dihadapi</p><h2>Kesenjangan antara Informasi dan Tindakan</h2><p>Manipulasi digital sering berhasil bukan hanya karena terlihat meyakinkan, tetapi karena memanfaatkan urgency, fear, authority, trust, scarcity, atau emotional attachment.</p></div><div class="problem-flow"><div class="problem-node">INFORMASI</div><div class="problem-arrow">&#8594;</div><div class="problem-node pressure">TEKANAN PSIKOLOGIS</div><div class="problem-arrow">&#8594;</div><div class="problem-node risk">TINDAKAN IMPULSIF</div></div><div class="jeda-interrupt"><span class="jeda-badge">J.E.D.A.</span><p><strong>HADANGIN menyisipkan ruang berpikir.</strong><br>Dalam bahasa Indonesia, jeda berarti berhenti atau mengambil jarak sejenak sebelum bereaksi. J.E.D.A. menerjemahkan Pause, Question, Check, Decide ke dalam logika budaya Gobak Sodor: menahan informasi di batas sebelum berubah menjadi tindakan berisiko.</p></div></div></section>
    <section class="section"><div class="page-shell"><div class="section-header"><p class="section-kicker">Prinsip produk</p><h2>Dibangun untuk memperkuat agensi manusia</h2></div><div class="principle-grid four"><article class="card principle-card"><h3>Accessible</h3><p>Mobile-first, hemat bandwidth, dan menggunakan bahasa yang sederhana.</p></article><article class="card principle-card"><h3>Reflective, Not Punitive</h3><p>Tidak mempermalukan pengguna ketika penilaian awalnya keliru.</p></article><article class="card principle-card"><h3>Human Agency</h3><p>AI mendukung keputusan, bukan mengambil alih keputusan.</p></article><article class="card principle-card"><h3>Locally Grounded</h3><p>Berangkat dari konteks digital Indonesia dengan prinsip yang dapat digunakan lintas budaya.</p></article></div></div></section>
    <section class="section section-dark"><div class="page-shell"><div class="section-header"><p class="section-kicker">Untuk siapa</p><h2>Literasi yang dekat dengan kehidupan digital sehari-hari</h2><p>Ditujukan bagi pengguna digital, anak muda, keluarga, komunitas, pendidik, organisasi pemuda, advokat MIL, peneliti, dan pemangku kebijakan.</p></div><div class="chip-row"><span class="chip chip-blue">Everyday Digital Users</span><span class="chip chip-blue">Youth &amp; Young Adults</span><span class="chip chip-blue">Family &amp; Community</span><span class="chip chip-terra">Educators</span><span class="chip chip-terra">MIL Advocates</span><span class="chip chip-terra">Researchers</span></div></div></section>`}function on(e){let t=de.find(t=>t.id===e)||de[0];Le(),N.content=t.payload||t.content,N.casePrompt=t.content,N.inputType=t.inputType||`text`,N.qrInputMode=t.inputMode||`link`,N.fileName=``,N.imageDataUrl=``,N.audioDataUrl=``,N.qrImageDataUrl=``,N.scenarioId=t.id,N.aiWrong=!!t.aiWrong,N.trainingScenario=!0,N.inFlow=!0,N.stage=2,location.hash=`#/verify`,Fe()===`verify`&&z()}function sn(e,t){let n={"initial-decision":`initialDecision`,"neutral-impact":`neutralImpact`,evidence:`evidence`,"requested-action":`requestedAction`,consequence:`consequence`,"safer-action":`saferAction`,"final-decision":`finalDecision`,priority:`priority`};N[n[e]]=t,z({preserveScroll:!0})}function cn(e,t){let n={pressure:`pressure`,emotion:`emotion`,reflection:`reflection`}[e],r=N[n];r.includes(t)?N[n]=r.filter(e=>e!==t):e!==`reflection`||r.length<2?N[n]=[...r,t]:Pe(`Pilih paling banyak dua faktor refleksi.`),z({preserveScroll:!0})}window.addEventListener(`hadang:vision-status`,e=>{let{kind:t,message:n}=e.detail,r=document.querySelector(`.community-vision-stage`),i=document.querySelector(`[data-vision-status]`),a=document.querySelector(`#vision-status-text`);r&&(r.dataset.visionState=t),i&&(i.dataset.visionStatus=t),a&&(a.textContent=n)}),window.addEventListener(`hadang:vision-line-complete`,e=>{let t=e.detail?.line;!t||V.mode!==`vision`||V.completedLines.includes(t)||(V.completedLines=[...V.completedLines,t],A(V.completedLines),Pe(`Garis ${t} berhasil dihadang dengan pose tubuh.`),z({preserveScroll:!0}))}),document.addEventListener(`click`,e=>{let t=e.target.closest(`button, a`);if(!t)return;if(t.matches(`[data-theme-toggle]`))Ne(document.documentElement.dataset.theme===`light`?`blue`:`light`);else if(t.matches(`[data-language-toggle]`)){je(De()===`en`?`id`:`en`);return}if(t.matches(`.menu-toggle`)){let e=document.querySelector(`.main-nav`).classList.toggle(`open`);t.setAttribute(`aria-expanded`,String(e));return}if(t.dataset.scrollTo){document.getElementById(t.dataset.scrollTo)?.scrollIntoView({behavior:`smooth`});return}if(t.dataset.communityAudience){V.audience=t.dataset.communityAudience,z({preserveScroll:!0});return}if(t.dataset.communityDuration){V.duration=t.dataset.communityDuration,z({preserveScroll:!0});return}if(t.dataset.communityPack){V.packId=t.dataset.communityPack,z({preserveScroll:!0});return}if(t.dataset.communityMode){V.playMode=t.dataset.communityMode,z({preserveScroll:!0});return}if(t.dataset.communityLine){let e=t.dataset.communityLine;V.completedLines.includes(e)||(V.completedLines=[...V.completedLines,e],A(V.completedLines)),z({preserveScroll:!0});return}if(t.dataset.communityPrep!==void 0){let e=Number(t.dataset.communityPrep);V.prepChecks=V.prepChecks.includes(e)?V.prepChecks.filter(t=>t!==e):[...V.prepChecks,e],z({preserveScroll:!0});return}if(t.dataset.communityVote){let[e,n,r]=t.dataset.communityVote.split(`:`),i=Number(n),a=Number(r);V.votes[e][i]=Math.max(0,V.votes[e][i]+a),z({preserveScroll:!0});return}if(t.dataset.communityAnswer!==void 0){V.selectedAnswer=Number(t.dataset.communityAnswer),Nt(),z({preserveScroll:!0});return}if(t.dataset.communityTactic){V.revealedTactic=t.dataset.communityTactic,z({preserveScroll:!0});return}if(t.dataset.inputType){let e=document.querySelector(`#content-input`);e&&(N.content=e.value.trim());let n=t.dataset.inputType;n!==N.inputType&&[`image`,`audio`].includes(n)&&(N.fileName=``,N.imageDataUrl=``,N.audioDataUrl=``,N.content=``),n===`text`&&!N.content&&(N.content=ae),N.inputType=n,N.trainingScenario=!1,N.casePrompt=``,n===`audio`&&(N.scenarioId=`audio-impersonation`),n===`qr`&&(N.scenarioId=N.qrInputMode===`image`?`qr-payment`:`bank-message`),z({preserveScroll:!0});return}if(t.dataset.xaiMode){N.xaiMode=t.dataset.xaiMode,z({preserveScroll:!0});return}if(t.dataset.audioXaiMode){N.audioXaiMode=t.dataset.audioXaiMode,z({preserveScroll:!0});return}if(t.dataset.qrXaiMode){N.qrXaiMode=t.dataset.qrXaiMode,z({preserveScroll:!0});return}if(t.dataset.qrInputMode){N.qrInputMode=t.dataset.qrInputMode,N.qrXaiMode=`risk`,N.fileName=``,N.qrImageDataUrl=``,N.content=``,N.scenarioId=N.qrInputMode===`image`?`qr-payment`:`bank-message`,N.trainingScenario=!1,N.casePrompt=``,z({preserveScroll:!0});return}if(t.dataset.select){sn(t.dataset.select,t.dataset.value);return}if(t.dataset.multi){cn(t.dataset.multi,t.dataset.value);return}if(t.dataset.gameControl){let e=t.dataset.gameControl;e===`block`?ot():B&&(B.guardY=Math.min(B.yMax,Math.max(B.yMin,B.guardY+(e===`down`?B.nudge:-B.nudge))),N.guardY=B.guardY,B.guard&&(B.guard.style.top=`${B.guardY}%`));return}if(t.dataset.scenario){on(t.dataset.scenario);return}let n=t.dataset.action;if(n){if(n===`start-community`){let e=document.querySelector(`#community-participants`),t=document.querySelector(`#community-team-arus`),n=document.querySelector(`#community-team-hadang`);V.participants=Math.min(120,Math.max(4,Number(e?.value)||24)),V.teamArus=t?.value.trim()||`Tim Arus`,V.teamHadang=n?.value.trim()||`Tim Hadang`,V.mode=V.playMode===`vision`?`vision`:`prepare`,V.phase=0,V.prepChecks=[],V.round=1,V.scores={arus:0,hadang:0},V.completedLines=[],V.visionUsed=!1,V.votes={initial:[0,0,0,0],final:[0,0,0,0]},z(),setTimeout(()=>document.querySelector(V.mode===`vision`?`.community-live`:`.offline-prep`)?.scrollIntoView(),0)}else if(n===`community-next`){if(V.mode===`prepare`)Qt(!1);else if(V.phase===0)V.phase=1,Zt();else if(V.phase===2)V.phase=3;else if(V.phase===3){if(!V.finalBonusApplied){let e=V.votes.final[1]+V.votes.final[2],t=V.votes.final[0];e>t?V.scores.hadang+=2:t>e&&(V.scores.arus+=2),V.finalBonusApplied=!0}V.phase=4}z({preserveScroll:!0})}else if(n===`reset-community`)Nt(),ne(),V.mode=`setup`,V.playMode=`offline`,V.phase=0,V.round=1,V.scores={arus:0,hadang:0},V.prepChecks=[],V.completedLines=[],z();else if(n===`community-vision-next`){if(V.phase===1&&V.completedLines.length<4)return;V.phase=Math.min(3,V.phase+1),z({preserveScroll:!0})}else if(n===`toggle-community-camera`)re()?(ne(),z({preserveScroll:!0})):j(V.completedLines).then(e=>{if(e){V.visionUsed=!0;let e=document.querySelector(`[data-action="toggle-community-camera"]`);e&&(e.textContent=`Matikan Kamera`)}});else if(n===`download-community-kit`)Kt();else if(n===`print-community-kit`)qt();else if(n===`community-timer`)Yt();else if(n===`community-pressure`)V.pressureUsed=!0,V.timerRemaining=Math.max(0,V.timerRemaining-5),t.disabled=!0,Jt(),Pe(`Kartu tekanan dimainkan: waktu Tim Hadang berkurang 5 detik.`),V.timerRemaining===0&&Xt(!0);else if(n===`community-lock-answer`)Xt(!1);else if(n===`community-next-line`)V.lineIndex<3?(V.lineIndex+=1,Zt()):(V.phase=2,Nt()),z({preserveScroll:!0});else if(n===`community-swap-round`)V.round+=1,Qt(!0),z();else if(n===`focus-question`){if(!N.gameRoundComplete&&N.hadangStep>=0){ot(),Pe(`Tangkap token informasi terlebih dahulu.`);return}if(!N.questionOpen){N.questionOpen=!0,z({preserveScroll:!0});return}let e=document.querySelector(`#game-question-panel`);e?.scrollIntoView({behavior:`smooth`,block:`nearest`}),e?.classList.add(`panel-attention`),setTimeout(()=>e?.classList.remove(`panel-attention`),600)}else if(n===`hide-question`)N.questionOpen=!1,z({preserveScroll:!0});else if(n===`retry-round`)ft(!0),z({preserveScroll:!0});else if(n===`remove-image`)N.fileName=``,N.imageDataUrl=``,N.content=``,z(),setTimeout(()=>document.getElementById(`verify-tool`)?.scrollIntoView(),0);else if(n===`remove-audio`)N.fileName=``,N.audioDataUrl=``,N.content=``,z(),setTimeout(()=>document.getElementById(`verify-tool`)?.scrollIntoView(),0);else if(n===`remove-qr`)N.fileName=``,N.qrImageDataUrl=``,N.content=``,z(),setTimeout(()=>document.getElementById(`verify-tool`)?.scrollIntoView(),0);else if(n===`direct-ai`||n===`start-check`){let e=document.querySelector(`#content-input`);if(e?.value.trim()&&(N.content=e.value.trim()),[`image`,`audio`].includes(N.inputType)&&!N.fileName)return Pe(`Pilih file terlebih dahulu.`);if(N.inputType===`qr`&&N.qrInputMode===`image`&&!N.fileName)return Pe(`Pilih gambar QR terlebih dahulu.`);if(N.inputType===`qr`&&N.qrInputMode===`link`&&!N.content.trim().match(/^https?:\/\//i))return Pe(`Masukkan tautan yang valid, diawali http:// atau https://.`);if(!N.content&&!N.fileName)return Pe(`Masukkan konten atau pilih file terlebih dahulu.`);N.directDetection=n===`direct-ai`,N.inFlow=!0,N.stage=N.directDetection?4:2,z()}else if(n===`back-to-input`)N.inFlow=!1,N.directDetection=!1,z(),setTimeout(()=>document.getElementById(`verify-tool`)?.scrollIntoView(),0);else if(n===`switch-to-plus`)N.directDetection=!1,N.inFlow=!0,N.stage=2,N.initialDecision=``,z();else if(n===`cancel-flow`)Le(),z();else if(n===`lock-initial`)N.stage=3,N.hadangStep=-1,z();else if(n===`enter-arena`)N.hadangStep=0,N.gameScore=0,N.gameLives=3,N.gameCombo=1,N.gameCatches=0,ft(!1),z();else if(n===`hadang-back`)N.hadangStep>0?(--N.hadangStep,ft(!1),N.questionOpen=!0):N.hadangStep=-1,N.hadangStep===-1&&(N.questionOpen=!0),z();else if(n===`hadang-next`)N.hadangStep<3?(N.hadangStep+=1,ft(!1)):N.stage=4,N.stage!==4&&(N.questionOpen=!1),z();else if(n===`back-to-hadang`)N.stage=3,N.hadangStep=3,z();else if(n===`compare-judgment`)N.stage=5,z();else if(n===`back-to-ai`)N.stage=4,z();else if(n===`lock-final`)N.stage=6,z();else if(n===`back-to-final`)N.stage=5,z();else if(n===`show-result`)N.result=!0,z();else if(n===`restart-flow`){let e=N.content;Le(),N.content=e,z()}}}),document.addEventListener(`input`,e=>{e.target.matches(`#content-input`)&&(N.content=e.target.value,N.scenarioId=N.inputType===`qr`?`bank-message`:`family-emergency`,N.aiWrong=!1,N.trainingScenario=!1,N.casePrompt=``),e.target.dataset.range===`initial-confidence`&&(N.initialConfidence=Number(e.target.value),e.target.closest(`.confidence-box`).querySelector(`.confidence-value`).textContent=`${N.initialConfidence}% yakin`),e.target.dataset.range===`final-confidence`&&(N.finalConfidence=Number(e.target.value),e.target.closest(`.confidence-box`).querySelector(`.confidence-value`).textContent=`${N.finalConfidence}% yakin`)}),document.addEventListener(`change`,e=>{if(e.target.matches(`#file-input`)){let t=e.target.files?.[0];if(!t)return;ln(t)}});function ln(e){if(e.size>10485760)return Pe(`Ukuran file melebihi batas 10 MB.`);let t=N.inputType===`image`||N.inputType===`qr`&&N.qrInputMode===`image`,n=N.inputType===`audio`;if(t&&!e.type.startsWith(`image/`))return Pe(`Pilih file gambar PNG, JPG, atau WEBP.`);if(n&&!e.type.startsWith(`audio/`))return Pe(`Pilih file audio MP3, WAV, atau M4A.`);N.fileName=e.name,N.content=`${n?`Rekaman audio`:N.inputType===`qr`?`Gambar QR`:`Gambar`}: ${e.name}`,N.scenarioId=n?`audio-impersonation`:N.inputType===`qr`?`qr-payment`:`manipulated-media`,N.aiWrong=!1,N.trainingScenario=!1,N.casePrompt=``,N.xaiMode=`bounding`;let r=new FileReader;r.addEventListener(`load`,()=>{n?N.audioDataUrl=String(r.result):N.inputType===`qr`?N.qrImageDataUrl=String(r.result):N.imageDataUrl=String(r.result),z(),setTimeout(()=>document.getElementById(`verify-tool`)?.scrollIntoView(),0)},{once:!0}),r.addEventListener(`error`,()=>Pe(`File tidak dapat dibaca.`),{once:!0}),r.readAsDataURL(e)}document.addEventListener(`dragover`,e=>{let t=e.target.closest?.(`[data-drop-zone]`);!t||![`image`,`audio`,`qr`].includes(N.inputType)||(e.preventDefault(),t.classList.add(`drag-active`))}),document.addEventListener(`dragleave`,e=>{let t=e.target.closest?.(`[data-drop-zone]`);!t||t.contains(e.relatedTarget)||t.classList.remove(`drag-active`)}),document.addEventListener(`drop`,e=>{let t=e.target.closest?.(`[data-drop-zone]`);if(!t||![`image`,`audio`,`qr`].includes(N.inputType))return;e.preventDefault(),t.classList.remove(`drag-active`);let n=e.dataTransfer?.files?.[0];n&&ln(n)}),document.addEventListener(`pointermove`,e=>{let t=e.target.closest?.(`.hadang-game-stage`);if(!t||matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let n=t.getBoundingClientRect(),r=((e.clientX-n.left)/n.width-.5)*-12,i=((e.clientY-n.top)/n.height-.5)*-8;t.style.setProperty(`--scene-x`,`${r.toFixed(2)}px`),t.style.setProperty(`--scene-y`,`${i.toFixed(2)}px`)}),document.addEventListener(`pointerout`,e=>{let t=e.target.closest?.(`.hadang-game-stage`);!t||t.contains(e.relatedTarget)||(t.style.setProperty(`--scene-x`,`0px`),t.style.setProperty(`--scene-y`,`0px`))}),document.addEventListener(`keydown`,e=>{!B||![`ArrowUp`,`ArrowDown`,`w`,`W`,`s`,`S`,` `].includes(e.key)||(e.preventDefault(),e.key===` `?ot():nt.add(e.key.toLowerCase()))}),document.addEventListener(`keyup`,e=>{nt.delete(e.key.toLowerCase())}),document.addEventListener(`pointerdown`,e=>{let t=e.target.closest?.(`[data-game-control]`),n=t?.dataset.gameControl;if(B&&[`up`,`down`].includes(n)){e.preventDefault(),t.classList.add(`is-pressed`),t.setPointerCapture?.(e.pointerId),nt.add(n===`up`?`arrowup`:`arrowdown`);return}let r=e.target.closest?.(`.arena-stage.interactive-arena`);!B||!r||e.target.closest?.(`button, .arena-controls`)||(e.preventDefault(),st(e.clientY))}),document.addEventListener(`pointerup`,e=>{e.target.closest?.(`[data-game-control]`)?.classList.remove(`is-pressed`),ct()}),document.addEventListener(`pointercancel`,ct),window.addEventListener(`blur`,ct),window.addEventListener(`hashchange`,z),location.hash||history.replaceState(null,``,`#/verify`),z(),Me===`en`&&je(`en`,!1),Object.assign(window,{DEFAULT_MESSAGE:ae,state:N,render:z,resetFlow:Le,startScenario:on,processUploadedFile:ln,setLanguage:je,translateToEnglish:ke});var un={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},dn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},fn=1e3,pn=1001,mn=1002,hn=1003,gn=1004,_n=1005,vn=1006,yn=1007,bn=1008,xn=1009,Sn=1010,Cn=1011,wn=1012,Tn=1013,En=1014,Dn=1015,On=1016,kn=1017,An=1018,jn=1020,Mn=35902,Nn=35899,Pn=1021,Fn=1022,In=1023,Ln=1026,Rn=1027,zn=1028,Bn=1029,Vn=1030,Hn=1031,Un=1033,Wn=33776,Gn=33777,Kn=33778,qn=33779,Jn=35840,Yn=35841,Xn=35842,Zn=35843,Qn=36196,$n=37492,er=37496,tr=37488,nr=37489,rr=37490,ir=37491,ar=37808,or=37809,sr=37810,cr=37811,lr=37812,ur=37813,dr=37814,fr=37815,pr=37816,mr=37817,hr=37818,gr=37819,_r=37820,vr=37821,yr=36492,br=36494,xr=36495,Sr=36283,Cr=36284,wr=36285,Tr=36286,Er=2300,Dr=2301,Or=2302,kr=2303,Ar=2400,jr=2401,Mr=2402,Nr=3200,Pr=`srgb`,Fr=`srgb-linear`,Ir=`linear`,Lr=`srgb`,Rr=7680,zr=35044,Br=2e3;function Vr(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Hr(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Ur(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Wr(){let e=Ur(`canvas`);return e.style.display=`block`,e}var Gr={};function Kr(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function qr(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function H(...e){e=qr(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function U(...e){e=qr(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Jr(...e){let t=e.join(` `);t in Gr||(Gr[t]=!0,H(...e))}function Yr(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Xr={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},Zr=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Qr=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),$r=1234567,ei=Math.PI/180,ti=180/Math.PI;function ni(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Qr[e&255]+Qr[e>>8&255]+Qr[e>>16&255]+Qr[e>>24&255]+`-`+Qr[t&255]+Qr[t>>8&255]+`-`+Qr[t>>16&15|64]+Qr[t>>24&255]+`-`+Qr[n&63|128]+Qr[n>>8&255]+`-`+Qr[n>>16&255]+Qr[n>>24&255]+Qr[r&255]+Qr[r>>8&255]+Qr[r>>16&255]+Qr[r>>24&255]).toLowerCase()}function W(e,t,n){return Math.max(t,Math.min(n,e))}function ri(e,t){return(e%t+t)%t}function ii(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ai(e,t,n){return e===t?0:(n-e)/(t-e)}function oi(e,t,n){return(1-n)*e+n*t}function si(e,t,n,r){return oi(e,t,1-Math.exp(-n*r))}function ci(e,t=1){return t-Math.abs(ri(e,t*2)-t)}function li(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function ui(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function di(e,t){return e+Math.floor(Math.random()*(t-e+1))}function fi(e,t){return e+Math.random()*(t-e)}function pi(e){return e*(.5-Math.random())}function mi(e){e!==void 0&&($r=e);let t=$r+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function hi(e){return e*ei}function gi(e){return e*ti}function _i(e){return!(e&e-1)&&e!==0}function vi(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function yi(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function bi(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:H(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function xi(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function G(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Si={DEG2RAD:ei,RAD2DEG:ti,generateUUID:ni,clamp:W,euclideanModulo:ri,mapLinear:ii,inverseLerp:ai,lerp:oi,damp:si,pingpong:ci,smoothstep:li,smootherstep:ui,randInt:di,randFloat:fi,randFloatSpread:pi,seededRandom:mi,degToRad:hi,radToDeg:gi,isPowerOfTwo:_i,ceilPowerOfTwo:vi,floorPowerOfTwo:yi,setQuaternionFromProperEuler:bi,normalize:G,denormalize:xi},K=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(W(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ci=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:H(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(W(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},q=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ti.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ti.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this.z=W(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this.z=W(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return wi.copy(this).projectOnVector(e),this.sub(wi)}reflect(e){return this.sub(wi.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(W(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},wi=new q,Ti=new Ci,J=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Jr(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Ei.makeScale(e,t)),this}rotate(e){return Jr(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Ei.makeRotation(-e)),this}translate(e,t){return Jr(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Ei.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ei=new J,Di=new J().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Oi=new J().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ki(){let e={enabled:!0,workingColorSpace:Fr,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Ai(e.r),e.g=Ai(e.g),e.b=Ai(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=ji(e.r),e.g=ji(e.g),e.b=ji(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Ir:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Jr(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Jr(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Fr]:{primaries:t,whitePoint:r,transfer:Ir,toXYZ:Di,fromXYZ:Oi,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Pr},outputColorSpaceConfig:{drawingBufferColorSpace:Pr}},[Pr]:{primaries:t,whitePoint:r,transfer:Lr,toXYZ:Di,fromXYZ:Oi,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Pr}}}),e}var Y=ki();function Ai(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function ji(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Mi,Ni=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Mi===void 0&&(Mi=Ur(`canvas`)),Mi.width=e.width,Mi.height=e.height;let t=Mi.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Mi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Ur(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Ai(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Ai(t[e]/255)*255):t[e]=Ai(t[e]);return{data:t,width:e.width,height:e.height}}return H(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Pi=0,Fi=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Pi++}),this.uuid=ni(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Ii(r[t].image)):e.push(Ii(r[t]))}else e=Ii(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Ii(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Ni.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(H(`Texture: Unable to serialize Texture.`),{})}var Li=0,Ri=new q,zi=class e extends Zr{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=pn,i=pn,a=vn,o=bn,s=In,c=xn,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Li++}),this.uuid=ni(),this.name=``,this.source=new Fi(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new K(0,0),this.repeat=new K(1,1),this.center=new K(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new J,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ri).x}get height(){return this.source.getSize(Ri).y}get depth(){return this.source.getSize(Ri).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){H(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){H(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fn:e.x-=Math.floor(e.x);break;case pn:e.x=e.x<0?0:1;break;case mn:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case fn:e.y-=Math.floor(e.y);break;case pn:e.y=e.y<0?0:1;break;case mn:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};zi.DEFAULT_IMAGE=null,zi.DEFAULT_MAPPING=300,zi.DEFAULT_ANISOTROPY=1;var Bi=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this.z=W(this.z,e.z,t.z),this.w=W(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this.z=W(this.z,e,t),this.w=W(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Vi=class extends Zr{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Bi(0,0,e,t),this.scissorTest=!1,this.viewport=new Bi(0,0,e,t),this.textures=[];let r=new zi({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:vn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Fi(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Hi=class extends Vi{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ui=class extends zi{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=hn,this.minFilter=hn,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Wi=class extends zi{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=hn,this.minFilter=hn,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Gi=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Ki.setFromMatrixColumn(e,0).length(),i=1/Ki.setFromMatrixColumn(e,1).length(),a=1/Ki.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ji,e,Yi)}lookAt(e,t,n){let r=this.elements;return Qi.subVectors(e,t),Qi.lengthSq()===0&&(Qi.z=1),Qi.normalize(),Xi.crossVectors(n,Qi),Xi.lengthSq()===0&&(Math.abs(n.z)===1?Qi.x+=1e-4:Qi.z+=1e-4,Qi.normalize(),Xi.crossVectors(n,Qi)),Xi.normalize(),Zi.crossVectors(Qi,Xi),r[0]=Xi.x,r[4]=Zi.x,r[8]=Qi.x,r[1]=Xi.y,r[5]=Zi.y,r[9]=Qi.y,r[2]=Xi.z,r[6]=Zi.z,r[10]=Qi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],ee=r[10],te=r[14],j=r[3],ne=r[7],re=r[11],M=r[15];return i[0]=a*x+o*T+s*k+c*j,i[4]=a*S+o*E+s*A+c*ne,i[8]=a*C+o*D+s*ee+c*re,i[12]=a*w+o*O+s*te+c*M,i[1]=l*x+u*T+d*k+f*j,i[5]=l*S+u*E+d*A+f*ne,i[9]=l*C+u*D+d*ee+f*re,i[13]=l*w+u*O+d*te+f*M,i[2]=p*x+m*T+h*k+g*j,i[6]=p*S+m*E+h*A+g*ne,i[10]=p*C+m*D+h*ee+g*re,i[14]=p*w+m*O+h*te+g*M,i[3]=_*x+v*T+y*k+b*j,i[7]=_*S+v*E+y*A+b*ne,i[11]=_*C+v*D+y*ee+b*re,i[15]=_*w+v*O+y*te+b*M,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Ki.set(r[0],r[1],r[2]).length(),o=Ki.set(r[4],r[5],r[6]).length(),s=Ki.set(r[8],r[9],r[10]).length();i<0&&(a=-a),qi.copy(this);let c=1/a,l=1/o,u=1/s;return qi.elements[0]*=c,qi.elements[1]*=c,qi.elements[2]*=c,qi.elements[4]*=l,qi.elements[5]*=l,qi.elements[6]*=l,qi.elements[8]*=u,qi.elements[9]*=u,qi.elements[10]*=u,t.setFromRotationMatrix(qi),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Br,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Br,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Ki=new q,qi=new Gi,Ji=new q(0,0,0),Yi=new q(1,1,1),Xi=new q,Zi=new q,Qi=new q,$i=new Gi,ea=new Ci,ta=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(W(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-W(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(W(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-W(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(W(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-W(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:H(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return $i.makeRotationFromQuaternion(e),this.setFromRotationMatrix($i,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ea.setFromEuler(this),this.setFromQuaternion(ea,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ta.DEFAULT_ORDER=`XYZ`;var na=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},ra=0,ia=new q,aa=new Ci,oa=new Gi,sa=new q,ca=new q,la=new q,ua=new Ci,da=new q(1,0,0),fa=new q(0,1,0),pa=new q(0,0,1),ma={type:`added`},ha={type:`removed`},ga={type:`childadded`,child:null},_a={type:`childremoved`,child:null},va=class e extends Zr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ra++}),this.uuid=ni(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new q,n=new ta,r=new Ci,i=new q(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Gi},normalMatrix:{value:new J}}),this.matrix=new Gi,this.matrixWorld=new Gi,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new na,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return aa.setFromAxisAngle(e,t),this.quaternion.multiply(aa),this}rotateOnWorldAxis(e,t){return aa.setFromAxisAngle(e,t),this.quaternion.premultiply(aa),this}rotateX(e){return this.rotateOnAxis(da,e)}rotateY(e){return this.rotateOnAxis(fa,e)}rotateZ(e){return this.rotateOnAxis(pa,e)}translateOnAxis(e,t){return ia.copy(e).applyQuaternion(this.quaternion),this.position.add(ia.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(da,e)}translateY(e){return this.translateOnAxis(fa,e)}translateZ(e){return this.translateOnAxis(pa,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(oa.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?sa.copy(e):sa.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),ca.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?oa.lookAt(ca,sa,this.up):oa.lookAt(sa,ca,this.up),this.quaternion.setFromRotationMatrix(oa),r&&(oa.extractRotation(r.matrixWorld),aa.setFromRotationMatrix(oa),this.quaternion.premultiply(aa.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(U(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ma),ga.child=e,this.dispatchEvent(ga),ga.child=null):U(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ha),_a.child=e,this.dispatchEvent(_a),_a.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),oa.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),oa.multiply(e.parent.matrixWorld)),e.applyMatrix4(oa),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ma),ga.child=e,this.dispatchEvent(ga),ga.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ca,e,la),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ca,ua,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};va.DEFAULT_UP=new q(0,1,0),va.DEFAULT_MATRIX_AUTO_UPDATE=!0,va.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ya=class extends va{constructor(){super(),this.isGroup=!0,this.type=`Group`}},ba={type:`move`},xa=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ya,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ya,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ya,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ba)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ya;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Sa={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ca={h:0,s:0,l:0},wa={h:0,s:0,l:0};function Ta(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var X=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Pr){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Y.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Y.workingColorSpace){return this.r=e,this.g=t,this.b=n,Y.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Y.workingColorSpace){if(e=ri(e,1),t=W(t,0,1),n=W(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Ta(i,r,e+1/3),this.g=Ta(i,r,e),this.b=Ta(i,r,e-1/3)}return Y.colorSpaceToWorking(this,r),this}setStyle(e,t=Pr){function n(t){t!==void 0&&parseFloat(t)<1&&H(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:H(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);H(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Pr){let n=Sa[e.toLowerCase()];return n===void 0?H(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ai(e.r),this.g=Ai(e.g),this.b=Ai(e.b),this}copyLinearToSRGB(e){return this.r=ji(e.r),this.g=ji(e.g),this.b=ji(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pr){return Y.workingToColorSpace(Ea.copy(this),e),Math.round(W(Ea.r*255,0,255))*65536+Math.round(W(Ea.g*255,0,255))*256+Math.round(W(Ea.b*255,0,255))}getHexString(e=Pr){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Y.workingColorSpace){Y.workingToColorSpace(Ea.copy(this),t);let n=Ea.r,r=Ea.g,i=Ea.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Y.workingColorSpace){return Y.workingToColorSpace(Ea.copy(this),t),e.r=Ea.r,e.g=Ea.g,e.b=Ea.b,e}getStyle(e=Pr){Y.workingToColorSpace(Ea.copy(this),e);let t=Ea.r,n=Ea.g,r=Ea.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Ca),this.setHSL(Ca.h+e,Ca.s+t,Ca.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ca),e.getHSL(wa);let n=oi(Ca.h,wa.h,t),r=oi(Ca.s,wa.s,t),i=oi(Ca.l,wa.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ea=new X;X.NAMES=Sa;var Da=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new X(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Oa=class extends va{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ta,this.environmentIntensity=1,this.environmentRotation=new ta,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},ka=new q,Aa=new q,ja=new q,Ma=new q,Na=new q,Pa=new q,Fa=new q,Ia=new q,La=new q,Ra=new q,za=new Bi,Ba=new Bi,Va=new Bi,Ha=class e{constructor(e=new q,t=new q,n=new q){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),ka.subVectors(e,t),r.cross(ka);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){ka.subVectors(r,t),Aa.subVectors(n,t),ja.subVectors(e,t);let a=ka.dot(ka),o=ka.dot(Aa),s=ka.dot(ja),c=Aa.dot(Aa),l=Aa.dot(ja),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Ma)!==null&&Ma.x>=0&&Ma.y>=0&&Ma.x+Ma.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Ma)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Ma.x),s.addScaledVector(a,Ma.y),s.addScaledVector(o,Ma.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return za.setScalar(0),Ba.setScalar(0),Va.setScalar(0),za.fromBufferAttribute(e,t),Ba.fromBufferAttribute(e,n),Va.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(za,i.x),a.addScaledVector(Ba,i.y),a.addScaledVector(Va,i.z),a}static isFrontFacing(e,t,n,r){return ka.subVectors(n,t),Aa.subVectors(e,t),ka.cross(Aa).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ka.subVectors(this.c,this.b),Aa.subVectors(this.a,this.b),ka.cross(Aa).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Na.subVectors(r,n),Pa.subVectors(i,n),Ia.subVectors(e,n);let s=Na.dot(Ia),c=Pa.dot(Ia);if(s<=0&&c<=0)return t.copy(n);La.subVectors(e,r);let l=Na.dot(La),u=Pa.dot(La);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Na,a);Ra.subVectors(e,i);let f=Na.dot(Ra),p=Pa.dot(Ra);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Pa,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Fa.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Fa,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Na,a).addScaledVector(Pa,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Ua=class{constructor(e=new q(1/0,1/0,1/0),t=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ga.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ga.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Ga.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Ga):Ga.fromBufferAttribute(r,t),Ga.applyMatrix4(e.matrixWorld),this.expandByPoint(Ga);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Ka.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Ka.copy(e.boundingBox)),Ka.applyMatrix4(e.matrixWorld),this.union(Ka)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ga),Ga.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter($a),eo.subVectors(this.max,$a),qa.subVectors(e.a,$a),Ja.subVectors(e.b,$a),Ya.subVectors(e.c,$a),Xa.subVectors(Ja,qa),Za.subVectors(Ya,Ja),Qa.subVectors(qa,Ya);let t=[0,-Xa.z,Xa.y,0,-Za.z,Za.y,0,-Qa.z,Qa.y,Xa.z,0,-Xa.x,Za.z,0,-Za.x,Qa.z,0,-Qa.x,-Xa.y,Xa.x,0,-Za.y,Za.x,0,-Qa.y,Qa.x,0];return!ro(t,qa,Ja,Ya,eo)||(t=[1,0,0,0,1,0,0,0,1],!ro(t,qa,Ja,Ya,eo))?!1:(to.crossVectors(Xa,Za),t=[to.x,to.y,to.z],ro(t,qa,Ja,Ya,eo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ga).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ga).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Wa[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Wa[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Wa[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Wa[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Wa[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Wa[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Wa[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Wa[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Wa),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Wa=[new q,new q,new q,new q,new q,new q,new q,new q],Ga=new q,Ka=new Ua,qa=new q,Ja=new q,Ya=new q,Xa=new q,Za=new q,Qa=new q,$a=new q,eo=new q,to=new q,no=new q;function ro(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){no.fromArray(e,a);let o=i.x*Math.abs(no.x)+i.y*Math.abs(no.y)+i.z*Math.abs(no.z),s=t.dot(no),c=n.dot(no),l=r.dot(no);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var io=new q,ao=new K,oo=0,so=class extends Zr{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:oo++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=zr,this.updateRanges=[],this.gpuType=Dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ao.fromBufferAttribute(this,t),ao.applyMatrix3(e),this.setXY(t,ao.x,ao.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)io.fromBufferAttribute(this,t),io.applyMatrix3(e),this.setXYZ(t,io.x,io.y,io.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)io.fromBufferAttribute(this,t),io.applyMatrix4(e),this.setXYZ(t,io.x,io.y,io.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)io.fromBufferAttribute(this,t),io.applyNormalMatrix(e),this.setXYZ(t,io.x,io.y,io.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)io.fromBufferAttribute(this,t),io.transformDirection(e),this.setXYZ(t,io.x,io.y,io.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=xi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=G(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=xi(t,this.array)),t}setX(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=xi(t,this.array)),t}setY(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=xi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=xi(t,this.array)),t}setW(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=G(t,this.array),n=G(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=G(t,this.array),n=G(n,this.array),r=G(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=G(t,this.array),n=G(n,this.array),r=G(r,this.array),i=G(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:`dispose`})}},co=class extends so{constructor(e,t,n){super(new Uint16Array(e),t,n)}},lo=class extends so{constructor(e,t,n){super(new Uint32Array(e),t,n)}},uo=class extends so{constructor(e,t,n){super(new Float32Array(e),t,n)}},fo=new Ua,po=new q,mo=new q,ho=class{constructor(e=new q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?fo.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;po.subVectors(e,this.center);let t=po.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(po,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(mo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(po.copy(e.center).add(mo)),this.expandByPoint(po.copy(e.center).sub(mo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},go=0,_o=new Gi,vo=new va,yo=new q,bo=new Ua,xo=new Ua,So=new q,Co=class e extends Zr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:go++}),this.uuid=ni(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Vr(e)?lo:co)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new J().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return _o.makeRotationFromQuaternion(e),this.applyMatrix4(_o),this}rotateX(e){return _o.makeRotationX(e),this.applyMatrix4(_o),this}rotateY(e){return _o.makeRotationY(e),this.applyMatrix4(_o),this}rotateZ(e){return _o.makeRotationZ(e),this.applyMatrix4(_o),this}translate(e,t,n){return _o.makeTranslation(e,t,n),this.applyMatrix4(_o),this}scale(e,t,n){return _o.makeScale(e,t,n),this.applyMatrix4(_o),this}lookAt(e){return vo.lookAt(e),vo.updateMatrix(),this.applyMatrix4(vo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(yo).negate(),this.translate(yo.x,yo.y,yo.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new uo(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&H(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ua);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){U(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];bo.setFromBufferAttribute(n),this.morphTargetsRelative?(So.addVectors(this.boundingBox.min,bo.min),this.boundingBox.expandByPoint(So),So.addVectors(this.boundingBox.max,bo.max),this.boundingBox.expandByPoint(So)):(this.boundingBox.expandByPoint(bo.min),this.boundingBox.expandByPoint(bo.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&U(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ho);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){U(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new q,1/0);return}if(e){let n=this.boundingSphere.center;if(bo.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];xo.setFromBufferAttribute(n),this.morphTargetsRelative?(So.addVectors(bo.min,xo.min),bo.expandByPoint(So),So.addVectors(bo.max,xo.max),bo.expandByPoint(So)):(bo.expandByPoint(xo.min),bo.expandByPoint(xo.max))}bo.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)So.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(So));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)So.fromBufferAttribute(a,t),o&&(yo.fromBufferAttribute(e,t),So.add(yo)),r=Math.max(r,n.distanceToSquared(So))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&U(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){U(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new so(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new q,s[e]=new q;let c=new q,l=new q,u=new q,d=new K,f=new K,p=new K,m=new q,h=new q;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new q,y=new q,b=new q,x=new q;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new so(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new q,i=new q,a=new q,o=new q,s=new q,c=new q,l=new q,u=new q;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)So.fromBufferAttribute(e,t),So.normalize(),e.setXYZ(t,So.x,So.y,So.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new so(a,r,i)}if(this.index===null)return H(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},wo=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=zr,this.updateRanges=[],this.version=0,this.uuid=ni()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ni()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ni()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},To=new q,Eo=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)To.fromBufferAttribute(this,t),To.applyMatrix4(e),this.setXYZ(t,To.x,To.y,To.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)To.fromBufferAttribute(this,t),To.applyNormalMatrix(e),this.setXYZ(t,To.x,To.y,To.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)To.fromBufferAttribute(this,t),To.transformDirection(e),this.setXYZ(t,To.x,To.y,To.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=xi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=G(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=G(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=G(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=G(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=G(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=xi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=xi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=xi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=xi(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=G(t,this.array),n=G(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=G(t,this.array),n=G(n,this.array),r=G(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=G(t,this.array),n=G(n,this.array),r=G(r,this.array),i=G(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){Kr(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new so(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Kr(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Do=0,Oo=class extends Zr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Do++}),this.uuid=ni(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new X(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rr,this.stencilZFail=Rr,this.stencilZPass=Rr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){H(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){H(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new X().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new K().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new K().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},ko=class extends Oo{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new X(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ao,jo=new q,Mo=new q,No=new q,Po=new K,Fo=new K,Io=new Gi,Lo=new q,Ro=new q,zo=new q,Bo=new K,Vo=new K,Ho=new K,Uo=class extends va{constructor(e=new ko){if(super(),this.isSprite=!0,this.type=`Sprite`,Ao===void 0){Ao=new Co;let e=new wo(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);Ao.setIndex([0,1,2,0,2,3]),Ao.setAttribute(`position`,new Eo(e,3,0,!1)),Ao.setAttribute(`uv`,new Eo(e,2,3,!1))}this.geometry=Ao,this.material=e,this.center=new K(.5,.5),this.count=1}raycast(e,t){e.camera===null&&U(`Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),Mo.setFromMatrixScale(this.matrixWorld),Io.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),No.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Mo.multiplyScalar(-No.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;Wo(Lo.set(-.5,-.5,0),No,a,Mo,r,i),Wo(Ro.set(.5,-.5,0),No,a,Mo,r,i),Wo(zo.set(.5,.5,0),No,a,Mo,r,i),Bo.set(0,0),Vo.set(1,0),Ho.set(1,1);let o=e.ray.intersectTriangle(Lo,Ro,zo,!1,jo);if(o===null&&(Wo(Ro.set(-.5,.5,0),No,a,Mo,r,i),Vo.set(0,1),o=e.ray.intersectTriangle(Lo,zo,Ro,!1,jo),o===null))return;let s=e.ray.origin.distanceTo(jo);s<e.near||s>e.far||t.push({distance:s,point:jo.clone(),uv:Ha.getInterpolation(jo,Lo,Ro,zo,Bo,Vo,Ho,new K),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Wo(e,t,n,r,i,a){Po.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?Fo.copy(Po):(Fo.x=a*Po.x-i*Po.y,Fo.y=i*Po.x+a*Po.y),e.copy(t),e.x+=Fo.x,e.y+=Fo.y,e.applyMatrix4(Io)}var Go=new q,Ko=new q,qo=new q,Jo=new q,Yo=new q,Xo=new q,Zo=new q,Qo=class{constructor(e=new q,t=new q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Go)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Go.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Go.copy(this.origin).addScaledVector(this.direction,t),Go.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Ko.copy(e).add(t).multiplyScalar(.5),qo.copy(t).sub(e).normalize(),Jo.copy(this.origin).sub(Ko);let i=e.distanceTo(t)*.5,a=-this.direction.dot(qo),o=Jo.dot(this.direction),s=-Jo.dot(qo),c=Jo.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Ko).addScaledVector(qo,d),f}intersectSphere(e,t){Go.subVectors(e.center,this.origin);let n=Go.dot(this.direction),r=Go.dot(Go)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Go)!==null}intersectTriangle(e,t,n,r,i){Yo.subVectors(t,e),Xo.subVectors(n,e),Zo.crossVectors(Yo,Xo);let a=this.direction.dot(Zo),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Jo.subVectors(this.origin,e);let s=o*this.direction.dot(Xo.crossVectors(Jo,Xo));if(s<0)return null;let c=o*this.direction.dot(Yo.cross(Jo));if(c<0||s+c>a)return null;let l=-o*Jo.dot(Zo);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},$o=class extends Oo{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new X(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ta,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},es=new Gi,ts=new Qo,ns=new ho,rs=new q,is=new q,as=new q,os=new q,ss=new q,cs=new q,ls=new q,us=new q,ds=class extends va{constructor(e=new Co,t=new $o){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){cs.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(ss.fromBufferAttribute(s,e),a?cs.addScaledVector(ss,r):cs.addScaledVector(ss.sub(t),r))}t.add(cs)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ns.copy(n.boundingSphere),ns.applyMatrix4(i),ts.copy(e.ray).recast(e.near),!(ns.containsPoint(ts.origin)===!1&&(ts.intersectSphere(ns,rs)===null||ts.origin.distanceToSquared(rs)>(e.far-e.near)**2))&&(es.copy(i).invert(),ts.copy(e.ray).applyMatrix4(es),(n.boundingBox===null||ts.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,ts)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=ps(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=ps(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=ps(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=ps(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function fs(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;us.copy(s),us.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(us);return l<n.near||l>n.far?null:{distance:l,point:us.clone(),object:e}}function ps(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,is),e.getVertexPosition(c,as),e.getVertexPosition(l,os);let u=fs(e,t,n,r,is,as,os,ls);if(u){let e=new q;Ha.getBarycoord(ls,is,as,os,e),i&&(u.uv=Ha.getInterpolatedAttribute(i,s,c,l,e,new K)),a&&(u.uv1=Ha.getInterpolatedAttribute(a,s,c,l,e,new K)),o&&(u.normal=Ha.getInterpolatedAttribute(o,s,c,l,e,new q),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new q,materialIndex:0};Ha.getNormal(is,as,os,t.normal),u.face=t,u.barycoord=e}return u}var ms=class extends zi{constructor(e=null,t=1,n=1,r,i,a,o,s,c=hn,l=hn,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},hs=new q,gs=new q,_s=new J,vs=class{constructor(e=new q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=hs.subVectors(n,t).cross(gs.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(hs),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||_s.getNormalMatrix(e),r=this.coplanarPoint(hs).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ys=new ho,bs=new K(.5,.5),xs=new q,Ss=class{constructor(e=new vs,t=new vs,n=new vs,r=new vs,i=new vs,a=new vs){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Br,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ys.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ys.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ys)}intersectsSprite(e){return ys.center.set(0,0,0),ys.radius=.7071067811865476+bs.distanceTo(e.center),ys.applyMatrix4(e.matrixWorld),this.intersectsSphere(ys)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(xs.x=r.normal.x>0?e.max.x:e.min.x,xs.y=r.normal.y>0?e.max.y:e.min.y,xs.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(xs)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Cs=class extends zi{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ws=class extends zi{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ts=class extends zi{constructor(e,t,n=En,r,i,a,o=hn,s=hn,c,l=Ln,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Fi(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Es=class extends Ts{constructor(e,t=En,n=301,r,i,a=hn,o=hn,s,c=Ln){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ds=class extends zi{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Os=class e extends Co{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new uo(c,3)),this.setAttribute(`normal`,new uo(l,3)),this.setAttribute(`uv`,new uo(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new q;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},ks=class e extends Co{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new q,g=new q;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new uo(o,3)),this.setAttribute(`normal`,new uo(s,3)),this.setAttribute(`uv`,new uo(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},As=class e extends Co{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new uo(u,3)),this.setAttribute(`normal`,new uo(d,3)),this.setAttribute(`uv`,new uo(f,2));function _(){let a=new q,_=new q,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new K,m=new q,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},js=class e extends Co{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new uo(p,3)),this.setAttribute(`normal`,new uo(m,3)),this.setAttribute(`uv`,new uo(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Ms=class e extends Co{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new q,d=new q,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new uo(p,3)),this.setAttribute(`normal`,new uo(m,3)),this.setAttribute(`uv`,new uo(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function Ns(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Fs(i))i.isRenderTargetTexture?(H(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Fs(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Ps(e){let t={};for(let n=0;n<e.length;n++){let r=Ns(e[n]);for(let e in r)t[e]=r[e]}return t}function Fs(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Is(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Ls(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Y.workingColorSpace}var Rs={clone:Ns,merge:Ps},zs=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Bs=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Vs=class extends Oo{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zs,this.fragmentShader=Bs,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ns(e.uniforms),this.uniformsGroups=Is(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new X().setHex(r.value);break;case`v2`:this.uniforms[n].value=new K().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new q().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Bi().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new J().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Gi().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Hs=class extends Vs{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Us=class extends Oo{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new X(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new X(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new K(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ta,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ws=class extends Oo{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Nr,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Gs=class extends Oo{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ks(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}var qs=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Js=class extends qs{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ar,endingEnd:Ar}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case jr:i=e,o=2*t-n;break;case Mr:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case jr:a=e,s=2*n-t;break;case Mr:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Ys=class extends qs{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Xs=class extends qs{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Zs=class extends qs{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=(n-t)/(r-t),S,C,w,T,E;for(let e=0;e<8;e++){S=x*x,C=S*x,w=1-x,T=w*w,E=T*w;let e=E*t+3*T*x*g+3*w*S*y+C*r-n;if(Math.abs(e)<1e-10)break;let i=3*T*(g-t)+6*w*x*(y-g)+3*S*(r-y);if(Math.abs(i)<1e-10)break;x-=e/i,x=Math.max(0,Math.min(1,x))}i[p]=E*o+3*T*x*_+3*w*S*b+C*m}return i}},Qs=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Ks(t,this.TimeBufferType),this.values=Ks(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ks(e.times,Array),values:Ks(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Xs(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ys(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Js(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Zs(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Er:t=this.InterpolantFactoryMethodDiscrete;break;case Dr:t=this.InterpolantFactoryMethodLinear;break;case Or:t=this.InterpolantFactoryMethodSmooth;break;case kr:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return H(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Er;case this.InterpolantFactoryMethodLinear:return Dr;case this.InterpolantFactoryMethodSmooth:return Or;case this.InterpolantFactoryMethodBezier:return kr}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(U(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(U(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){U(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){U(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Hr(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){U(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Or,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Qs.prototype.ValueTypeName=``,Qs.prototype.TimeBufferType=Float32Array,Qs.prototype.ValueBufferType=Float32Array,Qs.prototype.DefaultInterpolation=Dr;var $s=class extends Qs{constructor(e,t,n){super(e,t,n)}};$s.prototype.ValueTypeName=`bool`,$s.prototype.ValueBufferType=Array,$s.prototype.DefaultInterpolation=Er,$s.prototype.InterpolantFactoryMethodLinear=void 0,$s.prototype.InterpolantFactoryMethodSmooth=void 0;var ec=class extends Qs{constructor(e,t,n,r){super(e,t,n,r)}};ec.prototype.ValueTypeName=`color`;var tc=class extends Qs{constructor(e,t,n,r){super(e,t,n,r)}};tc.prototype.ValueTypeName=`number`;var nc=class extends qs{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Ci.slerpFlat(i,0,a,c-o,a,c,s);return i}},rc=class extends Qs{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new nc(this.times,this.values,this.getValueSize(),e)}};rc.prototype.ValueTypeName=`quaternion`,rc.prototype.InterpolantFactoryMethodSmooth=void 0;var ic=class extends Qs{constructor(e,t,n){super(e,t,n)}};ic.prototype.ValueTypeName=`string`,ic.prototype.ValueBufferType=Array,ic.prototype.DefaultInterpolation=Er,ic.prototype.InterpolantFactoryMethodLinear=void 0,ic.prototype.InterpolantFactoryMethodSmooth=void 0;var ac=class extends Qs{constructor(e,t,n,r){super(e,t,n,r)}};ac.prototype.ValueTypeName=`vector`;var oc=class extends va{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new X(e),this.intensity=t}dispose(){this.dispatchEvent({type:`dispose`})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},sc=class extends oc{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(va.DEFAULT_UP),this.updateMatrix(),this.groundColor=new X(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},cc=new Gi,lc=new q,uc=new q,dc=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new K(512,512),this.mapType=xn,this.map=null,this.mapPass=null,this.matrix=new Gi,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ss,this._frameExtents=new K(1,1),this._viewportCount=1,this._viewports=[new Bi(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;lc.setFromMatrixPosition(e.matrixWorld),t.position.copy(lc),uc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(uc),t.updateMatrixWorld(),cc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(cc,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===2001||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(cc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},fc=new q,pc=new Ci,mc=new q,hc=class extends va{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Gi,this.projectionMatrix=new Gi,this.projectionMatrixInverse=new Gi,this.coordinateSystem=Br,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(fc,pc,mc),mc.x===1&&mc.y===1&&mc.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fc,pc,mc.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(fc,pc,mc),mc.x===1&&mc.y===1&&mc.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fc,pc,mc.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},gc=new q,_c=new K,vc=new K,yc=class extends hc{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ti*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ei*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ti*2*Math.atan(Math.tan(ei*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){gc.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(gc.x,gc.y).multiplyScalar(-e/gc.z),gc.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(gc.x,gc.y).multiplyScalar(-e/gc.z)}getViewSize(e,t){return this.getViewBounds(e,_c,vc),t.subVectors(vc,_c)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ei*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},bc=class extends dc{constructor(){super(new yc(90,1,.5,500)),this.isPointLightShadow=!0}},xc=class extends oc{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new bc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Sc=class extends hc{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Cc=class extends dc{constructor(){super(new Sc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},wc=class extends oc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(va.DEFAULT_UP),this.updateMatrix(),this.target=new va,this.shadow=new Cc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Tc=-90,Ec=1,Dc=class extends va{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new yc(Tc,Ec,e,t);r.layers=this.layers,this.add(r);let i=new yc(Tc,Ec,e,t);i.layers=this.layers,this.add(i);let a=new yc(Tc,Ec,e,t);a.layers=this.layers,this.add(a);let o=new yc(Tc,Ec,e,t);o.layers=this.layers,this.add(o);let s=new yc(Tc,Ec,e,t);s.layers=this.layers,this.add(s);let c=new yc(Tc,Ec,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Oc=class extends yc{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},kc=`\\[\\]\\.:\\/`,Ac=RegExp(`[\\[\\]\\.:\\/]`,`g`),jc=`[^\\[\\]\\.:\\/]`,Mc=`[^`+kc.replace(`\\.`,``)+`]`,Nc=`((?:WC+[\\/:])*)`.replace(`WC`,jc),Pc=`(WCOD+)?`.replace(`WCOD`,Mc),Fc=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,jc),Ic=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,jc),Lc=RegExp(`^`+Nc+Pc+Fc+Ic+`$`),Rc=[`material`,`materials`,`bones`,`map`],zc=class{constructor(e,t,n){let r=n||Bc.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Bc=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Ac,``)}static parseTrackName(e){let t=Lc.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Rc.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){H(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){U(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){U(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){U(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){U(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){U(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;U(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Bc.Composite=zc,Bc.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Bc.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Bc.prototype.GetterByBindingType=[Bc.prototype._getValue_direct,Bc.prototype._getValue_array,Bc.prototype._getValue_arrayElement,Bc.prototype._getValue_toArray],Bc.prototype.SetterByBindingTypeAndVersioning=[[Bc.prototype._setValue_direct,Bc.prototype._setValue_direct_setNeedsUpdate,Bc.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Bc.prototype._setValue_array,Bc.prototype._setValue_array_setNeedsUpdate,Bc.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Bc.prototype._setValue_arrayElement,Bc.prototype._setValue_arrayElement_setNeedsUpdate,Bc.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Bc.prototype._setValue_fromArray,Bc.prototype._setValue_fromArray_setNeedsUpdate,Bc.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Vc=new Gi,Hc=class{constructor(e,t,n=0,r=1/0){this.ray=new Qo(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new na,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):U(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return Vc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Vc),this}intersectObject(e,t=!0,n=[]){return Wc(e,this,n,t),n.sort(Uc),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)Wc(e[r],this,n,t);return n.sort(Uc),n}};function Uc(e,t){return e.distance-t.distance}function Wc(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)Wc(r[e],t,n,!0)}}var Gc=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,H(`Clock: This module has been deprecated. Please use THREE.Timer instead.`)}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}},Kc=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){let e=1e-6;return this.phi=W(this.phi,e,Math.PI-e),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(W(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});var qc=class extends Zr{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){H(`Controls: connect() now requires an element.`);return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function Jc(e,t,n,r){let i=Yc(r);switch(n){case Pn:return e*t;case zn:return e*t/i.components*i.byteLength;case Bn:return e*t/i.components*i.byteLength;case Vn:return e*t*2/i.components*i.byteLength;case Hn:return e*t*2/i.components*i.byteLength;case Fn:return e*t*3/i.components*i.byteLength;case In:return e*t*4/i.components*i.byteLength;case Un:return e*t*4/i.components*i.byteLength;case Wn:case Gn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Kn:case qn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Yn:case Zn:return Math.max(e,16)*Math.max(t,8)/4;case Jn:case Xn:return Math.max(e,8)*Math.max(t,8)/2;case Qn:case $n:case tr:case nr:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case er:case rr:case ir:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ar:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case or:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case sr:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case cr:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case lr:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ur:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case dr:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case fr:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case pr:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case mr:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case hr:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case gr:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case _r:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case vr:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case yr:case br:case xr:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Sr:case Cr:return Math.ceil(e/4)*Math.ceil(t/4)*8;case wr:case Tr:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Yc(e){switch(e){case xn:case Sn:return{byteLength:1,components:1};case wn:case Cn:case On:return{byteLength:2,components:1};case kn:case An:return{byteLength:2,components:4};case En:case Tn:case Dn:return{byteLength:4,components:1};case Mn:case Nn:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`185`}})),typeof window<`u`&&(window.__THREE__?H(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`185`);function Xc(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Zc(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Z={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Q={common:{diffuse:{value:new X(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new J},alphaMap:{value:null},alphaMapTransform:{value:new J},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new J}},envmap:{envMap:{value:null},envMapRotation:{value:new J},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new J}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new J}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new J},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new J},normalScale:{value:new K(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new J},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new J}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new J}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new J}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new X(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new q},probesMax:{value:new q},probesResolution:{value:new q}},points:{diffuse:{value:new X(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new J},alphaTest:{value:0},uvTransform:{value:new J}},sprite:{diffuse:{value:new X(16777215)},opacity:{value:1},center:{value:new K(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new J},alphaMap:{value:null},alphaMapTransform:{value:new J},alphaTest:{value:0}}},Qc={basic:{uniforms:Ps([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.fog]),vertexShader:Z.meshbasic_vert,fragmentShader:Z.meshbasic_frag},lambert:{uniforms:Ps([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new X(0)},envMapIntensity:{value:1}}]),vertexShader:Z.meshlambert_vert,fragmentShader:Z.meshlambert_frag},phong:{uniforms:Ps([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new X(0)},specular:{value:new X(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Z.meshphong_vert,fragmentShader:Z.meshphong_frag},standard:{uniforms:Ps([Q.common,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.roughnessmap,Q.metalnessmap,Q.fog,Q.lights,{emissive:{value:new X(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag},toon:{uniforms:Ps([Q.common,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.gradientmap,Q.fog,Q.lights,{emissive:{value:new X(0)}}]),vertexShader:Z.meshtoon_vert,fragmentShader:Z.meshtoon_frag},matcap:{uniforms:Ps([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,{matcap:{value:null}}]),vertexShader:Z.meshmatcap_vert,fragmentShader:Z.meshmatcap_frag},points:{uniforms:Ps([Q.points,Q.fog]),vertexShader:Z.points_vert,fragmentShader:Z.points_frag},dashed:{uniforms:Ps([Q.common,Q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Z.linedashed_vert,fragmentShader:Z.linedashed_frag},depth:{uniforms:Ps([Q.common,Q.displacementmap]),vertexShader:Z.depth_vert,fragmentShader:Z.depth_frag},normal:{uniforms:Ps([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,{opacity:{value:1}}]),vertexShader:Z.meshnormal_vert,fragmentShader:Z.meshnormal_frag},sprite:{uniforms:Ps([Q.sprite,Q.fog]),vertexShader:Z.sprite_vert,fragmentShader:Z.sprite_frag},background:{uniforms:{uvTransform:{value:new J},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Z.background_vert,fragmentShader:Z.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new J}},vertexShader:Z.backgroundCube_vert,fragmentShader:Z.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Z.cube_vert,fragmentShader:Z.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Z.equirect_vert,fragmentShader:Z.equirect_frag},distance:{uniforms:Ps([Q.common,Q.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Z.distance_vert,fragmentShader:Z.distance_frag},shadow:{uniforms:Ps([Q.lights,Q.fog,{color:{value:new X(0)},opacity:{value:1}}]),vertexShader:Z.shadow_vert,fragmentShader:Z.shadow_frag}};Qc.physical={uniforms:Ps([Qc.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new J},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new J},clearcoatNormalScale:{value:new K(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new J},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new J},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new J},sheen:{value:0},sheenColor:{value:new X(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new J},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new J},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new J},transmissionSamplerSize:{value:new K},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new J},attenuationDistance:{value:0},attenuationColor:{value:new X(0)},specularColor:{value:new X(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new J},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new J},anisotropyVector:{value:new K},anisotropyMap:{value:null},anisotropyMapTransform:{value:new J}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag};var $c={r:0,b:0,g:0},el=new Gi,tl=new J;tl.set(-1,0,0,0,1,0,0,0,1);function nl(e,t,n,r,i,a){let o=new X(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new ds(new Os(1,1,1),new Vs({name:`BackgroundCubeMaterial`,uniforms:Ns(Qc.backgroundCube.uniforms),vertexShader:Qc.backgroundCube.vertexShader,fragmentShader:Qc.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(el.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(tl),l.material.toneMapped=Y.getTransfer(i.colorSpace)!==Lr,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new ds(new js(2,2),new Vs({name:`BackgroundMaterial`,uniforms:Ns(Qc.background.uniforms),vertexShader:Qc.background.vertexShader,fragmentShader:Qc.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Y.getTransfer(i.colorSpace)!==Lr,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB($c,Ls(e)),n.buffers.color.setClear($c.r,$c.g,$c.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function rl(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function il(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function al(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(H(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&H(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function ol(e){let t=this,n=null,r=0,i=!1,a=!1,o=new vs,s=new J,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var sl=4,cl=[.125,.215,.35,.446,.526,.582],ll=20,ul=256,dl=new Sc,fl=new X,pl=null,ml=0,hl=0,gl=!1,_l=new q,vl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=_l}=i;pl=this._renderer.getRenderTarget(),ml=this._renderer.getActiveCubeFace(),hl=this._renderer.getActiveMipmapLevel(),gl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(pl,ml,hl),this._renderer.xr.enabled=gl,e.scissorTest=!1,xl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),pl=this._renderer.getRenderTarget(),ml=this._renderer.getActiveCubeFace(),hl=this._renderer.getActiveMipmapLevel(),gl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:vn,minFilter:vn,generateMipmaps:!1,type:On,format:In,colorSpace:Fr,depthBuffer:!1},r=bl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bl(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=yl(r)),this._blurMaterial=Cl(r,e,t),this._ggxMaterial=Sl(r,e,t)}return r}_compileMaterial(e){let t=new ds(new Co,e);this._renderer.compile(t,dl)}_sceneToCubeUV(e,t,n,r,i){let a=new yc(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(fl),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ds(new Os,new $o({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(fl),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;xl(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wl());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;xl(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,dl)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-sl?n-d+sl:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,xl(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,dl),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,xl(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,dl)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&U(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):ll;m>ll&&H(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ll}`);let h=[],g=0;for(let e=0;e<ll;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];xl(t,3*v*(r>_-sl?r-_+sl:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,dl)}};function yl(e){let t=[],n=[],r=[],i=e,a=e-sl+1+cl.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-sl?s=cl[o-e+sl-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new Co;h.setAttribute(`position`,new so(f,3)),h.setAttribute(`uv`,new so(p,2)),h.setAttribute(`faceIndex`,new so(m,1)),r.push(new ds(h,null)),i>sl&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function bl(e,t,n){let r=new Hi(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function xl(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Sl(e,t,n){return new Vs({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:ul,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:El(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Cl(e,t,n){let r=new Float32Array(ll),i=new q(0,1,0);return new Vs({name:`SphericalGaussianBlur`,defines:{n:ll,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:El(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function wl(){return new Vs({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:El(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Tl(){return new Vs({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:El(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function El(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Dl=class extends Hi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Cs(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Os(5,5,5),i=new Vs({name:`CubemapFromEquirect`,uniforms:Ns(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new ds(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=vn),new Dc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Ol(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Dl(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new vl(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new vl(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function kl(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Jr(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Al(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?lo:co)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function jl(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Ml(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:U(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Nl(e,t,n){let r=new WeakMap,i=new Bi;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Ui(h,p,m,u);g.type=Dn,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new K(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Pl(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Fl={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Il(e,t,n,r,i,a){let o=new Hi(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new Ts(t,n):void 0}),s=new Hi(t,n,{type:On,depthBuffer:!1,stencilBuffer:!1}),c=new Co;c.setAttribute(`position`,new uo([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute(`uv`,new uo([0,2,0,0,2,0],2));let l=new Hs({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new ds(c,l),d=new Sc(-1,1,1,-1,0,1),f=null,p=null,m=!1,h,g=null,_=[],v=!1;this.setSize=function(e,t){o.setSize(e,t),s.setSize(e,t);for(let n=0;n<_.length;n++){let r=_[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){_=e,v=_.length>0&&_[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<_.length;e++){let r=_[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(m||e.toneMapping===0&&_.length===0)return!1;if(g=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return v===!1&&e.setRenderTarget(o),h=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return v},this.end=function(e,t){e.toneMapping=h,m=!0;let n=o,r=s;for(let i=0;i<_.length;i++){let a=_[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,l.defines={},Y.getTransfer(f)===`srgb`&&(l.defines.SRGB_TRANSFER=``);let t=Fl[p];t&&(l.defines[t]=``),l.needsUpdate=!0}l.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(g),e.render(u,d),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose()}}var Ll=new zi,Rl=new Ts(1,1),zl=new Ui,Bl=new Wi,Vl=new Cs,Hl=[],Ul=[],Wl=new Float32Array(16),Gl=new Float32Array(9),Kl=new Float32Array(4);function ql(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Hl[i];if(a===void 0&&(a=new Float32Array(i),Hl[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Jl(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Yl(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Xl(e,t){let n=Ul[t];n===void 0&&(n=new Int32Array(t),Ul[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Zl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Ql(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Jl(n,t))return;e.uniform2fv(this.addr,t),Yl(n,t)}}function $l(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Jl(n,t))return;e.uniform3fv(this.addr,t),Yl(n,t)}}function eu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Jl(n,t))return;e.uniform4fv(this.addr,t),Yl(n,t)}}function tu(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Jl(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Yl(n,t)}else{if(Jl(n,r))return;Kl.set(r),e.uniformMatrix2fv(this.addr,!1,Kl),Yl(n,r)}}function nu(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Jl(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Yl(n,t)}else{if(Jl(n,r))return;Gl.set(r),e.uniformMatrix3fv(this.addr,!1,Gl),Yl(n,r)}}function ru(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Jl(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Yl(n,t)}else{if(Jl(n,r))return;Wl.set(r),e.uniformMatrix4fv(this.addr,!1,Wl),Yl(n,r)}}function iu(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function au(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Jl(n,t))return;e.uniform2iv(this.addr,t),Yl(n,t)}}function ou(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Jl(n,t))return;e.uniform3iv(this.addr,t),Yl(n,t)}}function su(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Jl(n,t))return;e.uniform4iv(this.addr,t),Yl(n,t)}}function cu(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function lu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Jl(n,t))return;e.uniform2uiv(this.addr,t),Yl(n,t)}}function uu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Jl(n,t))return;e.uniform3uiv(this.addr,t),Yl(n,t)}}function du(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Jl(n,t))return;e.uniform4uiv(this.addr,t),Yl(n,t)}}function fu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Rl.compareFunction=n.isReversedDepthBuffer()?518:515,a=Rl):a=Ll,n.setTexture2D(t||a,i)}function pu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Bl,i)}function mu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Vl,i)}function hu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||zl,i)}function gu(e){switch(e){case 5126:return Zl;case 35664:return Ql;case 35665:return $l;case 35666:return eu;case 35674:return tu;case 35675:return nu;case 35676:return ru;case 5124:case 35670:return iu;case 35667:case 35671:return au;case 35668:case 35672:return ou;case 35669:case 35673:return su;case 5125:return cu;case 36294:return lu;case 36295:return uu;case 36296:return du;case 35678:case 36198:case 36298:case 36306:case 35682:return fu;case 35679:case 36299:case 36307:return pu;case 35680:case 36300:case 36308:case 36293:return mu;case 36289:case 36303:case 36311:case 36292:return hu}}function _u(e,t){e.uniform1fv(this.addr,t)}function vu(e,t){let n=ql(t,this.size,2);e.uniform2fv(this.addr,n)}function yu(e,t){let n=ql(t,this.size,3);e.uniform3fv(this.addr,n)}function bu(e,t){let n=ql(t,this.size,4);e.uniform4fv(this.addr,n)}function xu(e,t){let n=ql(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Su(e,t){let n=ql(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Cu(e,t){let n=ql(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function wu(e,t){e.uniform1iv(this.addr,t)}function Tu(e,t){e.uniform2iv(this.addr,t)}function Eu(e,t){e.uniform3iv(this.addr,t)}function Du(e,t){e.uniform4iv(this.addr,t)}function Ou(e,t){e.uniform1uiv(this.addr,t)}function ku(e,t){e.uniform2uiv(this.addr,t)}function Au(e,t){e.uniform3uiv(this.addr,t)}function ju(e,t){e.uniform4uiv(this.addr,t)}function Mu(e,t,n){let r=this.cache,i=t.length,a=Xl(n,i);Jl(r,a)||(e.uniform1iv(this.addr,a),Yl(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Rl:Ll;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Nu(e,t,n){let r=this.cache,i=t.length,a=Xl(n,i);Jl(r,a)||(e.uniform1iv(this.addr,a),Yl(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Bl,a[e])}function Pu(e,t,n){let r=this.cache,i=t.length,a=Xl(n,i);Jl(r,a)||(e.uniform1iv(this.addr,a),Yl(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Vl,a[e])}function Fu(e,t,n){let r=this.cache,i=t.length,a=Xl(n,i);Jl(r,a)||(e.uniform1iv(this.addr,a),Yl(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||zl,a[e])}function Iu(e){switch(e){case 5126:return _u;case 35664:return vu;case 35665:return yu;case 35666:return bu;case 35674:return xu;case 35675:return Su;case 35676:return Cu;case 5124:case 35670:return wu;case 35667:case 35671:return Tu;case 35668:case 35672:return Eu;case 35669:case 35673:return Du;case 5125:return Ou;case 36294:return ku;case 36295:return Au;case 36296:return ju;case 35678:case 36198:case 36298:case 36306:case 35682:return Mu;case 35679:case 36299:case 36307:return Nu;case 35680:case 36300:case 36308:case 36293:return Pu;case 36289:case 36303:case 36311:case 36292:return Fu}}var Lu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=gu(t.type)}},Ru=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Iu(t.type)}},zu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Bu=/(\w+)(\])?(\[|\.)?/g;function Vu(e,t){e.seq.push(t),e.map[t.id]=t}function Hu(e,t,n){let r=e.name,i=r.length;for(Bu.lastIndex=0;;){let a=Bu.exec(r),o=Bu.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Vu(n,l===void 0?new Lu(s,e,t):new Ru(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new zu(s),Vu(n,e)),n=e}}}var Uu=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Hu(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Wu(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Gu=37297,Ku=0;function qu(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Ju=new J;function Yu(e){Y._getMatrix(Ju,Y.workingColorSpace,e);let t=`mat3( ${Ju.elements.map(e=>e.toFixed(4))} )`;switch(Y.getTransfer(e)){case Ir:return[t,`LinearTransferOETF`];case Lr:return[t,`sRGBTransferOETF`];default:return H(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Xu(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+qu(e.getShaderSource(t),r)}return i}function Zu(e,t){let n=Yu(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Qu={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function $u(e,t){let n=Qu[t];return n===void 0?(H(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var ed=new q;function td(){return Y.getLuminanceCoefficients(ed),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${ed.x.toFixed(4)}, ${ed.y.toFixed(4)}, ${ed.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function nd(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(ad).join(`
`)}function rd(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function id(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function ad(e){return e!==``}function od(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function sd(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var cd=/^[ \t]*#include +<([\w\d./]+)>/gm;function ld(e){return e.replace(cd,dd)}var ud=new Map;function dd(e,t){let n=Z[t];if(n===void 0){let e=ud.get(t);if(e!==void 0)n=Z[e],H(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return ld(n)}var fd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function pd(e){return e.replace(fd,md)}function md(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function hd(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var gd={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function _d(e){return gd[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var vd={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function yd(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:vd[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var bd={302:`ENVMAP_MODE_REFRACTION`};function xd(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:bd[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Sd={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Cd(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Sd[e.combine]||`ENVMAP_BLENDING_NONE`}function wd(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Td(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=_d(n),l=yd(n),u=xd(n),d=Cd(n),f=wd(n),p=nd(n),m=rd(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(ad).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(ad).join(`
`),_.length>0&&(_+=`
`)):(g=[hd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(ad).join(`
`),_=[hd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Z.tonemapping_pars_fragment,n.toneMapping===0?``:$u(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Z.colorspace_pars_fragment,Zu(`linearToOutputTexel`,n.outputColorSpace),td(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(ad).join(`
`)),o=ld(o),o=od(o,n),o=sd(o,n),s=ld(s),s=od(s,n),s=sd(s,n),o=pd(o),s=pd(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Wu(i,i.VERTEX_SHADER,y),S=Wu(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Xu(i,x,`vertex`),n=Xu(i,S,`fragment`);U(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):H(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Uu(i,h),T=id(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Gu)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Ku++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Ed=0,Dd=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Od(e),t.set(e,n)),n}},Od=class{constructor(e){this.id=Ed++,this.code=e,this.usedTimes=0}};function kd(e){return e===1030||e===37490||e===36285}function Ad(e,t,n,r,i,a){let o=new na,s=new Dd,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&H(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Qc[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let ee=e.getRenderTarget(),te=e.state.buffers.depth.getReversed(),j=h.isInstancedMesh===!0,ne=h.isBatchedMesh===!0,re=!!i.map,M=!!i.matcap,ie=!!x,ae=!!i.aoMap,oe=!!i.lightMap,se=!!i.bumpMap&&i.wireframe===!1,ce=!!i.normalMap,le=!!i.displacementMap,ue=!!i.emissiveMap,de=!!i.metalnessMap,fe=!!i.roughnessMap,pe=i.anisotropy>0,me=i.clearcoat>0,he=i.dispersion>0,ge=i.iridescence>0,_e=i.sheen>0,ve=i.transmission>0,ye=pe&&!!i.anisotropyMap,N=me&&!!i.clearcoatMap,be=me&&!!i.clearcoatNormalMap,xe=me&&!!i.clearcoatRoughnessMap,Se=ge&&!!i.iridescenceMap,Ce=ge&&!!i.iridescenceThicknessMap,P=_e&&!!i.sheenColorMap,we=_e&&!!i.sheenRoughnessMap,Te=!!i.specularMap,Ee=!!i.specularColorMap,F=!!i.specularIntensityMap,De=ve&&!!i.transmissionMap,I=ve&&!!i.thicknessMap,L=!!i.gradientMap,Oe=!!i.alphaMap,ke=i.alphaTest>0,Ae=!!i.alphaHash,je=!!i.extensions,Me=0;i.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Me=e.toneMapping);let Ne={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:ne,batchingColor:ne&&h._colorsTexture!==null,instancing:j,instancingColor:j&&h.instanceColor!==null,instancingMorph:j&&h.morphTexture!==null,outputColorSpace:ee===null?e.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:Y.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:re,matcap:M,envMap:ie,envMapMode:ie&&x.mapping,envMapCubeUVHeight:S,aoMap:ae,lightMap:oe,bumpMap:se,normalMap:ce,displacementMap:le,emissiveMap:ue,normalMapObjectSpace:ce&&i.normalMapType===1,normalMapTangentSpace:ce&&i.normalMapType===0,packedNormalMap:ce&&i.normalMapType===0&&kd(i.normalMap.format),metalnessMap:de,roughnessMap:fe,anisotropy:pe,anisotropyMap:ye,clearcoat:me,clearcoatMap:N,clearcoatNormalMap:be,clearcoatRoughnessMap:xe,dispersion:he,iridescence:ge,iridescenceMap:Se,iridescenceThicknessMap:Ce,sheen:_e,sheenColorMap:P,sheenRoughnessMap:we,specularMap:Te,specularColorMap:Ee,specularIntensityMap:F,transmission:ve,transmissionMap:De,thicknessMap:I,gradientMap:L,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Oe,alphaTest:ke,alphaHash:Ae,combine:i.combine,mapUv:re&&m(i.map.channel),aoMapUv:ae&&m(i.aoMap.channel),lightMapUv:oe&&m(i.lightMap.channel),bumpMapUv:se&&m(i.bumpMap.channel),normalMapUv:ce&&m(i.normalMap.channel),displacementMapUv:le&&m(i.displacementMap.channel),emissiveMapUv:ue&&m(i.emissiveMap.channel),metalnessMapUv:de&&m(i.metalnessMap.channel),roughnessMapUv:fe&&m(i.roughnessMap.channel),anisotropyMapUv:ye&&m(i.anisotropyMap.channel),clearcoatMapUv:N&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:be&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:P&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:we&&m(i.sheenRoughnessMap.channel),specularMapUv:Te&&m(i.specularMap.channel),specularColorMapUv:Ee&&m(i.specularColorMap.channel),specularIntensityMapUv:F&&m(i.specularIntensityMap.channel),transmissionMapUv:De&&m(i.transmissionMap.channel),thicknessMapUv:I&&m(i.thicknessMap.channel),alphaMapUv:Oe&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(ce||pe),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(re||Oe),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&ce===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:te,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Me,decodeVideoTexture:re&&i.map.isVideoTexture===!0&&Y.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ue&&i.emissiveMap.isVideoTexture===!0&&Y.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:je&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(je&&i.extensions.multiDraw===!0||ne)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ne.vertexUv1s=c.has(1),Ne.vertexUv2s=c.has(2),Ne.vertexUv3s=c.has(3),c.clear(),Ne}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Qc[t];n=Rs.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Td(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function jd(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Md(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Nd(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Pd(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||Md),r.length>1&&r.sort(t||Nd),i.length>1&&i.sort(t||Nd),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Fd(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Pd,e.set(t,[i])):n>=r.length?(i=new Pd,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Id(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new q,color:new X};break;case`SpotLight`:n={position:new q,direction:new q,color:new X,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new q,color:new X,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new q,skyColor:new X,groundColor:new X};break;case`RectAreaLight`:n={color:new X,position:new q,halfWidth:new q,halfHeight:new q}}return e[t.id]=n,n}}}function Ld(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Rd=0;function zd(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Bd(e){let t=new Id,n=Ld(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new q);let i=new q,a=new Gi,o=new Gi;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(zd);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Q.LTC_FLOAT_1,r.rectAreaLTC2=Q.LTC_FLOAT_2):(r.rectAreaLTC1=Q.LTC_HALF_1,r.rectAreaLTC2=Q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=Rd++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function Vd(e){let t=new Bd(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Hd(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Vd(e),t.set(n,[a])):r>=i.length?(a=new Vd(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Ud=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Wd=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Gd=[new q(1,0,0),new q(-1,0,0),new q(0,1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1)],Kd=[new q(0,-1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1),new q(0,-1,0),new q(0,-1,0)],qd=new Gi,Jd=new q,Yd=new q;function Xd(e,t,n){let r=new Ss,i=new K,a=new K,o=new Bi,s=new Ws,c=new Gs,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Vs({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new K},radius:{value:4}},vertexShader:Ud,fragmentShader:Wd}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Co;m.setAttribute(`position`,new so(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new ds(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(H(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){H(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){H(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Hi(i.x,i.y,{format:Vn,type:On,minFilter:vn,magFilter:vn,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Ts(i.x,i.y,Dn),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Ln,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=hn,d.map.depthTexture.magFilter=hn}else l.isPointLight?(d.map=new Dl(i.x),d.map.depthTexture=new Es(i.x,En)):(d.map=new Hi(i.x,i.y),d.map.depthTexture=new Ts(i.x,i.y,En)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Ln,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=vn,d.map.depthTexture.magFilter=vn):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=hn,d.map.depthTexture.magFilter=hn);d.camera.updateProjectionMatrix()}let g=d.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<g;t++){if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Jd.setFromMatrixPosition(l.matrixWorld),e.position.copy(Jd),Yd.copy(e.position),Yd.add(Gd[t]),e.up.copy(Kd[t]),e.lookAt(Yd),e.updateMatrixWorld(),n.makeTranslation(-Jd.x,-Jd.y,-Jd.z),qd.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(qd,e.coordinateSystem,e.reversedDepth)}else d.updateMatrices(l);r=d.getFrustum(),b(n,s,d.camera,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new Hi(i.x,i.y,{format:Vn,type:On})),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value=n.mapSize,f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Zd(e,t){function n(){let t=!1,n=new Bi,r=null,i=new Bi(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?de(e.DEPTH_TEST):fe(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Xr[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?de(e.STENCIL_TEST):fe(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new X(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,te=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,ne=0,re=e.getParameter(e.VERSION);re.indexOf(`WebGL`)===-1?re.indexOf(`OpenGL ES`)!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(re)[1]),j=ne>=2):(ne=parseFloat(/^WebGL (\d)/.exec(re)[1]),j=ne>=1);let M=null,ie={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),se=new Bi().fromArray(ae),ce=new Bi().fromArray(oe);function le(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ue={};ue[e.TEXTURE_2D]=le(e.TEXTURE_2D,e.TEXTURE_2D,1),ue[e.TEXTURE_CUBE_MAP]=le(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[e.TEXTURE_2D_ARRAY]=le(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ue[e.TEXTURE_3D]=le(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),de(e.DEPTH_TEST),o.setFunc(3),N(!1),be(1),de(e.CULL_FACE),ve(0);function de(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function fe(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function pe(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function me(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function he(t){return h!==t&&(e.useProgram(t),h=t,!0)}let ge={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ge[103]=e.MIN,ge[104]=e.MAX;let _e={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ve(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(fe(e.BLEND),g=!1);return}if(g===!1&&(de(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:U(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:U(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:U(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:U(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ge[n],ge[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(_e[r],_e[i],_e[o],_e[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ye(t,n){t.side===2?fe(e.CULL_FACE):de(e.CULL_FACE);let r=t.side===1;n&&(r=!r),N(r),t.blending===1&&t.transparent===!1?ve(0):ve(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Se(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?de(e.SAMPLE_ALPHA_TO_COVERAGE):fe(e.SAMPLE_ALPHA_TO_COVERAGE)}function N(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function be(t){t===0?fe(e.CULL_FACE):(de(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function xe(t){t!==k&&(j&&e.lineWidth(t),k=t)}function Se(t,n,r){t?(de(e.POLYGON_OFFSET_FILL),(A!==n||ee!==r)&&(A=n,ee=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):fe(e.POLYGON_OFFSET_FILL)}function Ce(t){t?de(e.SCISSOR_TEST):fe(e.SCISSOR_TEST)}function P(t){t===void 0&&(t=e.TEXTURE0+te-1),M!==t&&(e.activeTexture(t),M=t)}function we(t,n,r){r===void 0&&(r=M===null?e.TEXTURE0+te-1:M);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(M!==r&&(e.activeTexture(r),M=r),e.bindTexture(t,n||ue[t]),i.type=t,i.texture=n)}function Te(){let t=ie[M];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ee(){try{e.compressedTexImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function F(){try{e.compressedTexImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function De(){try{e.texSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function I(){try{e.texSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function L(){try{e.compressedTexSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function ke(){try{e.texStorage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ae(){try{e.texStorage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function je(){try{e.texImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Me(){try{e.texImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ne(t){return d[t]===void 0?e.getParameter(t):d[t]}function R(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Pe(t){se.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),se.copy(t))}function Fe(t){ce.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ce.copy(t))}function Ie(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Le(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function z(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},M=null,ie={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new X(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,se.set(0,0,e.canvas.width,e.canvas.height),ce.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:de,disable:fe,bindFramebuffer:pe,drawBuffers:me,useProgram:he,setBlending:ve,setMaterial:ye,setFlipSided:N,setCullFace:be,setLineWidth:xe,setPolygonOffset:Se,setScissorTest:Ce,activeTexture:P,bindTexture:we,unbindTexture:Te,compressedTexImage2D:Ee,compressedTexImage3D:F,texImage2D:je,texImage3D:Me,pixelStorei:R,getParameter:Ne,updateUBOMapping:Ie,uniformBlockBinding:Le,texStorage2D:ke,texStorage3D:Ae,texSubImage2D:De,texSubImage3D:I,compressedTexSubImage2D:L,compressedTexSubImage3D:Oe,scissor:Pe,viewport:Fe,reset:z}}function Qd(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new K,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):Ur(`canvas`)}function g(e,t,n){let r=1,i=Ee(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),H(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&H(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];H(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||H(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Ir:Y.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,H(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function k(){O=0}function A(){return O}function ee(e){O=e}function te(){let e=O;return e>=i.maxTextures&&H(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function j(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ne(t,i){let a=r.get(t);if(t.isVideoTexture&&we(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)H(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)H(`WebGLRenderer: Texture marked for update but image is incomplete`);else{fe(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function re(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){fe(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function M(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){fe(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ie(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){pe(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ae={[fn]:e.REPEAT,[pn]:e.CLAMP_TO_EDGE,[mn]:e.MIRRORED_REPEAT},oe={[hn]:e.NEAREST,[gn]:e.NEAREST_MIPMAP_NEAREST,[_n]:e.NEAREST_MIPMAP_LINEAR,[vn]:e.LINEAR,[yn]:e.LINEAR_MIPMAP_NEAREST,[bn]:e.LINEAR_MIPMAP_LINEAR},se={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function ce(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&H(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ae[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ae[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ae[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,oe[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,oe[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,se[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function le(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=j(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function ue(e,t,n){return Math.floor(Math.floor(e/n)/t)}function de(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ue(n.start,r.width,4),c=ue(t.start,r.width,4);n.start<=i+1&&a===c&&ue(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function fe(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=le(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Y.getPrimaries(Y.workingColorSpace),r=o.colorSpace===``?null:Y.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Te(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);ce(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===Rn,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&de(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=Jc(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}o.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data)}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=Jc(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=Ee(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=Ee(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function pe(t,o,s){if(o.image.length!==6)return;let c=le(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Y.getPrimaries(Y.workingColorSpace),r=o.colorSpace===``?null:Y.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Te(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);ce(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=Ee(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function me(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Ce(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function he(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;P(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ce(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ce(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);P(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ce(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ce(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ge(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),ce(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else ne(i.depthTexture,0);let u=l.__webglTexture,d=Ce(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function _e(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)ge(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?ge(i.__webglFramebuffer[0],t,0):ge(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),he(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),he(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function ve(t,n,i){let a=r.get(t);n!==void 0&&me(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&_e(t)}function ye(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&P(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ce(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),he(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),ce(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)me(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else me(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),ce(c,a),me(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),ce(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)me(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else me(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&_e(t)}function N(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let be=[],xe=[];function Se(t){if(t.samples>0){if(P(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(be.length=0,xe.length=0,be.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(be.push(l),xe.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,xe)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,be))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ce(e){return Math.min(i.maxSamples,e.samples)}function P(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function we(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Te(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Y.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&H(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):U(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ee(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=te,this.resetTextureUnits=k,this.getTextureUnits=A,this.setTextureUnits=ee,this.setTexture2D=ne,this.setTexture2DArray=re,this.setTexture3D=M,this.setTextureCube=ie,this.rebindTextures=ve,this.setupRenderTarget=ye,this.updateRenderTargetMipmap=N,this.updateMultisampleRenderTarget=Se,this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=me,this.useMultisampledRTT=P,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function $d(e,t){function n(n,r=``){let i,a=Y.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var ef=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,tf=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,nf=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ds(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Vs({vertexShader:ef,fragmentShader:tf,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ds(new js(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},rf=class extends Zr{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new nf,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new K,C=null,w=new yc;w.viewport=new Bi;let T=new yc;T.viewport=new Bi;let E=[w,T],D=new Oc,O=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new xa,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new xa,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new xa,b[e]=t),t.getHandSpace()};function A(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ee(){r.removeEventListener(`select`,A),r.removeEventListener(`selectstart`,A),r.removeEventListener(`selectend`,A),r.removeEventListener(`squeeze`,A),r.removeEventListener(`squeezestart`,A),r.removeEventListener(`squeezeend`,A),r.removeEventListener(`end`,ee),r.removeEventListener(`inputsourceschange`,te);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}O=null,k=null,h.reset();for(let e in g)delete g[e];e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,se.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,A),r.addEventListener(`selectstart`,A),r.addEventListener(`selectend`,A),r.addEventListener(`squeeze`,A),r.addEventListener(`squeezestart`,A),r.addEventListener(`squeezeend`,A),r.addEventListener(`end`,ee),r.addEventListener(`inputsourceschange`,te),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?Rn:Ln,a=_.stencil?jn:En);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Hi(d.textureWidth,d.textureHeight,{format:In,type:xn,depthTexture:new Ts(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Hi(f.framebufferWidth,f.framebufferHeight,{format:In,type:xn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),se.setContext(r),se.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function te(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let j=new q,ne=new q;function re(e,t,n){j.setFromMatrixPosition(t.matrixWorld),ne.setFromMatrixPosition(n.matrixWorld);let r=j.distanceTo(ne),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function M(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),D.near=T.near=w.near=t,D.far=T.far=w.far=n,(O!==D.near||k!==D.far)&&(r.updateRenderState({depthNear:D.near,depthFar:D.far}),O=D.near,k=D.far),D.layers.mask=e.layers.mask|6,w.layers.mask=D.layers.mask&-5,T.layers.mask=D.layers.mask&-3;let i=e.parent,a=D.cameras;M(D,i);for(let e=0;e<a.length;e++)M(a[e],i);a.length===2?re(D,w,T):D.projectionMatrix.copy(w.projectionMatrix),ie(e,D,i)};function ie(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=ti*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(D)},this.getCameraTexture=function(e){return g[e]};let ae=null;function oe(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==D.cameras.length&&(D.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=E[n];o===void 0&&(o=new yc,o.layers.enable(n),o.viewport=new Bi,E[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(D.matrix.copy(o.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),i===!0&&D.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Ds,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ae&&ae(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let se=new Xc;se.setAnimationLoop(oe),this.setAnimationLoop=function(e){ae=e},this.dispose=function(){}}},af=new Gi,of=new J;of.set(-1,0,0,0,1,0,0,0,1);function sf(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Ls(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(af.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(of),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function cf(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return U(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?H(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):H(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var lf=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),uf=null;function df(){return uf===null&&(uf=new ms(lf,16,16,Vn,On),uf.name=`DFG_LUT`,uf.minFilter=vn,uf.magFilter=vn,uf.wrapS=pn,uf.wrapT=pn,uf.generateMipmaps=!1,uf.needsUpdate=!0),uf}var ff=class{constructor(e={}){let{canvas:t=Wr(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=xn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([Un,Hn,Bn]),g=new Set([xn,En,wn,jn,kn,An]),_=new Uint32Array(4),v=new Int32Array(4),y=new q,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=Pr;let ee=0,te=0,j=null,ne=-1,re=null,M=new Bi,ie=new Bi,ae=null,oe=new X(0),se=0,ce=t.width,le=t.height,ue=1,de=null,fe=null,pe=new Bi(0,0,ce,le),me=new Bi(0,0,ce,le),he=!1,ge=new Ss,_e=!1,ve=!1,ye=new Gi,N=new q,be=new Bi,xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Se=!1;function Ce(){return j===null?ue:1}let P=n;function we(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r185`),t.addEventListener(`webglcontextlost`,Ge,!1),t.addEventListener(`webglcontextrestored`,Ke,!1),t.addEventListener(`webglcontextcreationerror`,qe,!1),P===null){let t=`webgl2`;if(P=we(t,e),P===null)throw we(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw U(`WebGLRenderer: `+e.message),e}let Te,Ee,F,De,I,L,Oe,ke,Ae,je,Me,Ne,R,Pe,Fe,Ie,Le,z,Re,ze,Be,Ve,He;function Ue(){Te=new kl(P),Te.init(),Be=new $d(P,Te),Ee=new al(P,Te,e,Be),F=new Zd(P,Te),Ee.reversedDepthBuffer&&d&&F.buffers.depth.setReversed(!0),O=P.createFramebuffer(),k=P.createFramebuffer(),A=P.createFramebuffer(),De=new Ml(P),I=new jd,L=new Qd(P,Te,F,I,Ee,Be,De),Oe=new Ol(T),ke=new Zc(P),Ve=new rl(P,ke),Ae=new Al(P,ke,De,Ve),je=new Pl(P,Ae,ke,Ve,De),z=new Nl(P,Ee,L),Fe=new ol(I),Me=new Ad(T,Oe,Te,Ee,Ve,Fe),Ne=new sf(T,I),R=new Fd,Pe=new Hd(Te),Le=new nl(T,Oe,F,je,p,s),Ie=new Xd(T,je,Ee),He=new cf(P,De,Ee,F),Re=new il(P,Te,De),ze=new jl(P,Te,De),De.programs=Me.programs,T.capabilities=Ee,T.extensions=Te,T.properties=I,T.renderLists=R,T.shadowMap=Ie,T.state=F,T.info=De}Ue(),m!==1009&&(w=new Il(m,t.width,t.height,o,r,i));let We=new rf(T,P);this.xr=We,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ue},this.setPixelRatio=function(e){e!==void 0&&(ue=e,this.setSize(ce,le,!1))},this.getSize=function(e){return e.set(ce,le)},this.setSize=function(e,n,r=!0){if(We.isPresenting){H(`WebGLRenderer: Can't change size while VR device is presenting.`);return}ce=e,le=n,t.width=Math.floor(e*ue),t.height=Math.floor(n*ue),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(ce*ue,le*ue).floor()},this.setDrawingBufferSize=function(e,n,r){ce=e,le=n,ue=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009){U(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){H(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(M)},this.getViewport=function(e){return e.copy(pe)},this.setViewport=function(e,t,n,r){e.isVector4?pe.set(e.x,e.y,e.z,e.w):pe.set(e,t,n,r),F.viewport(M.copy(pe).multiplyScalar(ue).round())},this.getScissor=function(e){return e.copy(me)},this.setScissor=function(e,t,n,r){e.isVector4?me.set(e.x,e.y,e.z,e.w):me.set(e,t,n,r),F.scissor(ie.copy(me).multiplyScalar(ue).round())},this.getScissorTest=function(){return he},this.setScissorTest=function(e){F.setScissorTest(he=e)},this.setOpaqueSort=function(e){de=e},this.setTransparentSort=function(e){fe=e},this.getClearColor=function(e){return e.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor(...arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(j!==null){let t=j.texture.format;e=h.has(t)}if(e){let e=j.texture.type,t=g.has(e),n=Le.getClearColor(),r=Le.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,P.clearBufferuiv(P.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,P.clearBufferiv(P.COLOR,0,v))}else r|=P.COLOR_BUFFER_BIT}t&&(r|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&P.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Ge,!1),t.removeEventListener(`webglcontextrestored`,Ke,!1),t.removeEventListener(`webglcontextcreationerror`,qe,!1),Le.dispose(),R.dispose(),Pe.dispose(),I.dispose(),Oe.dispose(),je.dispose(),Ve.dispose(),He.dispose(),Me.dispose(),We.dispose(),We.removeEventListener(`sessionstart`,et),We.removeEventListener(`sessionend`,tt),B.stop()};function Ge(e){e.preventDefault(),Kr(`WebGLRenderer: Context Lost.`),E=!0}function Ke(){Kr(`WebGLRenderer: Context Restored.`),E=!1;let e=De.autoReset,t=Ie.enabled,n=Ie.autoUpdate,r=Ie.needsUpdate,i=Ie.type;Ue(),De.autoReset=e,Ie.enabled=t,Ie.autoUpdate=n,Ie.needsUpdate=r,Ie.type=i}function qe(e){U(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Je(e){let t=e.target;t.removeEventListener(`dispose`,Je),Ye(t)}function Ye(e){Xe(e),I.remove(e)}function Xe(e){let t=I.get(e).programs;t!==void 0&&(t.forEach(function(e){Me.releaseProgram(e)}),e.isShaderMaterial&&Me.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=xe);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=dt(e,t,n,r,i);F.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ae.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ve.setup(i,r,s,n,c);let h,g=Re;if(c!==null&&(h=ke.get(c),g=ze,g.setIndex(h)),i.isMesh)r.wireframe===!0?(F.setLineWidth(r.wireframeLinewidth*Ce()),g.setMode(P.LINES)):g.setMode(P.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),F.setLineWidth(e*Ce()),i.isLineSegments?g.setMode(P.LINES):i.isLineLoop?g.setMode(P.LINE_LOOP):g.setMode(P.LINE_STRIP)}else i.isPoints?g.setMode(P.POINTS):i.isSprite&&g.setMode(P.TRIANGLES);if(i.isBatchedMesh){if(Te.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?ke.get(c).bytesPerElement:1,o=I.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(P,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function Ze(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,st(e,t,n),e.side=0,e.needsUpdate=!0,st(e,t,n),e.side=2):st(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),x=Pe.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];Ze(a,n,e),r.add(a)}else Ze(t,n,e),r.add(t)}}),x=C.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){I.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Te.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let Qe=null;function $e(e){Qe&&Qe(e)}function et(){B.stop()}function tt(){B.start()}let B=new Xc;B.setAnimationLoop($e),typeof self<`u`&&B.setContext(self),this.setAnimationLoop=function(e){Qe=e,We.setAnimationLoop(e),e===null?B.stop():B.start()},We.addEventListener(`sessionstart`,et),We.addEventListener(`sessionend`,tt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){U(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=We.enabled===!0&&We.isPresenting===!0,r=w!==null&&(j===null||n)&&w.begin(T,j);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),We.enabled===!0&&We.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(We.cameraAutoUpdate===!0&&We.updateCamera(t),t=We.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,j),x=Pe.get(e,C.length),x.init(t),x.state.textureUnits=L.getTextureUnits(),C.push(x),ye.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ge.setFromProjectionMatrix(ye,Br,t.reversedDepth),ve=this.localClippingEnabled,_e=Fe.init(this.clippingPlanes,ve),b=R.get(e,S.length),b.init(),S.push(b),We.enabled===!0&&We.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&nt(e,t,-1/0,T.sortObjects)}nt(e,t,0,T.sortObjects),b.finish(),T.sortObjects===!0&&b.sort(de,fe,t.reversedDepth),Se=We.enabled===!1||We.isPresenting===!1||We.hasDepthSensing()===!1,Se&&Le.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),_e===!0&&Fe.beginShadows();let i=x.state.shadowsArray;if(Ie.render(i,e,t),_e===!0&&Fe.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];it(n,r,e,a)}Se&&Le.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];rt(b,e,n,n.viewport)}}else r.length>0&&it(n,r,e,t),Se&&Le.render(e),rt(b,e,t)}j!==null&&te===0&&(L.updateMultisampleRenderTarget(j),L.updateRenderTargetMipmap(j)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Ve.resetDefaultState(),ne=-1,re=null,C.pop(),C.length>0?(x=C[C.length-1],L.setTextureUnits(x.state.textureUnits),_e===!0&&Fe.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function nt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||ge.intersectsSprite(e)){r&&be.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ye);let t=je.update(e),i=e.material;i.visible&&b.push(e,t,i,n,be.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||ge.intersectsObject(e))){let t=je.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),be.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),be.copy(e.boundingSphere.center)),be.applyMatrix4(e.matrixWorld).applyMatrix4(ye)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&b.push(e,t,s,n,be.z,o)}}else i.visible&&b.push(e,t,i,n,be.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)nt(i[e],t,n,r)}function rt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),_e===!0&&Fe.setGlobalState(T.clippingPlanes,n),r&&F.viewport(M.copy(r)),i.length>0&&at(i,t,n),a.length>0&&at(a,t,n),o.length>0&&at(o,t,n),F.buffers.depth.setTest(!0),F.buffers.depth.setMask(!0),F.buffers.color.setMask(!0),F.setPolygonOffset(!1)}function it(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Te.has(`EXT_color_buffer_half_float`)||Te.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new Hi(1,1,{generateMipmaps:!0,type:e?On:xn,minFilter:bn,samples:Math.max(4,Ee.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Y.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||M;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(oe),se=T.getClearAlpha(),se<1&&T.setClearColor(16777215,.5),T.clear(),Se&&Le.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),_e===!0&&Fe.setGlobalState(T.clippingPlanes,r),at(e,n,r),L.updateMultisampleRenderTarget(a),L.updateRenderTargetMipmap(a),Te.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,ot(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(L.updateMultisampleRenderTarget(a),L.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(oe,se),d!==void 0&&(r.viewport=d),T.toneMapping=u}function at(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&ot(o,t,n,s,l,c)}}function ot(e,t,n,r,i,a){e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function st(e,t,n){t.isScene!==!0&&(t=xe);let r=I.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Me.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Me.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Oe.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Je),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return lt(e,s),d}else s.uniforms=Me.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Me.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Fe.uniform),lt(e,s),r.needsLights=pt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function ct(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Uu.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function lt(e,t){let n=I.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function ut(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function dt(e,t,n,r,i){t.isScene!==!0&&(t=xe),L.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=j===null?T.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Y.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Oe.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=I.get(r),y=x.state.lights;if(_e===!0&&(ve===!0||e!==re)){let t=e===re&&r.id===ne;Fe.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Fe.numPlanes||v.numIntersection!==Fe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=st(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),k=v.uniforms;if(F.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==ne&&(ne=r.id,w=!0),v.needsLights){let e=ut(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||re!==e){F.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(P,`projectionMatrix`,e.projectionMatrix),O.setValue(P,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(P,N.setFromMatrixPosition(e.matrixWorld)),Ee.logarithmicDepthBuffer&&O.setValue(P,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(P,`isOrthographic`,e.isOrthographicCamera===!0),re!==e&&(re=e,w=!0,E=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&O.setValue(P,`directionalShadowMap`,y.state.directionalShadowMap,L),y.state.spotShadowMap.length>0&&O.setValue(P,`spotShadowMap`,y.state.spotShadowMap,L),y.state.pointShadowMap.length>0&&O.setValue(P,`pointShadowMap`,y.state.pointShadowMap,L)),i.isSkinnedMesh){O.setOptional(P,i,`bindMatrix`),O.setOptional(P,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(P,`boneTexture`,e.boneTexture,L))}i.isBatchedMesh&&(O.setOptional(P,i,`batchingTexture`),O.setValue(P,`batchingTexture`,i._matricesTexture,L),O.setOptional(P,i,`batchingIdTexture`),O.setValue(P,`batchingIdTexture`,i._indirectTexture,L),O.setOptional(P,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(P,`batchingColorTexture`,i._colorsTexture,L));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&z.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(P,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(k.envMapIntensity.value=t.environmentIntensity),k.dfgLUT!==void 0&&(k.dfgLUT.value=df()),w){if(O.setValue(P,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&ft(k,E),a&&r.fog===!0&&Ne.refreshFogUniforms(k,a),Ne.refreshMaterialUniforms(k,r,ue,le,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;k.probesSH.value=e.texture,k.probesMin.value.copy(e.boundingBox.min),k.probesMax.value.copy(e.boundingBox.max),k.probesResolution.value.copy(e.resolution)}Uu.upload(P,ct(v),k,L)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Uu.upload(P,ct(v),k,L),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(P,`center`,i.center),O.setValue(P,`modelViewMatrix`,i.modelViewMatrix),O.setValue(P,`normalMatrix`,i.normalMatrix),O.setValue(P,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];He.update(n,S),He.bind(n,S)}}return S}function ft(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function pt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ee},this.getActiveMipmapLevel=function(){return te},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(e,t,n){let r=I.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),I.get(e.texture).__webglTexture=t,I.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=I.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){j=e,ee=t,te=n;let r=null,i=!1,a=!1;if(e){let o=I.get(e);if(o.__useDefaultFramebuffer!==void 0){F.bindFramebuffer(P.FRAMEBUFFER,o.__webglFramebuffer),M.copy(e.viewport),ie.copy(e.scissor),ae=e.scissorTest,F.viewport(M),F.scissor(ie),F.setScissorTest(ae),ne=-1;return}if(o.__webglFramebuffer===void 0)L.setupRenderTarget(e);else if(o.__hasExternalTextures)L.rebindTextures(e,I.get(e.texture).__webglTexture,I.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&I.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);L.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=I.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&L.useMultisampledRTT(e)===!1?I.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,M.copy(e.viewport),ie.copy(e.scissor),ae=e.scissorTest}else M.copy(pe).multiplyScalar(ue).floor(),ie.copy(me).multiplyScalar(ue).floor(),ae=he;if(n!==0&&(r=O),F.bindFramebuffer(P.FRAMEBUFFER,r)&&F.drawBuffers(e,r),F.viewport(M),F.scissor(ie),F.setScissorTest(ae),i){let r=I.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=I.get(e.textures[t]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=I.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,t.__webglTexture,n)}ne=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=I.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){F.bindFramebuffer(P.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s),!Ee.textureFormatReadable(c)){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!Ee.textureTypeReadable(l)){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&P.readPixels(t,n,r,i,Be.convert(c),Be.convert(l),a)}finally{let e=j===null?null:I.get(j).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=I.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){F.bindFramebuffer(P.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s),!Ee.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!Ee.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,d),P.bufferData(P.PIXEL_PACK_BUFFER,a.byteLength,P.STREAM_READ),P.readPixels(t,n,r,i,Be.convert(l),Be.convert(u),0);let f=j===null?null:I.get(j).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,f);let p=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Yr(P,p,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,d),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,a),P.deleteBuffer(d),P.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;L.setTexture2D(e,0),P.copyTexSubImage2D(P.TEXTURE_2D,n,0,0,o,s,i,a),F.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Be.convert(t.format),_=Be.convert(t.type),v;t.isData3DTexture?(L.setTexture3D(t,0),v=P.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(L.setTexture2DArray(t,0),v=P.TEXTURE_2D_ARRAY):(L.setTexture2D(t,0),v=P.TEXTURE_2D),F.activeTexture(P.TEXTURE0),F.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,t.flipY),F.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),F.pixelStorei(P.UNPACK_ALIGNMENT,t.unpackAlignment);let y=F.getParameter(P.UNPACK_ROW_LENGTH),b=F.getParameter(P.UNPACK_IMAGE_HEIGHT),x=F.getParameter(P.UNPACK_SKIP_PIXELS),S=F.getParameter(P.UNPACK_SKIP_ROWS),C=F.getParameter(P.UNPACK_SKIP_IMAGES);F.pixelStorei(P.UNPACK_ROW_LENGTH,h.width),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,h.height),F.pixelStorei(P.UNPACK_SKIP_PIXELS,l),F.pixelStorei(P.UNPACK_SKIP_ROWS,u),F.pixelStorei(P.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=I.get(e),r=I.get(t),h=I.get(n.__renderTarget),g=I.get(r.__renderTarget);F.bindFramebuffer(P.READ_FRAMEBUFFER,h.__webglFramebuffer),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,I.get(e).__webglTexture,i,d+n),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,I.get(t).__webglTexture,a,m+n)),P.blitFramebuffer(l,u,o,s,f,p,o,s,P.DEPTH_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||I.has(e)){let n=I.get(e),r=I.get(t);F.bindFramebuffer(P.READ_FRAMEBUFFER,k),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,n.__webglTexture,i),T?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,r.__webglTexture,a),i===0?T?P.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):P.copyTexSubImage2D(v,a,f,p,l,u,o,s):P.blitFramebuffer(l,u,o,s,f,p,o,s,P.COLOR_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?P.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h);F.pixelStorei(P.UNPACK_ROW_LENGTH,y),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,b),F.pixelStorei(P.UNPACK_SKIP_PIXELS,x),F.pixelStorei(P.UNPACK_SKIP_ROWS,S),F.pixelStorei(P.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&P.generateMipmap(v),F.unbindTexture()},this.initRenderTarget=function(e){I.get(e).__webglFramebuffer===void 0&&L.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?L.setTextureCube(e,0):e.isData3DTexture?L.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?L.setTexture2DArray(e,0):L.setTexture2D(e,0),F.unbindTexture()},this.resetState=function(){ee=0,te=0,j=null,F.reset(),Ve.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Br}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Y._getDrawingBufferColorSpace(e),t.unpackColorSpace=Y._getUnpackColorSpace()}},pf={type:`change`},mf={type:`start`},hf={type:`end`},gf=new Qo,_f=new vs,vf=Math.cos(70*Si.DEG2RAD),yf=new q,bf=2*Math.PI,$={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},xf=1e-6,Sf=class extends qc{constructor(e,t=null){super(e,t),this.state=$.NONE,this.target=new q,this.cursor=new q,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:`ArrowLeft`,UP:`ArrowUp`,RIGHT:`ArrowRight`,BOTTOM:`ArrowDown`},this.mouseButtons={LEFT:un.ROTATE,MIDDLE:un.DOLLY,RIGHT:un.PAN},this.touches={ONE:dn.ROTATE,TWO:dn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle=`auto`,this._domElementKeyEvents=null,this._lastPosition=new q,this._lastQuaternion=new Ci,this._lastTargetPosition=new q,this._quat=new Ci().setFromUnitVectors(e.up,new q(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Kc,this._sphericalDelta=new Kc,this._scale=1,this._panOffset=new q,this._rotateStart=new K,this._rotateEnd=new K,this._rotateDelta=new K,this._panStart=new K,this._panEnd=new K,this._panDelta=new K,this._dollyStart=new K,this._dollyEnd=new K,this._dollyDelta=new K,this._dollyDirection=new q,this._mouse=new K,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=wf.bind(this),this._onPointerDown=Cf.bind(this),this._onPointerUp=Tf.bind(this),this._onContextMenu=Mf.bind(this),this._onMouseWheel=Of.bind(this),this._onKeyDown=kf.bind(this),this._onTouchStart=Af.bind(this),this._onTouchMove=jf.bind(this),this._onMouseDown=Ef.bind(this),this._onMouseMove=Df.bind(this),this._interceptControlDown=Nf.bind(this),this._interceptControlUp=Pf.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e===`grab`?this.domElement.style.cursor=`grab`:this.domElement.style.cursor=`auto`}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener(`pointerdown`,this._onPointerDown),this.domElement.addEventListener(`pointercancel`,this._onPointerUp),this.domElement.addEventListener(`contextmenu`,this._onContextMenu),this.domElement.addEventListener(`wheel`,this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener(`keydown`,this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction=`none`}disconnect(){this.domElement.removeEventListener(`pointerdown`,this._onPointerDown),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.domElement.removeEventListener(`pointercancel`,this._onPointerUp),this.domElement.removeEventListener(`wheel`,this._onMouseWheel),this.domElement.removeEventListener(`contextmenu`,this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener(`keydown`,this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=``}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(pf),this.update(),this.state=$.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;yf.copy(t).sub(this.target),yf.applyQuaternion(this._quat),this._spherical.setFromVector3(yf),this.autoRotate&&this.state===$.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=bf:n>Math.PI&&(n-=bf),r<-Math.PI?r+=bf:r>Math.PI&&(r-=bf),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let i=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let e=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),i=e!=this._spherical.radius}if(yf.setFromSpherical(this._spherical),yf.applyQuaternion(this._quatInverse),t.copy(this.target).add(yf),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let e=null;if(this.object.isPerspectiveCamera){let t=yf.length();e=this._clampDistance(t*this._scale);let n=t-e;this.object.position.addScaledVector(this._dollyDirection,n),this.object.updateMatrixWorld(),i=!!n}else if(this.object.isOrthographicCamera){let t=new q(this._mouse.x,this._mouse.y,0);t.unproject(this.object);let n=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),i=n!==this.object.zoom;let r=new q(this._mouse.x,this._mouse.y,0);r.unproject(this.object),this.object.position.sub(r).add(t),this.object.updateMatrixWorld(),e=yf.length()}else console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`),this.zoomToCursor=!1;e!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position):(gf.origin.copy(this.object.position),gf.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(gf.direction))<vf?this.object.lookAt(this.target):(_f.setFromNormalAndCoplanarPoint(this.object.up,this.target),gf.intersectPlane(_f,this.target))))}else if(this.object.isOrthographicCamera){let e=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),e!==this.object.zoom&&(this.object.updateProjectionMatrix(),i=!0)}return this._scale=1,this._performCursorZoom=!1,i||this._lastPosition.distanceToSquared(this.object.position)>xf||8*(1-this._lastQuaternion.dot(this.object.quaternion))>xf||this._lastTargetPosition.distanceToSquared(this.target)>xf?(this.dispatchEvent(pf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e===null?bf/60/60*this.autoRotateSpeed:bf/60*this.autoRotateSpeed*e}_getZoomScale(e){let t=Math.abs(e*.01);return .95**(this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){yf.setFromMatrixColumn(t,0),yf.multiplyScalar(-e),this._panOffset.add(yf)}_panUp(e,t){this.screenSpacePanning===!0?yf.setFromMatrixColumn(t,1):(yf.setFromMatrixColumn(t,0),yf.crossVectors(this.object.up,yf)),yf.multiplyScalar(e),this._panOffset.add(yf)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;yf.copy(r).sub(this.target);let i=yf.length();i*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*i/n.clientHeight,this.object.matrix),this._panUp(2*t*i/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,i=t-n.top,a=n.width,o=n.height;this._mouse.x=r/a*2-1,this._mouse.y=-(i/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(bf*this._rotateDelta.x/t.clientHeight),this._rotateUp(bf*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(bf*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-bf*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(bf*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-bf*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyStart.set(0,i)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateEnd.set(n,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(bf*this._rotateDelta.x/t.clientHeight),this._rotateUp(bf*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,i),this._dollyDelta.set(0,(this._dollyEnd.y/this._dollyStart.y)**+this.zoomSpeed),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new K,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Cf(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.ownerDocument.addEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.addEventListener(`pointerup`,this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType===`touch`?this._onTouchStart(e):this._onMouseDown(e),this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grabbing`)))}function wf(e){this.enabled!==!1&&(e.pointerType===`touch`?this._onTouchMove(e):this._onMouseMove(e))}function Tf(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.dispatchEvent(hf),this.state=$.NONE,this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grab`);break;case 1:let t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y})}}function Ef(e){let t;switch(e.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case un.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(e),this.state=$.DOLLY;break;case un.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=$.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=$.ROTATE}break;case un.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=$.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=$.PAN}break;default:this.state=$.NONE}this.state!==$.NONE&&this.dispatchEvent(mf)}function Df(e){switch(this.state){case $.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case $.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case $.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e)}}function Of(e){this.enabled!==!1&&this.enableZoom!==!1&&this.state===$.NONE&&(e.preventDefault(),this.dispatchEvent(mf),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(hf))}function kf(e){this.enabled!==!1&&this._handleKeyDown(e)}function Af(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case dn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=$.TOUCH_ROTATE;break;case dn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=$.TOUCH_PAN;break;default:this.state=$.NONE}break;case 2:switch(this.touches.TWO){case dn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=$.TOUCH_DOLLY_PAN;break;case dn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=$.TOUCH_DOLLY_ROTATE;break;default:this.state=$.NONE}break;default:this.state=$.NONE}this.state!==$.NONE&&this.dispatchEvent(mf)}function jf(e){switch(this._trackPointer(e),this.state){case $.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case $.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case $.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case $.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=$.NONE}}function Mf(e){this.enabled!==!1&&e.preventDefault()}function Nf(e){e.key===`Control`&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}function Pf(e){e.key===`Control`&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}var Ff=[{key:`J`,name:`Jeda`,nameEn:`Pause`,color:15311371,position:[-1.8,0,1.8],scenario:`family-emergency`,description:`Hentikan tekanan waktu sebelum informasi bergerak menuju tindakan.`,descriptionEn:`Stop time pressure before information turns into action.`},{key:`E`,name:`Emosi`,nameEn:`Emotion`,color:14373730,position:[1.7,0,-1.6],scenario:`viral-info`,description:`Kenali rasa takut, panik, marah, atau FOMO yang sedang dipancing.`,descriptionEn:`Recognize the fear, panic, anger, or FOMO being triggered.`},{key:`D`,name:`Data`,nameEn:`Evidence`,color:2979304,position:[5.7,0,1.8],scenario:`manipulated-media`,description:`Pisahkan klaim dari bukti yang dapat diperiksa secara independen.`,descriptionEn:`Separate claims from evidence that can be checked independently.`},{key:`A`,name:`Aksi`,nameEn:`Action`,color:1287057,position:[9.1,0,-1.6],scenario:`qr-payment`,description:`Nilai risiko klik, scan, transfer, atau share sebelum bertindak.`,descriptionEn:`Assess the risks of clicking, scanning, transferring, or sharing before you act.`}],If=null;function Lf(){return document.documentElement.lang===`en`}function Rf(e,t){return Lf()?t:e}function zf(e,t=`#ffffff`,n=`#0f172a`,r=320,i=112){let a=document.createElement(`canvas`);a.width=r,a.height=i;let o=a.getContext(`2d`);o.clearRect(0,0,r,i),o.fillStyle=n,o.roundRect(4,4,r-8,i-8,24),o.fill(),o.strokeStyle=`rgba(255,255,255,.32)`,o.lineWidth=4,o.stroke(),o.fillStyle=t,o.font=`800 ${Math.round(i*.42)}px Arial`,o.textAlign=`center`,o.textBaseline=`middle`,o.fillText(e,r/2,i/2+2);let s=new ws(a);s.colorSpace=Pr;let c=new Uo(new ko({map:s,transparent:!0,depthTest:!1}));return c.scale.set(r/i*1.12,1.12,1),c}function Bf(e,t,n,r,i=.78){return new ds(new Os(e,t,n),new Us({color:r,roughness:i,metalness:.02}))}function Vf(e){let t=new ya;t.position.set(5.4,0,0);let n=Bf(17.5,.24,10.5,10118977);n.position.y=-.16,n.receiveShadow=!0,t.add(n);let r=Bf(16.7,.04,9.7,11960405);r.position.y=-.015,r.receiveShadow=!0,t.add(r);let i=new Us({color:16777215,roughness:.9,emissive:2826260,emissiveIntensity:.12}),a=(e,n,r,a)=>{let o=new ds(new Os(e,.065,n),i);o.position.set(r,.05,a),o.receiveShadow=!0,t.add(o)};a(16.4,.1,0,-4.55),a(16.4,.1,0,4.55),a(.1,9.2,-8.15,0),a(.1,9.2,8.15,0),[-5.1,-1.7,1.7,5.1].forEach(e=>a(.1,9.2,e,0)),a(16.4,.1,0,0),[-5.1,-1.7,1.7,5.1].forEach((e,n)=>{let r=new ds(new Os(.13,.08,9.15),new Us({color:Ff[n].color,emissive:Ff[n].color,emissiveIntensity:1.15}));r.position.set(e,.08,0),r.userData.pulseOffset=n*.55,t.add(r)});let o=new Us({color:2377307,roughness:.85});return[[17.9,.2,.25,0,0,-5.1],[17.9,.2,.25,0,0,5.1],[.25,.2,10.4,-8.8,0,0],[.25,.2,10.4,8.8,0,0]].forEach(([e,n,r,i,a,s])=>{let c=new ds(new Os(e,n,r),o);c.position.set(i,a,s),t.add(c)}),e.add(t),t}function Hf(e,t){let n=new ya;n.position.set(...e.position),n.userData.guard=e,n.userData.baseY=0,n.userData.phase=t*.8;let r=new Us({color:t===3?11101507:14261104,roughness:.85}),i=new Us({color:e.color,roughness:.65}),a=new Us({color:1319224,roughness:.8}),o=new ds(new ks(.42,.72,4,8),i);o.position.y=1.48,o.castShadow=!0,n.add(o);let s=new ds(new Ms(.38,16,12),r);s.position.y=2.45,s.castShadow=!0,n.add(s);let c=new ds(new Ms(.4,12,8,0,Math.PI*2,0,Math.PI*.56),a);c.position.y=2.56,c.castShadow=!0,n.add(c);let l=(e,t,r,i,a=.82)=>{let o=new ya;o.position.set(e,t,0),o.rotation.z=r;let s=new ds(new ks(.12,a,3,7),i);return s.position.y=-a*.46,s.castShadow=!0,o.add(s),n.add(o),o};n.userData.leftArm=l(-.48,1.77,-.5,i,.72),n.userData.rightArm=l(.48,1.77,.5,i,.72),n.userData.leftLeg=l(-.23,1,-.12,a,.82),n.userData.rightLeg=l(.23,1,.12,a,.82);let u=zf(e.key,`#ffffff`,`#${e.color.toString(16).padStart(6,`0`)}`,120,120);u.position.set(0,3.22,0),u.scale.set(.84,.84,1),u.userData.guard=e,n.add(u);let d=zf(Rf(e.name,e.nameEn).toUpperCase(),`#e8f1ff`,`rgba(15,23,42,.88)`);return d.position.set(0,2.93,0),d.scale.set(1.7,.58,1),d.userData.guard=e,n.add(d),n.traverse(t=>{t.userData.guard=e}),n}function Uf(e){let t=new ya;t.position.set(1.1,0,-7.1);let n=Bf(8.6,.28,2.1,4928296);n.position.set(-1.6,.1,0),n.receiveShadow=!0,t.add(n),(e=>{let n=Bf(.08,3.5,.08,14540253);n.position.set(e,1.75,1.25),t.add(n);let r=Bf(1.1,.42,.04,14167870);r.position.set(e+.58,3.15,1.25),t.add(r);let i=Bf(1.1,.42,.04,16317180);i.position.set(e+.58,2.74,1.25),t.add(i)})(7.3),[6.4,7.2].forEach((e,n)=>{let r=new ds(new As(.28,.38,.45,8),new Us({color:9523255}));r.position.set(e,.48,1.2),t.add(r);let i=new ds(new Ms(.52+n%2*.12,8,6),new Us({color:2582087,roughness:1}));i.scale.y=1.3,i.position.set(e,1.13,1.2),t.add(i)}),e.add(t)}function Wf(){let e=new ya,t=Bf(1.15,.82,.16,13977430,.55);t.castShadow=!0,e.add(t);let n=zf(`!`,`#ffffff`,`#d54756`,100,100);return n.position.set(0,0,.1),n.scale.set(.58,.58,1),e.add(n),e.position.set(-7.7,.78,0),e.rotation.y=.16,e}function Gf(e){let t=matchMedia(`(prefers-reduced-motion: reduce)`).matches,n=new Oa;n.background=new X(594727),n.fog=new Da(594727,18,36);let r=new yc(37,1,.1,80),i=new q(14.5,12.5,17.5);r.position.copy(i);let a=new ff({antialias:!0,powerPreference:`high-performance`,preserveDrawingBuffer:!0});a.setPixelRatio(Math.min(devicePixelRatio,1.75)),a.outputColorSpace=Pr,a.shadowMap.enabled=!0,a.shadowMap.type=2,a.domElement.className=`training-3d-canvas`,e.replaceChildren(a.domElement);let o=new sc(12114431,4401439,1.65);n.add(o);let s=new wc(16772559,2.25);s.position.set(-6,15,9),s.castShadow=!0,s.shadow.mapSize.set(1024,1024),s.shadow.camera.left=-16,s.shadow.camera.right=16,s.shadow.camera.top=16,s.shadow.camera.bottom=-16,n.add(s);let c=new xc(3327956,28,24,2);c.position.set(10,5,-2),n.add(c);let l=Vf(n);Uf(n);let u=Ff.map((e,t)=>{let r=Hf(e,t);return n.add(r),r}),d=Wf();n.add(d);let f=new Sf(r,a.domElement);f.enableDamping=!0,f.enablePan=!1,f.enableRotate=!0,f.enableZoom=!1,f.minDistance=13,f.maxDistance=27,f.minPolarAngle=.58,f.maxPolarAngle=1.25,f.minAzimuthAngle=-.62,f.maxAzimuthAngle=.62,f.target.set(2.6,.75,0),f.update();let p=new Hc,m=new K,h=new vs(new q(0,1,0),0),g=new q,_=new Gc,v=t,y=0,b=Ff[0],x=null,S=null;T(b);function C(){let t=Math.max(e.clientWidth,1),n=Math.max(e.clientHeight,1);a.setSize(t,n,!1),r.aspect=t/n,r.updateProjectionMatrix()}function w(e,t=!1){let n=a.domElement.getBoundingClientRect();m.x=(e.clientX-n.left)/n.width*2-1,m.y=-((e.clientY-n.top)/n.height)*2+1,p.setFromCamera(m,r),x=p.intersectObjects(u,!0).find(e=>e.object.userData.guard)?.object.userData.guard||null,a.domElement.classList.toggle(`is-pointing`,!!x),t&&x&&T(x)}function T(e){b=e;let t=document.querySelector(`.training-3d-inspector`);if(!t)return;t.classList.add(`active`),t.querySelector(`span`).textContent=Rf(`Garis ${e.key}`,`Line ${e.key}`),t.querySelector(`strong`).textContent=Rf(e.name,e.nameEn),t.querySelector(`p`).textContent=Rf(e.description,e.descriptionEn);let n=t.querySelector(`button`);n.disabled=!1,n.dataset.scenario=e.scenario}function E(e,t){let n=b||Ff[0],r=u.find(e=>e.userData.guard.key===n.key);r&&(r.position.x=Si.clamp(r.position.x+e,-11.5,11.5),r.position.z=Si.clamp(r.position.z+t,-3.2,3.2))}function D(e){let t=S;if(!t)return;let n=a.domElement.getBoundingClientRect();m.x=(e.clientX-n.left)/n.width*2-1,m.y=-((e.clientY-n.top)/n.height)*2+1,p.setFromCamera(m,r),p.ray.intersectPlane(h,g)&&(t.position.x=Si.clamp(g.x,-11.5,11.5),t.position.z=Si.clamp(g.z,-3.2,3.2))}function O(){y=requestAnimationFrame(O);let e=_.getElapsedTime();if(!v){let t=e*.62%16.2;d.position.x=-7.65+t,d.position.z=Math.sin(e*1.25)*1.1,d.position.y=.82+Math.sin(e*3.2)*.09,d.rotation.y=Math.sin(e)*.22,u.forEach((t,n)=>{let r=e*2.2+t.userData.phase;t.position.y=Math.sin(r)*.045,t.userData.leftArm.rotation.z=-.52+Math.sin(r)*.18,t.userData.rightArm.rotation.z=.52-Math.sin(r)*.18;let i=b?.key===Ff[n].key;t.scale.lerp(new q(i?1.12:1,i?1.12:1,i?1.12:1),.08)}),l.children.forEach(t=>{t.userData.pulseOffset!=null&&(t.material.emissiveIntensity=.75+Math.sin(e*2+t.userData.pulseOffset)*.35)})}f.update(),a.render(n,r)}function k(e){let t=e.target.closest(`[data-3d-action]`);t&&t.dataset.action!==`noop`&&(t.dataset[`3dAction`]===`reset`?(r.position.copy(i),f.target.set(2.6,.75,0),f.update()):(v=!v,t.innerHTML=v?`&#9654;`:`&#10074;&#10074;`,t.setAttribute(`aria-label`,v?Rf(`Lanjutkan animasi`,`Resume animation`):Rf(`Jeda animasi`,`Pause animation`)),t.title=v?Rf(`Lanjutkan animasi`,`Resume animation`):Rf(`Jeda animasi`,`Pause animation`)))}let A=document.querySelector(`.training-3d-toolbar`),ee=new ResizeObserver(C);return ee.observe(e),a.domElement.style.touchAction=`none`,a.domElement.addEventListener(`wheel`,e=>e.preventDefault(),{passive:!1}),a.domElement.addEventListener(`pointerdown`,e=>{let t=a.domElement.getBoundingClientRect();m.x=(e.clientX-t.left)/t.width*2-1,m.y=-((e.clientY-t.top)/t.height)*2+1,p.setFromCamera(m,r);let n=p.intersectObjects(u,!0).find(e=>e.object.userData.guard);if(n){let e=n.object.userData.guard;T(e),S=u.find(t=>t.userData.guard.key===e.key)||null;return}S=null}),a.domElement.addEventListener(`pointermove`,e=>{w(e),S&&D(e)}),a.domElement.addEventListener(`pointerup`,()=>{S=null}),a.domElement.addEventListener(`pointerleave`,()=>{x=null,a.domElement.classList.remove(`is-pointing`),S=null}),a.domElement.addEventListener(`click`,e=>w(e,!0)),window.addEventListener(`keydown`,e=>{let t=e.key.toLowerCase();[`arrowleft`,`arrowright`,`arrowup`,`arrowdown`,`a`,`d`,`w`,`s`].includes(t)&&e.preventDefault(),b||=Ff[0],(t===`arrowleft`||t===`a`)&&E(-.28,0),(t===`arrowright`||t===`d`)&&E(.28,0),(t===`arrowup`||t===`w`)&&E(0,-.28),(t===`arrowdown`||t===`s`)&&E(0,.28)}),A?.addEventListener(`click`,k),C(),O(),{dispose(){cancelAnimationFrame(y),ee.disconnect(),A?.removeEventListener(`click`,k),f.dispose(),a.dispose(),n.traverse(e=>{e.geometry?.dispose?.(),Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material?.dispose?.(),e.material?.map?.dispose?.()})}}}function Kf(){let e=document.querySelector(`#training-3d-stage`);if(!(!e||If))try{If=Gf(e),document.querySelector(`.training-hero`)?.classList.add(`scene-ready`)}catch(t){console.error(`Arena 3D tidak dapat dimuat`,t),e.innerHTML=`<div class="training-3d-fallback"><strong>Arena 3D belum tersedia</strong><span>Gunakan daftar skenario di bawah untuk melanjutkan latihan.</span></div>`}}function qf(){If?.dispose(),If=null}window.addEventListener(`hadang:before-render`,qf),window.addEventListener(`hadang:language-change`,()=>{document.querySelector(`#training-3d-stage`)&&(qf(),requestAnimationFrame(Kf))}),window.addEventListener(`hadang:rendered`,e=>{e.detail?.route===`training`&&requestAnimationFrame(Kf)}),document.querySelector(`#training-3d-stage`)&&Kf();export{r as t};