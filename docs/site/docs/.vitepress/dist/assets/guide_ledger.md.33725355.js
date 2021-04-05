import{l as n,f as s,G as a}from"./framework.36319fc6.js";const t='{"title":"Ledger","description":"","frontmatter":{},"headers":[{"level":2,"title":"Document Tree","slug":"document-tree"},{"level":3,"title":"Example Tree","slug":"example-tree"}],"relativePath":"guide/ledger.md","lastUpdated":1611443862000}',p={},o=a('<h1 id="ledger"><a class="header-anchor" href="#ledger" aria-hidden="true">#</a> Ledger</h1><h2 id="document-tree"><a class="header-anchor" href="#document-tree" aria-hidden="true">#</a> Document Tree</h2><p>At its heart, Concords is a Merkle Tree. The data structure behind Git and blockchains such as Bitcoin and Etherum.</p><h3 id="example-tree"><a class="header-anchor" href="#example-tree" aria-hidden="true">#</a> Example Tree</h3><div class="language-JSON"><pre><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;difficulty&quot;</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;pending_transactions&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;chain&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      <span class="token property">&quot;transactions&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">&quot;action&quot;</span><span class="token operator">:</span> <span class="token string">&quot;create&quot;</span><span class="token punctuation">,</span>\n          <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;document&quot;</span><span class="token punctuation">,</span>\n          <span class="token property">&quot;data&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n            <span class="token property">&quot;timestamp&quot;</span><span class="token operator">:</span> <span class="token number">1611439499277</span><span class="token punctuation">,</span>\n            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;f8f4aab275bd513ab6a99752dc3ac592b58e8ecb91a0f89fd8f354d41ea0dd2b&quot;</span>\n          <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          <span class="token property">&quot;signature&quot;</span><span class="token operator">:</span> <span class="token string">&quot;zAW6bKSFukZ2FKgvLCIKmtpdpIIBqlaZNWtiKOg/6Q4+YA8tmSKRg5QqxWBjbbED+Tbju9XcGyEJ7wSoPOtr/k8iBzDokqnqHPU5GeokXt/9yViRWPg1ZSRKYSn2dAS9&quot;</span><span class="token punctuation">,</span>\n          <span class="token property">&quot;user&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n            <span class="token property">&quot;x&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0EV-1cAHZYaxI4o_XqZ4Os4Agpul6UUqmAdC1r5AZJyJkaEz26_S4YDeqr1n8lPi&quot;</span><span class="token punctuation">,</span>\n            <span class="token property">&quot;y&quot;</span><span class="token operator">:</span> <span class="token string">&quot;HA4Blwp8iTSl5uzbT6JjsC60tAbI33XXuF_-POOYLS2_ksKmellLZc_Vaww4uj4l&quot;</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token property">&quot;timestamp&quot;</span><span class="token operator">:</span> <span class="token number">1611439499284</span><span class="token punctuation">,</span>\n      <span class="token property">&quot;previous_hash&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>\n      <span class="token property">&quot;hash&quot;</span><span class="token operator">:</span> <span class="token string">&quot;e82ca7214e7202fb5be54cc28cb9b9cfa71286dec82d9dbcc56ad6b5daf0&quot;</span><span class="token punctuation">,</span>\n      <span class="token property">&quot;nonce&quot;</span><span class="token operator">:</span> <span class="token number">0</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      <span class="token property">&quot;transactions&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;todos&quot;</span><span class="token punctuation">,</span>\n          <span class="token property">&quot;action&quot;</span><span class="token operator">:</span> <span class="token string">&quot;create&quot;</span><span class="token punctuation">,</span>\n          <span class="token property">&quot;data&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n            <span class="token property">&quot;text&quot;</span><span class="token operator">:</span> <span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span>\n            <span class="token property">&quot;created_at&quot;</span><span class="token operator">:</span> <span class="token number">1611439506216</span><span class="token punctuation">,</span>\n            <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;9a8937be48c93f6a521cdaa4a3f2734c2b1a21385533d9e64cddd3c4e318e7b&quot;</span><span class="token punctuation">,</span>\n            <span class="token property">&quot;timestamp&quot;</span><span class="token operator">:</span> <span class="token number">1611439506216</span>\n          <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          <span class="token property">&quot;user&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n            <span class="token property">&quot;x&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0EV-1cAHZYaxI4o_XqZ4Os4Agpul6UUqmAdC1r5AZJyJkaEz26_S4YDeqr1n8lPi&quot;</span><span class="token punctuation">,</span>\n            <span class="token property">&quot;y&quot;</span><span class="token operator">:</span> <span class="token string">&quot;HA4Blwp8iTSl5uzbT6JjsC60tAbI33XXuF_-POOYLS2_ksKmellLZc_Vaww4uj4l&quot;</span>\n          <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          <span class="token property">&quot;signature&quot;</span><span class="token operator">:</span> <span class="token string">&quot;voAWjveBQtuyqjWYOrunBoqoijfQ/U+Gs7ulXhh4MhxJcdRmu43OAgXqk4fKurl03Iphn4YsN/oTp6ofDCIewEJcouATDFq6boXyV3oMidQJRmJvJkIoaw2Ut0cKMZGG&quot;</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token property">&quot;timestamp&quot;</span><span class="token operator">:</span> <span class="token number">1611439509877</span><span class="token punctuation">,</span>\n      <span class="token property">&quot;previous_hash&quot;</span><span class="token operator">:</span> <span class="token string">&quot;e82ca7214e7202fb5be54cc28cb9b9cfa71286dec82d9dbcc56ad6b5daf0&quot;</span><span class="token punctuation">,</span>\n      <span class="token property">&quot;hash&quot;</span><span class="token operator">:</span> <span class="token string">&quot;02bd55b2a423b76c23f79f262a7b656fb5ff9664d428ef9851ef339302736&quot;</span><span class="token punctuation">,</span>\n      <span class="token property">&quot;nonce&quot;</span><span class="token operator">:</span> <span class="token number">420</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;e82ca7214e7202fb5be54cc28cb9b9cfa71286dec82d9dbcc56ad6b5daf0&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre></div>',5);p.render=function(a,t,p,e,c,u){return n(),s("div",null,[o])};export default p;export{t as __pageData};