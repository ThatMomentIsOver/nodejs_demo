var attend = {
  insert: 'INSERT INTO attend stu_id VALUE (?)',
  delete: 'DELETE FROM attend WHERE id=?',
  update: 'UPDATE attend SET weekA=?, weekB=?, weekC=?, weekD=?, weekE=?, weekF=?, weekG=?, weekH=?, weekI=?, weekJ=? WHERE stu_id=?' ,
	queryAttendById: 'SELECT * FROM attend WHERE stu_id=?',
	queryAllAttend: 'SELECT * FROM attend'
};

module.exports = attend;
