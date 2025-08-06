export const templateText = `<!-- Head.njk -->
{% macro use_head(ctx) %}
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{{ ctx.title }}</title>
{% if ctx.jsFiles%}
{% for css in ctx.cssFiles %}
<link rel="stylesheet" href="{{ css }}" />
{% endfor %}
{% endif %}
</head>
{% if ctx.jsFiles%}
{% for js in ctx.jsFiles %}
<script src="{{ js }}"></script>
{% endfor %}
{% endif %}
{% endmacro %}
<!-- /Head.njk -->
<!-- TOC.njk -->
{% macro use_toc(ctx) %}
<div class="article-toc">
<input type="checkbox" id="toc-toggle" class="toc-toggle-checkbox">
<label for="toc-toggle" class="toc-toggle-label">
<span class="toc-icon">≡</span>
<span class="toc-text">目录</span>
</label>
<nav class="toc-nav">
{% for section in ctx.data %}
<section class="toc-section">
{% if section.link %}
<h3 class="toc-heading">
<a href="{{ section.link }}" class="toc-link">{{ section.text }}</a>
</h3>
{% else%}
<h3 class="toc-heading">{{ section.text }}</h3>
{% endif %}
<ul class="toc-list">
{% for item in section.items %}
<li class="toc-item">
<a href="{{ item.link }}" class="toc-link" data-level="{{ loop.depth }}">
{% if loop.depth > 1 %}•{% endif %}
{{ item.text }}
</a>
</li>
{% endfor %}
</ul>
</section>
{% endfor %}
</nav>
</div>
{% endmacro %}
<!-- /TOC.njk -->
<!-- Divider.njk -->
{% macro use_divider(ctx) %}
<hr class="divider-base">
{% endmacro %}
<!-- /Divider.njk -->
<!-- Tag.njk -->
{% macro use_tag(ctx) %}
{% set tagClass = "smart-tag" %}
{% set defaultColor = "#4CAF50" %}
{% set defaultSize = "medium" %}
{% set finalColor = defaultColor %}
{% set finalSize = defaultSize %}
<span class="{{ tagClass }} {{ finalSize }}" style="background-color: {{ finalColor }};">
{{ ctx.text }}
</span>
<style>
.smart-tag {
display: inline-flex;
align-items: center;
padding: 4px 12px;
border-radius: 4px;
font-family: Arial, sans-serif;
color: white;
white-space: nowrap;
transition: all 0.3s ease;
}
/* 尺寸控制 */
.smart-tag.small {
font-size: 12px;
padding: 2px 8px;
}
.smart-tag.medium {
font-size: 14px;
padding: 4px 12px;
}
.smart-tag.large {
font-size: 16px;
padding: 6px 16px;
}
/* 颜色扩展支持 */
.smart-tag.blue { background-color: #2196F3 !important; }
.smart-tag.red { background-color: #f44336 !important; }
.smart-tag.green { background-color: #4CAF50 !important; }
</style>
{% endmacro %}
<!-- /Tag.njk -->
<!-- Title.njk -->
{% macro title_default(ctx) %}
<h1 style="text-align: center">{{ ctx.text }}</h1>
{% endmacro %}
{% macro title_h1(ctx) %}
<h1 class="njk-title-h1" id="{{ ctx.text }}" style="{{ ctx.style }}">
{{ ctx.text }}
</h1>
{% endmacro %}
{% macro title_h2(ctx) %}
<h2 class="njk-title-h2" id="{{ ctx.text }}" class="" style="{{ ctx.style }}">
{{ ctx.text }}
</h2>
{% endmacro %}
{% macro title_h3(ctx) %}
<h3 class="njk-title-h3" id="{{ ctx.text }}" class="" style="{{ ctx.style }}">
{{ ctx.text }}
</h3>
{% endmacro %}
{% macro title_table_default(ctx) %}
<h3 class="njk-title-h3" id="{{ ctx.text }}" class="title_table_default" style="{{ ctx.style }}">
{{ ctx.text }}
</h3>
{% endmacro %}
{% macro use_title(ctx) %}
{% if ctx.type == "h1" %}
{{ title_h1(ctx) }}
{{ title_h1(ctx) }}
{% elif ctx.type == "h2" %}
{{ title_h2(ctx) }}
{% elif ctx.type == "h3" %}
{{ title_h3(ctx) }}
{% else %}
{{ title_default(ctx) }}
{% endif %}
{% endmacro %}
<!-- /Title.njk -->
<!-- Notice.njk -->
{% macro use_notice(ctx) %}
{% if ctx.type %}
{% set type = ctx.type %}
{% else %}
{% set type = "info" %}
{% endif %}
<div class="notice notice-{{ type }}">
<div class="notice-title">{{ type|capitalize }}:</div>
<pre class="notice-content">{{ ctx.text }}</pre>
</div>
{% endmacro %}
<!-- /Notice.njk -->
<!-- Block.njk -->
{% macro use_block(ctx) %}
<div class="code-block">
<pre><code>{{ ctx.text }}</code></pre>
</div>
{% endmacro %}
<!-- /Block.njk -->
<!-- Date.njk -->
{% macro use_date(ctx) %}
<div class="center-info-box"><span style="font-weight:bolder;color:#606266;">Date：</span>{{ ctx.text}}</div>
{% endmacro %}
{% macro use_checker(ctx) %}
<div class="center-info-box"><span style="font-weight:bolder;color:#606266;">Checker：</span>{{ ctx.text}}</div>
{% endmacro %}
<!-- /Date.njk -->
<!-- Table.njk -->
{% macro td_default(ctx) %}
{% if ctx.text %}
{% set text = ctx.text %}
{% else %}
{% set text = ctx %}
{% endif %}
<td class="default-cell">{{ text | replace("false", "❌") | replace("true", "✔️") }}</td>
{% endmacro %}
{% macro table_default(ctx) %}
{% if ctx.columns %}
{% set columns = ctx.columns %}
{% elif ctx.th %}
{% set columns = ctx.th %}
{% else %}
{% set columns = [] %}
{% endif %}
{% if ctx.data %}
{% set data = ctx.data %}
{% elif ctx.tbody %}
{% set data = ctx.tbody %}
{% endif %}
{% if ctx.title %}
{% set title = {text:ctx.title} %}
{{ title_h2(title) }}
{% endif %}
<table class="my-daframe-default">
<thead class="thead-light">
<tr>
{% for column in columns %}
<th>{{ column }}</th>
{% endfor %}
</tr>
</thead>
<tbody>
{% for row in data %}
<tr class="default-row">
{% if ctx.data %}
{% for column in columns %}
{{ td_default(row[column]) }}
{% endfor %}
{% else %}
{% for value in row %}
{{ td_default(value) }}
{% endfor %}
{% endif %}
</tr>
{% endfor %}
</tbody>
</table>
{% endmacro %}
{% macro use_table(ctx) %}
{% if ctx.type == "h1" %}
{{ title_h1(ctx) }}
{% else %}
{{ table_default(ctx) }}
{% endif %}
{% endmacro %}
<!-- /Table.njk -->
<!-- Tab.njk -->
{% macro useTab(tabs) %}
<style>
/* 显示选中的 Tab 内容 */
{% for tab in tabs %}
#{{tab.id}}:checked~#{{tab.content_id}} {
display: block;
}
{% endfor %}
</style>
<div class="tab-container">
{% for tab in tabs %}
<!-- Radio 按钮（隐藏） -->
<input {% if loop.first %} checked {% endif %} type="radio" name="tabs" id="{{ tab.id }}" class="tab-radio">
{% endfor %}
<!-- Tab 按钮（用 label 包裹） -->
<div class="tab-labels">
{% for tab in tabs %}
<label for="{{ tab.id }}" class="tab-label">{{ tab.title }}
</label>
{% endfor %}
</div>
<!-- Tab 内容 -->
{% for tab in tabs %}
<div id="{{ tab.content_id }}" class="tab-content">
{{ tab.content }}
</div>
{% endfor %}
</div>
{% endmacro %}
<!-- /Tab.njk -->
<!-- ContentTitle.njk -->
{% macro h3_handler(ctx) %}
<div class="title-tag-titile-container">
{% if ctx.h3 %}
<h3 style="margin: 0;" class="content-title">{{ ctx.title }}</h3>
{% else %}
<h2 style="margin: 0;" class="content-title">{{ ctx.title }}</h3>
{% endif %}
<span class="title-tag-small">注释</span>
</div>
{% endmacro %}
{% macro content_title_click(ctx) %}
<div class="collapsible-container">
<input type="checkbox" id="{{ ctx.title }}" class="collapsible-input" hidden>
<label for="{{ ctx.title }}" class="collapsible-label">
{{ h3_handler(ctx) }}
</label>
<div class="collapsible-content">
{{ use_block(ctx) }}
</div>
</div>
{% endmacro %}
{% macro content_title_hover(ctx) %}
<div class="collapsible-container">
<div class="collapsible-label">
{{ h3_handler(ctx) }}
</div>
<div class="collapsible-hover-content">
{{ use_block(ctx) }}
</div>
</div>
{% endmacro %}
{% macro content_title_remain(ctx) %}
<div class="collapsible-container">
{{ h3_handler(ctx) }}
<div>
{{ use_block(ctx) }}
</div>
</div>
{% endmacro %}
{% macro pick_content_title(ctx) %}
{% if ctx.hover %}
{{ content_title_hover(ctx) }}
{% elif ctx.remain %}
{{ content_title_remain(ctx) }}
{% else %}
{{ content_title_click(ctx) }}
{% endif %}
{% endmacro %}
{% macro use_content_title(ctx) %}
{% if ctx.type == "h3" or ctx.type == "hover_h3" or ctx.type == "remain_h3" %}
{% set h3 = true %}
{% endif %}
{% if ctx.type == "hover_h3" or ctx.type == "hover" %}
{% set hover = true %}
{% endif %}
{% if ctx.type == "remain_h3" or ctx.type == "remain" %}
{% set remain = true %}
{% endif %}
{% set param = {title:ctx.title, text:ctx.text, h3:h3, hover:hover, remain:remain} %}
{{ pick_content_title(param) }}
{% endmacro %}
<!-- /ContentTitle.njk -->
<!-- Component.njk -->
{% macro pick_component(ctx) %}
{% if ctx.tag == "head" %}
{{ use_head(ctx) }}
{% elif ctx.tag == "text" %}
{{ use_text(ctx) }}
{% elif ctx.tag == "title" %}
{{ use_title(ctx) }}
{% elif ctx.tag == "table" %}
{{ use_table(ctx) }}
{% elif ctx.tag == "toc" %}
{{ use_toc(ctx) }}
{% elif ctx.tag == "notice" %}
{{ use_notice(ctx) }}
{% elif ctx.tag == "block" %}
{{ use_block(ctx) }}
{% elif ctx.tag == "date" %}
{{ use_date(ctx) }}
{% elif ctx.tag == "checker" %}
{{ use_checker(ctx) }}
{% elif ctx.tag == "divider" %}
{{ use_divider(ctx) }}
{% elif ctx.tag == "tag" %}
{{ use_tag(ctx) }}
{% elif ctx.tag == "title_content" %}
{{ use_content_title(ctx) }}
{% else %}
{{ title_default(ctx) }}
{% endif %}
{% endmacro %}
{% macro use_component(ctx) %}
{% if ctx.tag %}
{{ pick_component(ctx) }}
{% else %}
{% for i in ctx %}
{{ pick_component(i) }}
{% endfor %}
{% endif %}
{% endmacro %}
<body style="margin: 0; padding: 0;overflow: auto;">
<div class="email-main-container" style="margin: 0 auto; padding: 0 3rem;box-sizing: border-box;width:2000px;">
{{ use_component(ctx) }}
</div>
</body>
<!-- /Component.njk -->
<!-- Text.njk -->
{% macro text_default(ctx) %}
{{ ctx.text | replace("false", "❌") | replace("true", "✔️") }}
{% endmacro %}
{% macro bool_text(ctx) %}
{{ ctx.text | replace("false", "❌") | replace("true", "✔️") }}
{% endmacro %}
{% macro use_text(ctx) %}
{% if ctx.type == "h1" %}
{{ title_h1(ctx) }}
{% else %}
{{ text_default(ctx) }}
{% endif %}
{% endmacro %}
<!-- /Text.njk -->
`