import React from 'react';
import { RecoilRoot } from 'recoil';
import { recoilTestState } from '../../shared/helpers/testing/recoilTestState';
import { useMockBranches } from '../../../.storybook/__mocks__/branchesPromise';
import { fromPartial } from '../../shared/helpers/testing/fromPartial';
import { DarkModeRoot } from '../../shared/testing/DarkModeRoot';
import { branchOptionState } from './branchOptionState';
import type { Branch } from './types';
import { BranchSelect } from './BranchSelect';

export default {
    component: BranchSelect
};

type TemplateProps = {
    branches: ReadonlyArray<Branch>;
    branch?: Branch;
};
const Template: React.FC<TemplateProps> = ({ branches, branch }) => {
    useMockBranches(branches);
    return <header>
        <RecoilRoot initializeState={recoilTestState([branchOptionState, branch ?? null])}>
            <BranchSelect />
        </RecoilRoot>
    </header>;
};

const DETAILED_BRANCHES = fromPartial<ReadonlyArray<Branch>>([
    {
        id: 'core-x64',
        displayName: 'x64',
        group: 'Platforms',
        kind: 'platform'
    },
    {
        id: 'netfx-64',
        displayName: '.NET Framework (x64)',
        group: 'Platforms',
        kind: 'platform'
    },
    {
        id: 'features-function-pointers',
        displayName: 'C# 9: Function pointers',
        group: 'Roslyn branches',
        kind: 'roslyn'
    }
]);

export const DefaultOnly = () => <Template branches={[]} />;
export const SpecificBranch = () => <Template branch={DETAILED_BRANCHES[0]} branches={DETAILED_BRANCHES} />;
export const DarkMode = () => <DarkModeRoot><DefaultOnly /></DarkModeRoot>;