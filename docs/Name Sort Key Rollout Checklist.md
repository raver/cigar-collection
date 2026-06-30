

## Plan: Name Sort Key Rollout Checklist



目标是按你确认的方案1稳定支持中英文烟标名排序：
中文走 pinyin-pro，英文走标准化；并加上空 key 兜底与稳定二级排序，保证分页不抖动。

**Steps**
1. Phase A - 规则收口  
定义 buildCigarNameSortKey 规则：含中文走 pinyin-pro；不含中文走英文标准化。  
加入空 key 兜底：结果为空时统一用 cigar-unknown。
2. Phase B - 写入链路一致  
创建烟标时写入 nameSortKey，改名时重算 nameSortKey。  
批量回填接口仅更新变化记录，并返回 updatedCount。
3. Phase C - 查询与分页一致  
Admin 列表统一按 name_sort_key ASC, id ASC。  
分页时先排序再分页，后续可从 offset 升级 keyset。
4. Phase D - 测试与回归  
单测覆盖中文、英文、空白、符号输入。  
API 测试覆盖鉴权、回填结果、顺序稳定。  
联调验证字段/索引存在，按钮触发后顺序和提示正确。

**Relevant files**
- cigar-sort.ts
- admin.ts
- schema.ts
- 0001_name_sort_key.sql
- cigar-sort.test.ts
- admin-api.test.ts
- +page.svelte

**Verification**
1. 在 API 目录运行 vitest 定向测试（排序键 + admin API）。
2. 在 API 目录运行构建，确认 TS 编译通过。
3. 在 Web 目录运行构建，确认页面编译通过。
4. 在数据库内确认迁移记录、name_sort_key 字段和索引都存在。
5. 在 admin 页面点击“按名称排序全部烟标”，验证排序与提示文案。

**Decisions**
- 采用方案1，不做中英文混合 token 分段处理。
- 空 key 统一兜底为 cigar-unknown。
- 稳定排序统一为 name_sort_key + id。


**方案1的具体内容**

方案草案（方案1 + 两个小决策）
目标：保持实现简单稳定，优先满足你当前项目场景（中文为主，英文也能自然排）。

1. 核心策略
只要名称里包含中文字符，就走中文分支（pinyin-pro）。
不包含中文字符时，走英文/拉丁分支（纯标准化）。
最终排序统一按 name_sort_key 升序，再按 id 升序。
2. buildCigarNameSortKey 规则草案
输入预处理
去掉首尾空白；如果结果为空，返回空字符串（后面由兜底逻辑处理）。

中文分支（方案1）
触发条件：名称中出现任意 CJK 字符。
处理流程：

用 pinyin-pro 转成数组，toneType = none。

每段转小写。

非字母数字字符替换为 -。

多个 - 合并为一个。

去掉首尾 -。

得到 name_sort_key。

非中文分支（英文、数字等）
处理流程：

全部转小写。

连续空白替换为 -。

仅保留 a-z、0-9、-。

多个 - 合并为一个。

去掉首尾 -。

得到 name_sort_key。

3. 两个实用小决策（落地版）
兜底 key（防空）
当 name_sort_key 为空时，用固定兜底前缀，例如 cigar-unknown。
说明：创建时 slug 仍可用 nanoid 保证唯一；排序时不要让空 key 漂在不可控位置。

稳定二级排序
所有按名称排序场景统一使用：

order by name_sort_key asc

order by id asc
这样同名、同 key 的记录在分页下也不会抖动。

4. 预期样例
阿诗玛 -> a-shi-ma
红双喜 -> hong-shuang-xi
hope -> hope
Hilton -> hilton
Camel Blue -> camel-blue
!!! -> cigar-unknown（命中兜底）
5. 查询与分页草案
列表查询：按 name_sort_key, id 排序。
分页查询：先排序再 limit/offset。
批量回填接口：仅更新 key 为空或计算结果变化的记录，返回 updatedCount。