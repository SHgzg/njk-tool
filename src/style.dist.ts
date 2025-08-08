export const styleText = `<style>/* Components.css */
/* END-Components.css */
/* ContentTitle.css */
.collapsible-container {
--margin: 36px 0 20px;
width: 100%;
overflow: hidden;
margin: var(--margin);
}
.collapsible-input {
display: none;
}
.content-title:hover {
color: #409EFF;
}
.collapsible-label {
display: flex;
justify-content: space-between;
align-items: center;
cursor: pointer;
}
.collapsible-label:hover {
color: #409EFF;
}
.collapsible-input:checked~.collapsible-arrow {
transform: rotate(90deg);
}
.collapsible-content {
max-height: 0;
overflow: hidden;
transition: max-height 0.3s cubic-bezier(0, 1, 0, 1) 0.3s ease;
}
.collapsible-hover-content {
max-height: 0;
overflow: hidden;
transition: max-height 0.3s cubic-bezier(0, 1, 0, 1) 0.3s ease;
}
.collapsible-container:hover>.collapsible-hover-content {
max-height: 500px;
}
.collapsible-input:checked~.collapsible-content {
max-height: 500px;
/* 根据内容调整 */
}
.title-tag,
.title-tag-small {
align-items: center;
margin-left: 4px;
border-radius: 4px;
color: white;
background-color: #2196F3
}
.title-tag-titile-container{
display: flex;
align-items: center
}
.title-tag-small {
font-size: 10px;
padding: 2px 8px;
}
.title-tag {
font-size: 10px;
padding: 6px 10px;
}
/* END-ContentTitle.css */
/* Divider.css */
.divider-base {
border: none;
height: 1px;
background: #e0e0e0;
background-size: 100% 100%;
margin: 20px 0;
}
/* END-Divider.css */
/* TOC.css */
/* 基础样式 */
.article-toc {
position: fixed;
top: 50px;
right: 2rem;
max-height: calc(100vh - 4rem);
margin-left: 2rem;
font-size: 0.95rem;
}
/* 隐藏 checkbox */
.toc-toggle-checkbox {
position: absolute;
opacity: 0;
height: 0;
width: 0;
}
/* 切换按钮样式 */
.toc-toggle-label {
display: flex;
align-items: center;
background: #f8f9fa;
padding: 0.3rem 0.6rem;
border-radius: 4px;
cursor: pointer;
margin-bottom: 0.5rem;
}
.toc-icon {
font-size: 1.2rem;
margin-right: 0.3rem;
}
/* 目录导航 */
.toc-nav {
padding: 0.5rem;
background: white;
border-radius: 6px;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.toc-section {
margin-bottom: 0.8rem;
}
.toc-heading {
font-size: 1rem;
margin: 0 0 0.4rem 0;
padding-bottom: 0.2rem;
border-bottom: 1px solid #eee;
}
.toc-list {
list-style: none;
padding-left: 0.4rem;
margin: 0;
}
.toc-item {
margin: 0.2rem 0;
}
.toc-link {
display: block;
padding: 0.2rem 0.4rem;
color: #495057;
text-decoration: none;
border-radius: 3px;
transition: all 0.2s;
}
.toc-link:hover {
background: #f0f0f0;
color: #007bff;
}
/* 层级缩进 */
.toc-link[data-level="2"] {
padding-left: 0.8rem;
}
.toc-link[data-level="3"] {
padding-left: 1.6rem;
}
/* 激活状态 */
.toc-link.active {
background: #e7f5ff;
color: #0066cc;
font-weight: 500;
}
/* 折叠功能实现 */
.toc-toggle-checkbox:not(:checked) ~ .toc-nav {
display: none;
}
/* 响应式设计 */
@media (max-width: 768px) {
.article-toc {
margin-left: 1rem;
font-size: 0.9rem;
}
}
/* END-TOC.css */
/* Text.css */
/* END-Text.css */
/* Title.css */
.title-base {
text-align: center;
font-weight: bolder;
}
.njk-title-h1 {
position: relative;
padding: 0 0 4.8px;
}
.njk-title-h2 {
position: relative;
}
.njk-title-h3 {
position: relative;
margin-bottom: 10px;
}
/* .njk-title-h2::before,
.njk-title-h1::before {
display: none;
position: absolute;
content: "# ";
color: #007bff;
}
.njk-title-h1::before {
left: -26px;
}
.njk-title-h2::before {
left: -18px;
}
.njk-title-h1:hover::before,
.njk-title-h2:hover::before {
display: inline-block;
} */
/* END-Title.css */
/* Notice.css */
/* Notice */
.notice {
margin: 16px 0;
padding: 12px 16px;
margin-bottom: 1rem;
border-radius: 4px;
font-size: 14px;
line-height: 1.5rem;
}
.notice-title {
font-weight: bold;
margin-bottom: 4px;
}
/* 不同类型的通知样式 */
.notice-info {
background-color: #e8f4ff;
border-left: 4px solid #1890ff;
}
.notice-warning {
background-color: #fff7e6;
border-left: 4px solid #faad14;
}
.notice-success {
background-color: #f6ffed;
border-left: 4px solid #52c41a;
}
.notice-error {
background-color: #fff2f0;
border-left: 4px solid #f5222d;
}
/* END-Notice.css */
/* Table.css */
.my-daframe-default {
margin: 0 auto 20px;
border-collapse: collapse;
border: 2px solid black;
/* 合并边框 */
font-family: Arial, Helvetica, sans-serif;
font-size: 14px;
color: #444444;
}
.my-daframe-default a {
text-decoration: none !important;
color: #444444 !important;
font-family: Arial, Helvetica, sans-serif;
font-size: 14px;
}
.thead-light th {
white-space: nowrap;
background-color: #e0e3e8;
/* background-color: #f5f7fa; */
color: #333333;
font-weight: 600;
padding: 12px 16px;
text-align: left;
border-right: 1px solid rgba(19, 18, 18, 0.6);
border-bottom: 2px solid black;
font-size: 16px;
}
.my-daframe-default tr {
border-bottom: 1px solid black;
}
.my-daframe-default td {
border-right: 1px solid rgba(19, 18, 18, 0.6);
/* color: #333333; */
/* font-weight: 600; */
/* text-align: left; */
}
.default-row {
border: 1px solid #eee;
background-color: #fff;
}
.default-row:hover {
background-color: #f0f4f8;
color: rebeccapurple;
}
.default-cell {
padding: 10px 16px;
/* border: 1px solid #e1e4e8; */
font-weight: 400;
font-size: 14px;
color: #444;
background-color: transparent;
}
/* END-Table.css */
/* Block.css */
/* Block.njk */
.code-block {
--block-margin: 0px
margin: var(--block-margin) 0;
border-radius: 4px;
overflow: hidden;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.code-block pre {
margin: 0;
padding: 1rem;
background-color: #f5f5f5;
font-family: 'Courier New', monospace;
font-size: 14px;
line-height: 1.5;
white-space: pre-wrap;
}
.code-block code {
display: block;
overflow-x: auto;
}
/* END-Block.css */
/* Date.css */
.center-info-box {
margin-top: -20px;
margin-bottom: 20px;
text-align: center;
color: black;
}
/* END-Date.css */
/* Tab.css */
/* Tab 容器 */
.tab-container {
max-width: 600px;
margin: 0 auto;
}
/* 隐藏 Radio 按钮 */
.tab-radio {
display: none;
}
/* Tab 按钮样式 */
.tab-labels {
display: flex;
border-bottom: 1px solid #ccc;
}
.tab-label {
padding: 5px 10px;
cursor: pointer;
background-color: #f1f1f1;
border: 1px solid #ccc;
border-bottom: none;
margin-right: 2px;
border-radius: 5px 5px 0 0;
}
.tab-label:hover {
background-color: #ddd;
}
.tab-radio:checked+.tab-label {
background-color: #fff;
border-bottom: 1px solid #fff;
margin-bottom: -1px;
}
/* Tab 内容区域 */
.tab-content {
display: none;
padding: 20px;
border: 1px solid #ccc;
border-top: none;
}
/* END-Tab.css */
/* Base.css */
body {
margin: 0;
padding: 0;
font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
/* PC端样式 */
a {
text-decoration: none;
}
a:hover {
color: #409EFF;
}
.email-main-container {
margin: 0;
min-width: 1000px;
padding: 0 5rem;
}
:root {
--njk-title-color: black;
--njk-title-align: center;
--njk-title-position: relative;
--njk-title-margin: 36px 0 20px;
--njk-table-margin: 0 auto 20px;
}
/* END-Base.css */
</style>`