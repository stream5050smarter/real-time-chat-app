import Icon from './Icon';

const AvatarGroup = ({ avatars, id, isCount, isAdmin, style, onClick }) => {
  return (
    <ul className={`avatar-group p-2 ${style ? style : ''}`}>
      {isCount
        ? avatars.slice(0, 3).map((avatar, idx) => (
            <li key={id + `_${idx}`} className='avatar'>
              <div className='w-8 h-8 rounded-full'>
                <img src={avatar} className='w-full h-full rounded-full' />
              </div>
            </li>
          ))
        : avatars.map((avatar, idx) => (
            <li key={id + `_${idx}`} className='relative'>
              <div className='avatar'>
                {' '}
                <div className='w-8 h-8 rounded-full'>
                  <img src={avatar} className='w-full h-full rounded-full' />
                </div>
              </div>

              {isAdmin && (
                <button
                  type='button'
                  className='absolute top-0 right-0 transform translate-x-[6%] translate-y-[15%] w-3 h-3 rounded-full border-none cursor-pointer bg-primary transition duration-200 ease-in-out'
                  onClick={onClick}
                >
                  <Icon
                    src='#icon-remove'
                    style='w-3 h-3 fill-slate-700 transition duration-200 ease-in-out'
                  />
                </button>
              )}
            </li>
          ))}
      {avatars.length > 3 && isCount && (
        <div className='avatar placeholder'>
          <div className='w-8 h-8 rounded-full bg-green text-slate-800 text-xs'>
            <span>+{Number(avatars.length - 3)}</span>
          </div>
        </div>
      )}
    </ul>
  );
};

export default AvatarGroup;
