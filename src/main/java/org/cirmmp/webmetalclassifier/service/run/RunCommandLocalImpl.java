package org.cirmmp.webmetalclassifier.service.run;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.tomcat.util.http.fileupload.IOUtils;

import org.cirmmp.webmetalclassifier.model.Job;
import org.cirmmp.webmetalclassifier.model.OutRunCommnad;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class RunCommandLocalImpl implements RunCommandLocal{

    Logger logger = LoggerFactory.getLogger(RunCommandLocalImpl.class);

    @Value("${naccess.bin}")
    private String naccess;
    @Value("${dssp.bin}")
    private String dssp;



    @Autowired
    ResourceLoader resourceLoader;

    @Autowired
    private RunCommand runCommand;

    @Override
    public OutRunCommnad runjob(Job job) throws Exception {

        String generatedString = RandomStringUtils.randomAlphanumeric(10);

        logger.info("Sono in runcommandlocal");
        logger.info(job.getDirectory());
        File folder = new File(job.getDirectory());
        if (!folder.exists()) {
            folder.mkdir();
        }
        Resource secstruct = resourceLoader.getResource("classpath:config/SecStruct.py");
        try (InputStream inputStream = secstruct.getInputStream()) {
            Files.copy(inputStream,Paths.get(job.getDirectory()+"/SecStruct.py"), StandardCopyOption.REPLACE_EXISTING);
            IOUtils.closeQuietly(inputStream);
        }
        List<String> execFile = Arrays.asList(
                "#!/bin/bash"
                ,naccess + " " + generatedString + ".pdb"
                ,"cat "  + generatedString + ".rsa"
                ,"echo 'CRYST1    1.000    1.000    1.000  90.00  90.00  90.00 P 1           1 ' > " + generatedString
                ,"cat "+ generatedString + ".pdb >> " + generatedString
                ,"mv " + generatedString + " " + generatedString + ".pdb"
                ,dssp + " --output-format=dssp -i " + generatedString + ".pdb"
                //,"rm "+ generatedString + "*"
                //,"rm $0"
                );

        String exesh = job.getDirectory()+"/"+generatedString+".sh";
        String pdbsh = job.getDirectory()+"/"+generatedString+".pdb";
        Path outexesh = Paths.get(exesh);
        Path outpdbsh = Paths.get(pdbsh);
        try {
            Files.write(outexesh, execFile);
            Files.write(outpdbsh, job.getPdb());
        } catch (Exception e) {
            e.printStackTrace();
        }

        //instert tag to nextflow
        //Path nextflowt = Paths.get(job.getDirectory()+"/tutorial.nf.t");
        /*Path nextflow = Paths.get(job.getDirectory()+"/"+job.getExec());
        try (Stream<String> lines = Files.lines(nextflow)) {
            List<String> replaced = lines
                    .map(line-> line.replaceAll("#REPLACETAG#", job.getTag()))
                    .collect(Collectors.toList());
            Files.write(nextflow, replaced);
        }*/
        //List<String> cmdexe = Arrays.asList(nextflowbin, "-q", "-bg", "run tutorial.nf", "-with-weblog http://localhost:8080");
        List<String> cmdexe = Arrays.asList("sh", exesh);
        logger.info(cmdexe.stream().reduce("",(a,b) -> a.concat(b).concat(" ")));
        Map<String,String> env = Collections.EMPTY_MAP;
        //env.put("JAVA_HOME",javahome);
        //env.put("PATH", "$JAVA_HOME/bin;$PATH");
        logger.info("JOB started");
        OutRunCommnad outRunCommnad = runCommand.run(cmdexe, env, new File(job.getDirectory()));
        return outRunCommnad;
    }
}
