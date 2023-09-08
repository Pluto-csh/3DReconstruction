<template>
	<view>
		<uni-section class="list-box">
			<uni-search-bar @confirm="search" :focus="true" v-model="searchKeyword" @blur="blur" @input="input"
				@cancel="cancel" @clear="clear">
			</uni-search-bar>

			<view class="file-list" v-for="file in filteredFileList" :key="file.id" @click="gotoDisplay(file)">
				<uni-icons type="mail-open-filled" size="20"></uni-icons>
				{{ " " + file.name }}
			</view>

		</uni-section>

	</view>
</template>
  
<script>
import config from "../config"
const baseUrl = config.baseUrl;
import { getToken } from '@/utils/auth'
export default {
	data() {
		return {
			searchKeyword: '',
			fileList: [],
		}
	},
	onLoad() {
		this.getfileList();
	},
	computed: {
		filteredFileList() {
			if (!this.searchKeyword) {
				return this.fileList;
			}

			// 对文件列表进行模糊搜索过滤
			return this.fileList.filter(file => file.name.includes(this.searchKeyword));
		}
	},
	methods: {
		getfileList() {
			uni.request({
				url: `${baseUrl}/system/job/list`,
				method: 'GET',
				header: {
					"Authorization": 'Bearer ' + getToken(),
				},
				success: (res) => {
					console.log(res.data)
					const dataRows = res.data.rows;
					this.fileList = dataRows.map(item => ({
						id: item.id,
						name: item.name,
						// 添加其他属性或按需处理数据
					}));
				}
			})
		},
		gotoDisplay(file) {
			uni.navigateTo({
				url: `/pages/operate/index?id=${file.id}` // 跳转到/operate/index.vue并传递文件id
			});
		},

	}
}
</script>
  
<style lang="scss">
.list-box {
	margin-top: -15px;

}

.file-list {
	padding-top: 10px;
	padding-bottom: 20px;
	text-align: center;
}
</style>