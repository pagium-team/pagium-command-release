/**
 * 生成动态随机id
 *
 * @method uuid
 */
module.exports = function() {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = [], i;
	radix = chars.length;
	var r;
	for (i = 0; i < 18; i++) {
		if (!uuid[i]) {
			r = 0 | Math.random()*16;
			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
		}
	}
	return uuid.join('');
}