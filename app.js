const steps=[['client','Client & Projet'],['quantities','Quantités'],['product','Produit'],['components','Composants'],['markings','Marquages'],['outerbox','Contre-boîte'],['documents','Documents'],['validation','Validation']];
const newComponent=()=>({id:crypto.randomUUID(),name:'',type:'',outerMaterial:'',outerRef:'',innerMaterial:'',innerRef:'',finish:'',finishColorRef:'',varnish:'',texture:'',groove:'Non / No',removable:'Non / No',notes:''});
const newMarking=()=>({id:crypto.randomUUID(),componentId:'',type:'',precision:'',width:'',color:'',colorRef:'',horizontal:'',vertical:'',offsetH:'',offsetV:'',notes:''});
const blank=()=>({id:crypto.randomUUID(),client:{},quantities:{prototype:{},bat:{},preseries:{},series:{},bands:[{from:0,to:100,price:''},{from:101,to:500,price:''},{from:501,to:1000,price:''},{from:1001,to:5000,price:''}]},product:{},components:[newComponent()],markings:[newMarking()],outerbox:{},documents:[],validation:{status:'Brouillon'}});
let d=JSON.parse(localStorage.getItem('ftDraftV10')||'null')||blank(),
  cur=0,
  docFilter='all';
  let currentFileHandle = null;
if(!d.components?.length)d.components=[newComponent()];if(!d.markings?.length)d.markings=[newMarking()];const all=s=>[...document.querySelectorAll(s)],get=(o,p)=>p.split('.').reduce((a,k)=>a?.[k],o),set=(o,p,v)=>{let a=p.split('.'),x=o;a.slice(0,-1).forEach(k=>x=x[k]??={});x[a.at(-1)]=v};
function init(){renderNav();nav.onclick=e=>{let b=e.target.closest('button');if(b)show(+b.dataset.i)};all('[data-p]').forEach(x=>x.oninput=()=>{set(d,x.dataset.p,x.value);if(x.id==='sourceRef')validateReference();dirty()});renderQuantities();addComp.onclick=()=>{d.components.push(newComponent());renderComponents();dirty()};addMark.onclick=()=>{d.markings.push(newMarking());renderMarkings();dirty()};clientFiles.onchange=e=>addFiles(e.target.files,'client');productImage.onchange=e=>addFiles(e.target.files,'product');outerboxImages.onchange=e=>addFiles(e.target.files,'outerbox');globalFiles.onchange=e=>addFiles(e.target.files,'documents');outerCavity.onchange=renderOuterboxConditional;outerDrawer.onchange=renderOuterboxConditional;
newBtn.onclick=()=>{
  if(confirm('Créer une nouvelle fiche ?')){
    d=blank();
    localStorage.removeItem('ftDraftV10');
    renderAll();
    show(0)}
};
openBtn.onclick=openUser;
saveBtn.onclick=saveUser;
saveAsBtn.onclick=saveAsUser;
pdfBtn.onclick=exportPDF;
zipBtn.onclick=exportZIP;
adminBtn.onclick=()=>adminDialog.showModal();
closeAdmin.onclick=()=>adminDialog.close();
jsonBtn.onclick=()=>download(textBytes(JSON.stringify(d,null,2)),safeName()+'.json','application/json');
importFile.onchange=importJson;prev.onclick=()=>show(Math.max(0,cur-1));
next.onclick=()=>show(Math.min(steps.length-1,cur+1));all('.lang').forEach(b=>b.onclick=()=>setLanguage(b.dataset.lang));all('.doc-filters button').forEach(b=>b.onclick=()=>{docFilter=b.dataset.filter;all('.doc-filters button').forEach(x=>x.classList.toggle('active',x===b));renderDocuments()});renderAll();show(0)}
function renderAll(){all('[data-p]').forEach(x=>x.value=get(d,x.dataset.p)??'');renderQuantities();renderComponents();renderMarkings();renderPreviews();renderDocuments();renderOuterboxConditional();renderSummary();validateReference();applyTranslations()}
function show(i){cur=i;all('.panel').forEach((x,n)=>x.classList.toggle('active',n===i));all('nav button').forEach((x,n)=>x.classList.toggle('active',n===i));bar.style.width=(i+1)/steps.length*100+'%';prev.disabled=i===0;next.disabled=i===steps.length-1;if(steps[i][0]==='components'&&!d.components.length){d.components.push(newComponent());renderComponents()}if(steps[i][0]==='markings'&&!d.markings.length){d.markings.push(newMarking());renderMarkings()}if(steps[i][0]==='documents')renderDocuments();if(steps[i][0]==='validation')renderSummary();scrollTo({top:0,behavior:'smooth'})}
function validRef(){return !!(d.client.sourceReference||'').trim()}function safeName(){return (d.client.sourceReference||'Technical-Sheet').trim().replace(/[\\/:*?"<>|]+/g,'-')}function validateReference(){let ok=validRef(),r=(d.client.sourceReference||'').trim();refText.textContent=ok?r:tr('waiting');refText.classList.toggle('waiting',!ok);requiredMsg.hidden=ok;
[saveBtn,pdfBtn,zipBtn]
saveBtn.disabled   = !ok;
saveAsBtn.disabled = !ok;
pdfBtn.disabled    = !ok;
zipBtn.disabled    = !ok;

newBtn.disabled  = false;
openBtn.disabled = false;
}
async function saveUser(){

    if(!validRef()) return;

    try{

        if(!currentFileHandle){

            await saveAsUser();
            return;

        }

        const writable =
            await currentFileHandle.createWritable();

        await writable.write(
            JSON.stringify(d,null,2)
        );

        await writable.close();

        state.style.color='#2f9149';

    }
    catch(error){

        console.log(error);

    }
}

async function saveUser(){

    if(!validRef()) return;

    try{

        if(!currentFileHandle){

            await saveAsUser();
            return;

        }

        const writable =
            await currentFileHandle.createWritable();

        await writable.write(
            JSON.stringify(
                d,
                null,
                2
            )
        );

        await writable.close();

        state.style.color='#2f9149';

    }
    catch(error){

        console.log(error);

    }
}

function dirty(){state.style.color='#f47738';validateReference()}
async function openUser(){

    try{

        const [handle] =
            await window.showOpenFilePicker({

            types:[{
                description:'Technical Sheet',
                accept:{
                    'application/json':['.json']
                }
            }]
        });

      currentFileHandle = handle;

        const file =
            await handle.getFile();

        const text =
            await file.text();

        d = JSON.parse(text);

        if(!d.components?.length)
            d.components=[newComponent()];

        if(!d.markings?.length)
            d.markings=[newMarking()];

        renderAll();
        show(0);

    }catch(error){

        console.log(error);

    }

}
function renderQuantities(){
  const labels=[
 ['prototype',tr('prototype')],
 ['bat',tr('bat')],
 ['preseries',tr('preseries')],
 ['series',tr('series')]
];
  quantityGrid.innerHTML=labels.map(([k,l])=>`<article class="quantity-card"><h3>${l}</h3><label>
  ${tr('quantity')}
  <div class="unit-input"><input type="number" min="0" data-q="${k}" data-f="quantity" value="${d.quantities[k]?.quantity||''}"><span>pces</span></div></label><label>${tr('price')}<div class="unit-input"><input type="number" min="0" step="0.01" data-q="${k}" data-f="price" value="${d.quantities[k]?.price||''}"><span>€</span></div></label></article>`).join('');priceVent.innerHTML=d.quantities.bands.map((b,i)=>`<div class="vent-item"><input type="number" data-band="${i}" data-f="from" value="${b.from}"><b>à</b><input type="number" data-band="${i}" data-f="to" value="${b.to}"><div class="unit-input price"><input type="number" step="0.01" data-band="${i}" data-f="price" value="${b.price||''}" placeholder="${tr('price')}"><span>€</span></div></div>`).join('');all('[data-q]').forEach(x=>x.oninput=()=>{d.quantities[x.dataset.q][x.dataset.f]=x.value;dirty()});all('[data-band]').forEach(x=>x.oninput=()=>{d.quantities.bands[+x.dataset.band][x.dataset.f]=x.value;dirty()})}
function field(l,k,v,t='text',opts=[]){l=trText(l);return `<label>${l}${t==='select'?`<select data-k="${k}"><option></option>${opts.map(o=>`<option ${o===v?'selected':''}>${o}</option>`).join('')}</select>`:`<input data-k="${k}" type="${t}" value="${String(v??'').replaceAll('"','&quot;')}">`}</label>`}const materials=['Tissus / Fabric','Papier / Paper','Cuir / Leather','Simili cuir / Faux leather','Synthétique / Synthetic','Bois / Wood','Plastique / Plastic','Métal / Metal','Autre / Other'];
function renderComponents(){components.innerHTML=d.components.map((c,i)=>`<article class="repeat component-card" data-i="${i}"><div class="repeat-head"><h3>${tr('component')} ${i+1}</h3><button class="remove">×</button></div><div class="component-final"><div class="component-left"><div class="component-param-grid"><div class="pair-col">${field(tr('name'),'name',c.name)}${field(tr('outerMaterial'),'outerMaterial',c.outerMaterial,'select',materials)}${field(tr('innerMaterial'),'innerMaterial',c.innerMaterial,'select',materials)}${field(tr('finish'),'finish',c.finish,'select',['Teinte / Shade','Vernis / Varnish','Laque / Lacquer','Brossé / Brushed','Poli / Polished','Autre / Other'])}${field(tr('varnish'),'varnish',c.varnish,'select',['Aucun / None','Extra-mat / Extra-matte','Mat / Matt','Satiné / Satin','Brillant / Gloss'])}${field(tr('groove'),'groove',c.groove,'select',['Oui / Yes','Non / No'])}</div><div class="pair-col">${field(tr('type'),'type',c.type,'select',['Extérieur / Exterior','Intérieur base / Inside base','Intérieur couvercle / Inside lid','Contre-boîte / Outerbox','Cartouche / Inlay','Coussin / Cushion','Ciel / Sky','Autre / Other'])}${field(tr('outerRef'),'outerRef',c.outerRef)}${field(tr('innerRef'),'innerRef',c.innerRef)}${field(tr('finishColor'),'finishColorRef',c.finishColorRef)}${field(tr('texture'),'texture',c.texture)}${field(tr('removable'),'removable',c.removable,'select',['Oui / Yes','Non / No'])}</div></div><label class="component-notes"><span>${tr('notes')}</span><textarea data-k="notes">${c.notes||''}</textarea></label></div><div class="component-media"><label class="file-button media-align"><span class="clip-icon">📎</span>${tr('componentImages')}<input class="component-files" data-component="${c.id}" type="file" accept="image/*" multiple></label><div class="mini-preview component-thumbs" data-preview-component="${c.id}"></div></div></div></article>`).join('');all('#components .repeat').forEach(card=>{let i=+card.dataset.i;card.oninput=e=>{if(e.target.dataset.k){d.components[i][e.target.dataset.k]=e.target.value;dirty()}};card.querySelector('.remove').onclick=()=>{let id=d.components[i].id;d.components.splice(i,1);if(!d.components.length)d.components.push(newComponent());d.markings=d.markings.filter(m=>m.componentId!==id);d.documents=d.documents.filter(x=>x.contextId!==id);renderComponents();renderMarkings();renderDocuments();dirty()}});all('.component-files').forEach(x=>x.onchange=e=>addFiles(e.target.files,'component',e.target.dataset.component));renderPreviews();
applyTranslations()}
function renderMarkings(){markings.innerHTML=d.markings.map((m,i)=>`<article class="repeat marking-card" data-i="${i}"><div class="repeat-head"><h3>${tr('marking')} ${i+1}</h3><button class="remove">×</button></div><div class="marking-final"><div class="marking-left"><div class="marking-param-grid"><div class="pair-col"><label>${tr('component')}<select data-k="componentId"><option></option>${d.components.map(c=>`<option value="${c.id}" ${c.id===m.componentId?'selected':''}>${c.name||c.type||tr('component')}</option>`).join('')}</select></label>${field(tr('precision'),'precision',m.precision)}${field(tr('color'),'color',m.color,'select',['Or jaune / Yellow gold','Or blanc / White gold','Or rose / Pink gold','Pantone','RAL','NCS','Autre / Other'])}${field(tr('horizontal'),'horizontal',m.horizontal,'select',['Centré / Centred','Depuis la gauche / From left','Depuis la droite / From right'])}${field(tr('horizontalOffset'),'offsetH',m.offsetH,'number')}</div><div class="pair-col">${field(tr('type'),'type',m.type,'select',['Marquage à chaud / Hot stamping','Sticker métal / Metal sticker','Impression UV / UV printing','Autre / Other'])}${field(tr('width'),'width',m.width,'number')}${field(tr('colorRef'),'colorRef',m.colorRef)}${field(tr('vertical'),'vertical',m.vertical,'select',['Centré / Centred','Depuis le bas / From bottom','Depuis le haut / From top'])}${field(tr('verticalOffset'),'offsetV',m.offsetV,'number')}</div></div><label class="marking-notes"><span>${tr('notes')}</span><textarea data-k="notes">${m.notes||''}</textarea></label></div><div class="marking-media"><label class="file-button media-align"><span class="clip-icon">📎</span>${tr('selectFiles')}<input class="mark-files" data-mark="${m.id}" type="file" multiple></label><div class="mini-preview marking-thumbs" data-preview-mark="${m.id}"></div></div></div></article>`).join('');all('#markings .repeat').forEach(card=>{let i=+card.dataset.i;card.oninput=e=>{if(e.target.dataset.k){d.markings[i][e.target.dataset.k]=e.target.value;dirty()}};card.querySelector('.remove').onclick=()=>{let id=d.markings[i].id;d.markings.splice(i,1);if(!d.markings.length)d.markings.push(newMarking());d.documents=d.documents.filter(x=>x.contextId!==id);renderMarkings();renderDocuments();dirty()}});all('.mark-files').forEach(x=>x.onchange=e=>addFiles(e.target.files,'marking',e.target.dataset.mark));renderPreviews();applyTranslations()}
async function addFiles(files,context,contextId,single=false){if(single)d.documents=d.documents.filter(x=>x.context!=='product');for(const f of files){let data=await fileToBase64(f);d.documents.push({id:crypto.randomUUID(),name:f.name,size:f.size,type:f.type||'application/octet-stream',context,contextId,data,modified:new Date().toISOString()})}renderPreviews();renderDocuments();dirty()}function fileToBase64(f){return new Promise((res,rej)=>{let r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)})}function previewHtml(doc){let image=doc.type.startsWith('image/')?`<img src="${doc.data}" alt="">`:'<div class="file-symbol">📎</div>';return `<div class="preview-item">${image}<small>${doc.name}</small><button class="remove-doc" data-doc="${doc.id}">×</button></div>`}function renderPreviews(){clientPreview.innerHTML=d.documents.filter(x=>x.context==='client').map(previewHtml).join('');productPreview.innerHTML=d.documents.filter(x=>x.context==='product').map(previewHtml).join('');outerboxPreview.innerHTML=d.documents.filter(x=>x.context==='outerbox').map(previewHtml).join('');all('[data-preview-component]').forEach(box=>box.innerHTML=d.documents.filter(x=>x.context==='component'&&x.contextId===box.dataset.previewComponent).map(previewHtml).join(''));all('[data-preview-mark]').forEach(box=>box.innerHTML=d.documents.filter(x=>x.context==='marking'&&x.contextId===box.dataset.previewMark).map(previewHtml).join(''));all('.remove-doc').forEach(b=>b.onclick=()=>removeDoc(b.dataset.doc))}function renderOuterboxConditional(){cavityDimensionsWrap.hidden=d.outerbox.leaflet!=='Oui / Yes';drawerDescriptionWrap.hidden=d.outerbox.drawer!=='Oui / Yes'}function removeDoc(id){d.documents=d.documents.filter(x=>x.id!==id);renderPreviews();renderDocuments();dirty()}
function renderDocuments(){let docs=docFilter==='all'?d.documents:d.documents.filter(x=>x.context===docFilter);const card=x=>`<article class="document-card">${x.type.startsWith('image/')?`<img src="${x.data}" alt="">`:'<div class="file-symbol">📎</div>'}<b>${x.name}</b><small>${contextLabel(x.context)} · ${formatSize(x.size)}</small><button class="remove-doc" data-doc="${x.id}">×</button></article>`;if(docFilter==='all'&&docs.length){const groups=['client','product','component','marking','outerbox','documents'];documentList.innerHTML=groups.map(g=>{let items=docs.filter(x=>x.context===g);return items.length?`<section class="document-group"><h3>${contextLabel(g)}</h3><div class="document-group-grid">${items.map(card).join('')}</div></section>`:''}).join('')}else documentList.innerHTML=docs.length?docs.map(card).join(''):'<div class="hint">Aucun document dans cette catégorie.</div>';all('#documentList .remove-doc').forEach(b=>b.onclick=()=>removeDoc(b.dataset.doc));docCount.textContent=d.documents.length+' fichier'+(d.documents.length>1?'s':'');docWeight.textContent=formatSize(d.documents.reduce((a,x)=>a+(x.size||0),0));let mods=d.documents.map(x=>x.modified).filter(Boolean).sort();docModified.textContent=mods.length?'Dernière modification : '+new Date(mods.at(-1)).toLocaleString(currentLang==='pt'?'pt-PT':currentLang==='en'?'en-GB':'fr-FR'):'Aucune modification'}
function contextLabel(c){return {client:'Client & Projet',product:'Produit',component:tr('components'),marking:tr('markings'),outerbox:tr('outerbox'),documents:'Documents'}[c]||c}function formatSize(n){return n>1048576?(n/1048576).toFixed(1)+' Mo':Math.round(n/1024)+' Ko'}
function renderSummary(){summary.innerHTML=`<h3>${d.client.sourceReference||'En attente référence source'}</h3><b>${d.client.company||'—'}</b><p>${d.client.productType||'Produit non défini'}</p><p>${d.components.length} composant(s) · ${d.markings.length} marquage(s) · ${d.documents.length} document(s)</p><p>Statut : ${d.validation.status||'Brouillon'}</p>`}
function textBytes(s){return new TextEncoder().encode(s)}function download(bytes,name,type){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([bytes],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}function importJson(e){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{d=JSON.parse(r.result);if(!d.components?.length)d.components=[newComponent()];if(!d.markings?.length)d.markings=[newMarking()];renderAll();show(0);adminDialog.close()}catch{alert('JSON invalide')}};r.readAsText(f)}
function pdfLines(){let L=[];let add=(t='')=>L.push(String(t));add('TECHNICAL SHEET');add('Reference Source: '+(d.client.sourceReference||''));add('Company: '+(d.client.company||''));add('Customer Contact: '+(d.client.contact||''));add('Customer Reference: '+(d.client.customerRef||''));add('Product Type: '+(d.client.productType||''));add('Usage: '+(d.client.use||''));add('');add('QUANTITIES');
                    for(const [k,l] of [['prototype','Prototype'],['bat','BAT'],['preseries','Preserie'],['series','Serie']])add(`${l}: ${d.quantities[k]?.quantity||''} pces | ${d.quantities[k]?.price||''} CHF`);add('');add('PRODUCT');add('Description: '+(d.product.description||''));add(`Dimensions: ${d.product.front||''} x ${d.product.side||''} x ${d.product.height||''} mm`);add('Structure: '+(d.product.structure||''));add('');add('COMPONENTS');d.components.forEach((c,i)=>add(`${i+1}. ${c.name||c.type||'Component'} | Outer: ${c.outerMaterial||''} ${c.outerRef||''} | Inner: ${c.innerMaterial||''} ${c.innerRef||''} | Finish: ${c.finish||''} ${c.finishColorRef||''} | Notes: ${c.notes||''}`));add('');add('MARKINGS');d.markings.forEach((m,i)=>add(`${i+1}. ${m.type||''} | ${m.color||''} ${m.colorRef||''} | H: ${m.horizontal||''} ${m.offsetH||''} mm | V: ${m.vertical||''} ${m.offsetV||''} mm | Notes: ${m.notes||''}`));add('');add('OUTERBOX');add(`Dimensions: ${d.outerbox.front||''} x ${d.outerbox.side||''} x ${d.outerbox.height||''} mm | Cardboard: ${d.outerbox.cardboard||''}`);add('Notes: '+(d.outerbox.notes||''));add('');add('DOCUMENTS');d.documents.forEach(x=>add(`- ${x.name} (${contextLabel(x.context)})`));add('');add('VALIDATION');add('Status: '+(d.validation.status||''));add('Prepared by: '+(d.validation.preparedBy||''));add('Comments: '+(d.validation.comments||''));return L}
function simplePDF(lines){const esc=s=>s.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/[^\x20-\x7E]/g,'?');let pages=[],per=45;for(let i=0;i<lines.length;i+=per)pages.push(lines.slice(i,i+per));let objs=[],pageIds=[];objs.push('<< /Type /Catalog /Pages 2 0 R >>');objs.push('');objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');pages.forEach((pg,pi)=>{let content='BT /F1 10 Tf 45 800 Td 14 TL '+pg.map((l,i)=>(i?'T* ':'')+'('+esc(l).slice(0,110)+') Tj').join(' ')+' ET';let contentId=objs.length+2,pageId=objs.length+1;pageIds.push(pageId);objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`);objs.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)});objs[1]=`<< /Type /Pages /Kids [${pageIds.map(x=>x+' 0 R').join(' ')}] /Count ${pageIds.length} >>`;let out='%PDF-1.4\n',offset=[0];objs.forEach((o,i)=>{offset.push(out.length);out+=`${i+1} 0 obj\n${o}\nendobj\n`});let xref=out.length;out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;for(let i=1;i<offset.length;i++)out+=String(offset[i]).padStart(10,'0')+' 00000 n \n';out+=`trailer << /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;return textBytes(out)}
/*function exportPDF(){if(!validRef())return;download(simplePDF(pdfLines()),safeName()+'.pdf','application/pdf')}*/
function waitForPdfLayout(){
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}

function waitForPdfImages(container){
    const images = Array.from(
        container.querySelectorAll('img')
    );

    return Promise.all(
        images.map(image => {
            if(image.complete){
                return Promise.resolve();
            }

            return new Promise(resolve => {
                image.addEventListener(
                    'load',
                    resolve,
                    {once:true}
                );

                image.addEventListener(
                    'error',
                    resolve,
                    {once:true}
                );
            });
        })
    );
}

function addCanvasPagesToPdf(pdf, canvas, firstPage){
    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();

    const margin = 4;

    const printableWidth =
        pageWidth - margin * 2;

    const printableHeight =
        pageHeight - margin * 2;

    const pixelsPerPdfMillimetre =
        canvas.width / printableWidth;

    const sliceHeightPixels =
        Math.floor(
            printableHeight *
            pixelsPerPdfMillimetre
        );

    let sourceY = 0;
    let isFirstSlice = true;

    while(sourceY < canvas.height){
        const remainingHeight =
            canvas.height - sourceY;

        const currentSliceHeight =
            Math.min(
                sliceHeightPixels,
                remainingHeight
            );

        const sliceCanvas =
            document.createElement('canvas');

        sliceCanvas.width = canvas.width;
        sliceCanvas.height = currentSliceHeight;

        const context =
            sliceCanvas.getContext('2d');

        context.fillStyle = '#f2f2ef';

        context.fillRect(
            0,
            0,
            sliceCanvas.width,
            sliceCanvas.height
        );

        context.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            currentSliceHeight,
            0,
            0,
            canvas.width,
            currentSliceHeight
        );

        if(!firstPage || !isFirstSlice){
            pdf.addPage('a4', 'landscape');
        }

        const imageData =
            sliceCanvas.toDataURL(
                'image/jpeg',
                0.95
            );

        const renderedHeight =
            currentSliceHeight /
            pixelsPerPdfMillimetre;

        pdf.addImage(
            imageData,
            'JPEG',
            margin,
            margin,
            printableWidth,
            renderedHeight,
            undefined,
            'FAST'
        );

        sourceY += currentSliceHeight;
        firstPage = false;
        isFirstSlice = false;
    }

    return firstPage;
}

async function exportPDF(){
    if(!validRef()) return;

    if(typeof html2canvas === 'undefined'){
        alert(
            'La bibliothèque html2canvas n’est pas chargée.'
        );

        return;
    }

    if(
        !window.jspdf ||
        !window.jspdf.jsPDF
    ){
        alert(
            'La bibliothèque jsPDF n’est pas chargée.'
        );

        return;
    }

    const originalStep = cur;
    const originalText = pdfBtn.textContent;

    pdfBtn.textContent = 'Création du PDF...';
    pdfBtn.disabled = true;

    document.body.classList.add(
        'pdf-exporting'
    );

    try{
        const jsPDF = window.jspdf.jsPDF;

        const pdf = new jsPDF({
            orientation:'landscape',
            unit:'mm',
            format:'a4',
            compress:true
        });

        let firstPage = true;

        for(
            let stepIndex = 0;
            stepIndex < steps.length;
            stepIndex++
        ){
            show(stepIndex);

            await waitForPdfLayout();

            const panel =
                document.querySelector(
                    '.panel.active'
                );

            if(!panel) continue;

            const previousHeight =
                panel.style.height;

            const previousMaxHeight =
                panel.style.maxHeight;

            const previousOverflow =
                panel.style.overflow;

            panel.style.height = 'auto';
            panel.style.maxHeight = 'none';
            panel.style.overflow = 'visible';

            await waitForPdfImages(panel);
            await waitForPdfLayout();

            const captureWidth =
                Math.ceil(panel.scrollWidth);

            const captureHeight =
                Math.ceil(panel.scrollHeight);

            const canvas =
                await html2canvas(panel, {
                    scale:2,
                    useCORS:true,
                    allowTaint:true,
                    backgroundColor:'#f2f2ef',
                    logging:false,
                    width:captureWidth,
                    height:captureHeight,
                    windowWidth:Math.max(
                        document.documentElement.clientWidth,
                        captureWidth
                    ),
                    windowHeight:Math.max(
                        document.documentElement.clientHeight,
                        captureHeight
                    ),
                    scrollX:0,
                    scrollY:0
                });

            panel.style.height =
                previousHeight;

            panel.style.maxHeight =
                previousMaxHeight;

            panel.style.overflow =
                previousOverflow;

            firstPage =
                addCanvasPagesToPdf(
                    pdf,
                    canvas,
                    firstPage
                );
        }

        pdf.save(
            safeName() +
            '-Fiche-Technique.pdf'
        );
    }catch(error){
        console.error(
            'Erreur pendant la création du PDF :',
            error
        );

        alert(
            'Le PDF n’a pas pu être créé. Consulte la console pour identifier l’erreur.'
        );
    }finally{
        document.body.classList.remove(
            'pdf-exporting'
        );

        show(originalStep);

        pdfBtn.textContent = originalText;
        pdfBtn.disabled = false;
    }
}
function b64Bytes(dataUrl){let b=atob(dataUrl.split(',')[1]||''),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}function crc32(u){let c=-1;for(let n of u){c^=n;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xEDB88320:0)}return(c^-1)>>>0}function dosTime(d=new Date()){return((d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1))&65535}function dosDate(d=new Date()){return(((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate())&65535}function makeZip(files){let locals=[],centrals=[],offset=0;for(const f of files){let name=textBytes(f.name),data=f.data,crc=crc32(data),h=new Uint8Array(30+name.length),v=new DataView(h.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(10,dosTime(),true);v.setUint16(12,dosDate(),true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);h.set(name,30);locals.push(h,data);let c=new Uint8Array(46+name.length),cv=new DataView(c.buffer);cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(12,dosTime(),true);cv.setUint16(14,dosDate(),true);cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);c.set(name,46);centrals.push(c);offset+=h.length+data.length}let centralSize=centrals.reduce((a,x)=>a+x.length,0),end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,centralSize,true);e.setUint32(16,offset,true);let total=locals.reduce((a,x)=>a+x.length,0)+centralSize+22,out=new Uint8Array(total),p=0;[...locals,...centrals,end].forEach(x=>{out.set(x,p);p+=x.length});return out}
function exportZIP(){if(!validRef())return;let files=[{name:safeName()+'.pdf',data:simplePDF(pdfLines())}];d.documents.forEach(doc=>files.push({name:(doc.type.startsWith('image/')?'Photos/':'Documents/')+doc.name,data:b64Bytes(doc.data)}));download(makeZip(files),safeName()+'.zip','application/zip')}

const DICT={
  fr:{
    quantityNotes:'Notes Quantités',
    clientProject:'Client & Projet',
    quantities:'Quantités',
    product:'Produit',
    components:'Composants',
    component:'Composant',
    markings:'Marquages',
    marking:'Marquage',
    outerbox:'Contre-boîte',
    documents:'Documents',
    validation:'Validation',
    newSheet:'Nouvelle fiche',
    reference:'Référence',
    waiting:'En attente référence source',
    required:'Une référence source est obligatoire avant tout enregistrement ou export.',
    save:'Enregistrer',
    savePdf:'Enregistrer PDF',
    saveZip:'Enregistrer ZIP',
    sourceRef:'Référence Source',
    company:'Maison / Company',
    sales:'Commercial',
    phone:'Téléphone',
    productType:'Type de produit',
    customerRef:'Référence client',
    customerContact:'Contact client',
    use:'Usage',
    selectFiles:'Sélection Fichiers',
    details:'Brief Client',
    productImages:'Image du produit',
    productDescription:'Descriptif du produit',
    structure:'Carcasse / Structure',
    front:'Devant',
    side:'Côté',
    height:'Hauteur',
    lidHeight:'Hauteur couvercle',
    weight:'Poids',
    hinges:'Charnières',
    opening:'Ouverture',
    fastening:'Fermeture',
    name:'Nom',
    outerMaterial:'Matière extérieure',
    innerMaterial:'Matière intérieure',
    finish:'Finition',
    varnish:'Vernis',
    groove:'Gorge périphérique',
    type:'Type',
    outerRef:'Réf matière extérieure',
    innerRef:'Réf matière intérieure',
    finishColor:'Référence finition / Couleur',
    texture:'Texture',
    removable:'Inlay amovible',
    notes:'Notes',
    componentImages:'Image du composant',
    precision:'Précision',
    color:'Couleur',
    horizontal:'Position horizontale',
    horizontalOffset:'Décalage horizontal (mm)',
    width:'Largeur (mm)',
    colorRef:'Référence couleur',
    vertical:'Position verticale',
    verticalOffset:'Décalage vertical (mm)',
    cardboard:'Épaisseur carton',
    dropFront:'Devant tombant',
    leaflet:'Cavité livret',
    cavityDimensions:'Dimension de la cavité (Long. × Larg. × Prof.)',
    drawer:'Tiroir',
    drawerDescription:'Description du tiroir',outerboxImages:'Image de la contre-boîte',addDocument:'Ajouter un document',all:'Tous',preparedBy:'Préparé par',comments:'Commentaires',status:'Statut',previous:'Précédent',next:'Suivant',
    prototype:'Prototype',
bat:'BAT',
preseries:'Présérie',
series:'Série',
seriesPriceBreakdown:'Ventilation prix Série',
quantity:'Quantité',
    seriesPriceBreakdown:'Ventilation prix Série',
price:'Prix'},
  
  en:{
    quantityNotes:'Quantity notes',clientProject:'Customer & Project',quantities:'Quantities',product:'Product',components:'Components',component:'Component',markings:'Markings',marking:'Marking',outerbox:'Outerbox',documents:'Documents',validation:'Validation',newSheet:'New sheet',reference:'Reference',waiting:'Awaiting source reference',required:'A source reference is required before saving or exporting.',save:'Save',savePdf:'Save PDF',saveZip:'Save ZIP',sourceRef:'Source Reference',company:'Company',sales:'Sales representative',phone:'Phone',productType:'Product type',customerRef:'Customer reference',customerContact:'Customer contact',use:'Use',selectFiles:'Select Files',details:'Client brief',productImages:'Product images',productDescription:'Product description',structure:'Structure',front:'Front',side:'Side',height:'Height',lidHeight:'Lid height',weight:'Weight',hinges:'Hinges',opening:'Opening',fastening:'Fastening',name:'Name',outerMaterial:'Outer material',innerMaterial:'Inner material',finish:'Finish',varnish:'Varnish',groove:'Peripheral groove',type:'Type',outerRef:'Outer material ref.',innerRef:'Inner material ref.',finishColor:'Finish / Color reference',texture:'Texture',removable:'Removable inlay',notes:'Notes',componentImages:'Component images',precision:'Details',color:'Color',horizontal:'Horizontal position',horizontalOffset:'Horizontal offset (mm)',width:'Width (mm)',colorRef:'Color reference',vertical:'Vertical position',verticalOffset:'Vertical offset (mm)',cardboard:'Cardboard thickness',dropFront:'Drop front',leaflet:'Leaflet cavity',cavityDimensions:'Cavity dimensions (L × W × D)',drawer:'Drawer',drawerDescription:'Drawer description',outerboxImages:'Outerbox images',addDocument:'Add document',all:'All',preparedBy:'Prepared by',comments:'Comments',status:'Status',previous:'Previous',next:'Next',
    prototype:'Prototype',
bat:'BAT',
preseries:'Pre-series',
series:'Series',
seriesPriceBreakdown:'Series price breakdown',
quantity:'Quantity',
    seriesPriceBreakdown:'Series price breakdown',
price:'Price'},
  
  pt:{
    quantityNotes:'Notas das quantidades',clientProject:'Cliente e Projeto',quantities:'Quantidades',product:'Produto',components:'Componentes',component:'Componente',markings:'Marcações',marking:'Marcação',outerbox:'Caixa exterior',documents:'Documentos',validation:'Validação',newSheet:'Nova ficha',reference:'Referência',waiting:'A aguardar referência de origem',required:'É necessária uma referência de origem antes de guardar ou exportar.',save:'Guardar',savePdf:'Guardar PDF',saveZip:'Guardar ZIP',sourceRef:'Referência de origem',company:'Empresa',sales:'Comercial',phone:'Telefone',productType:'Tipo de produto',customerRef:'Referência do cliente',customerContact:'Contacto do cliente',use:'Utilização',selectFiles:'Selecionar ficheiros',details:'Briefing do cliente',productImages:'Imagens do produto',productDescription:'Descrição do produto',structure:'Estrutura',front:'Frente',side:'Lado',height:'Altura',lidHeight:'Altura da tampa',weight:'Peso',hinges:'Dobradiças',opening:'Abertura',fastening:'Fecho',name:'Nome',outerMaterial:'Material exterior',innerMaterial:'Material interior',finish:'Acabamento',varnish:'Verniz',groove:'Ranhura periférica',type:'Tipo',outerRef:'Ref. material exterior',innerRef:'Ref. material interior',finishColor:'Referência acabamento / cor',texture:'Textura',removable:'Inlay removível',notes:'Notas',componentImages:'Imagens do componente',precision:'Detalhes',color:'Cor',horizontal:'Posição horizontal',horizontalOffset:'Deslocamento horizontal (mm)',width:'Largura (mm)',colorRef:'Referência da cor',vertical:'Posição vertical',verticalOffset:'Deslocamento vertical (mm)',cardboard:'Espessura do cartão',dropFront:'Frente rebatível',leaflet:'Cavidade para folheto',cavityDimensions:'Dimensões da cavidade (C × L × P)',drawer:'Gaveta',drawerDescription:'Descrição da gaveta',outerboxImages:'Imagens da caixa exterior',addDocument:'Adicionar documento',all:'Todos',preparedBy:'Preparado por',comments:'Comentários',status:'Estado',previous:'Anterior',next:'Seguinte',
    prototype:'Protótipo',
bat:'BAT',
preseries:'Pré-série',
series:'Série',
seriesPriceBreakdown:'Distribuição de preços da série',
quantity:'Quantidade',
    seriesPriceBreakdown:'Distribuição de preços da série',
price:'Preço'}};
      
let currentLang=localStorage.getItem('ftLang')||'fr';function tr(k){return DICT[currentLang]?.[k]||DICT.fr[k]||k}function trText(v){return v}
function setLanguage(lang){currentLang=lang;localStorage.setItem('ftLang',lang);document.documentElement.lang=lang;renderNav();renderQuantities();renderComponents();renderMarkings();renderDocuments();applyTranslations()}
function renderNav(){nav.innerHTML=steps.map((s,i)=>`<button data-i="${i}" class="${i===cur?'active':''}">${String(i+1).padStart(2,'0')} ${tr(s[0]==='client'?'clientProject':s[0])}</button>`).join('')}
function applyTranslations(){all('.lang').forEach(x=>x.classList.toggle('active',x.dataset.lang===currentLang));all('[data-i18n]').forEach(x=>x.textContent=tr(x.dataset.i18n));                       
newBtn.innerHTML='📄 Nouveau';document.querySelector('.ref small').textContent=tr('reference');if(!validRef())refText.textContent=tr('waiting');requiredMsg.textContent=tr('required');saveBtn.textContent='💾 '+tr('save');pdfBtn.textContent='📄 '+tr('savePdf');zipBtn.textContent='📦 '+tr('saveZip');prev.textContent=tr('previous');next.textContent=tr('next');document.querySelectorAll('.doc-filters button').forEach(b=>{const map={all:'all',client:'clientProject',product:'product',component:'components',marking:'markings',outerbox:'outerbox',documents:'documents'};b.textContent=tr(map[b.dataset.filter])})}
init();applyTranslations();

async function saveAsUser(){
    alert("SAVE AS");
}
