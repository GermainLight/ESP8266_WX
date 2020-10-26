module.exports = {
	L1: {
		MARK: {
			VAL: 0xBA,
			IDX: 0,
			LEN: 1
		},
		HAS_NEXT_PKT_MARK: {
			MASK: 0x40,
			IDX: 1,
			LEN: 1
		},
		HAS_ERR: {
			MASK: 0x20,
			IDX: 1,
			LEN: 1
		},
		IS_RSP: {
			MASK: 0x10,
			IDX: 1,
			LEN: 1
		},
		VER_MASK: {
			MASK: 0x0F,
			IDX: 1,
			LEN: 1,
			VAL:0
		},
		LEN: {
			IDX: 2,
			LEN: 2
		},
		CRC: {
			IDX: 4,
			LEN: 2
		},
		SEQ: {
			IDX: 6,
			LEN: 2
		},
		PKG_LEN: 8
	},
	L2: {
		CMD: {
			IDX: 8,
			LEN: 1
		},
		VER: {
			VAL: 0,
			IDX: 9,
			LEN: 1
		},
		KEY: {
			IDX: 10,
			LEN: 1
		},
		LEN: {
			IDX: 11,
			LEN: 2
		},
		VALUE: {
			IDX: 13,
		},
		MIN_LEN: 5
	},
	MIN_LEN: 13
}