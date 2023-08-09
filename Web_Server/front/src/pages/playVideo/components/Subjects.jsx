import React from 'react'
import { SubjectsDivider, SubjectDisplay } from './Subjects.style'
function Subjects({currentTopic}) {
  return (
    <SubjectsDivider>
      <SubjectDisplay>
        {currentTopic}
      </SubjectDisplay>
    </SubjectsDivider>
  )
}

export default Subjects