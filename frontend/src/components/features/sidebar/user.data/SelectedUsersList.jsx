import UserSimpleInfo from './UserSimpleInfo';

const SelectedUsersList = ({ selectedUsers, handleDelete, adminName, style }) => {
  return (
    <ul className={`flex items-center ${style ? style : 'justify-center'} gap-2 flex-wrap`}>
      {' '}
      {selectedUsers?.length > 0 &&
        selectedUsers.map((user) => (
          <li
            key={user._id}
            className='min-w-[12rem] w-fit bg-primary hover:bg-green text-slate-800 rounded-lg shadow-md transition-all duration-200 ease-out'
          >
            {' '}
            <UserSimpleInfo
              user={user}
              adminName={adminName}
              handleGroup={() => handleDelete(user._id)}
              close={true}
            />
          </li>
        ))}
    </ul>
  );
};

export default SelectedUsersList;
